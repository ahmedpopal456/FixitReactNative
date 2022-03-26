import axios from 'axios';
// import { persistentStore } from 'store';
import * as signalR from '@microsoft/signalr';
import { HubConnection } from '@microsoft/signalr';
import { ConversationMessageModel, ConversationUpsertMessageModel } from '../../../store/models/chat/chatModels';
import { UserSummaryModel } from '../../../store/models/user';
import config from '../../config/appConfig';

export interface SignalRConnectionOptions {
  rejoinGroupOnHubStart?: boolean;
}

export interface SignalRConnectionInfo {
  url: string;
  accessToken: string;
}

export type MessageCallbackType = (response: ConversationMessageModel) => void;

export default class SignalRService {
  private userId: string | undefined;

  private conversationId: string | undefined;

  private callbackHook: MessageCallbackType;

  private hubConnection: HubConnection | undefined;

  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    this.callbackHook = () => {};
  }

  public setGroup(userId: string, conversationId: string): void {
    this.userId = userId;
    if (this.userId === '') {
      console.debug('user id cannot be empty');
    }
    this.conversationId = conversationId;
    if (this.conversationId === '') {
      console.debug('conversation id cannot be empty');
    }
  }

  public initializeGetConnectionInfoListener(
    callbackFn: MessageCallbackType = this.callbackHook,
    options?: SignalRConnectionOptions,
  ): Promise<any> {
    return this.getConnectionInfo().then((connectionInfo: SignalRConnectionInfo) => {
      console.debug('SignalR connection info:', connectionInfo);
      this.defineHubConnection(connectionInfo);
      this.connect(callbackFn, options);
    });
  }

  private defineHubConnection(connectionInfo: SignalRConnectionInfo) {
    const options = {
      accessTokenFactory: () => connectionInfo.accessToken,
    };
    const builder = new signalR.HubConnectionBuilder();
    const hubConnection = builder.withUrl(connectionInfo.url, options).withAutomaticReconnect([0, 2000, 5000]).build();

    console.debug('Starting signalR connection...');

    hubConnection.onreconnecting((error) => {
      console.debug('SignalR connection lost', error);
    });

    hubConnection.onreconnected((connectionId) => {
      console.debug('SignalR connection reestablished. Connected', connectionId);
    });

    hubConnection.onclose((error) => {
      console.debug('SignalR connection close', error);
      this.initializeGetConnectionInfoListener();
    });

    this.hubConnection = hubConnection;
  }

  private connect(callbackFn: MessageCallbackType, options?: SignalRConnectionOptions): void {
    this.hubConnection
      ?.start()
      .then(() => {
        console.debug('SR connection started');
        if (this.conversationId) {
          this.joinGroup(this.conversationId, callbackFn);
        }
      })
      .catch((err) => {
        console.debug(`Error while starting connection: ${err}`);
      });
  }

  private getConnectionInfo(): Promise<any> {
    return axios
      .post(`${config.rawConfig.chatTriggerUrl}/chat/users/${this.userId}/negotiate`, null)
      .then((response) => response.data)
      .catch((error) => {
        console.debug(error.response);
      });
  }

  private registerListener(callbackFn: MessageCallbackType, groupId: string): void {
    this.callbackHook = callbackFn;
    this.hubConnection?.on(groupId, (message: any) => {
      this.newMessage(JSON.stringify(message));
    });
  }

  private newMessage(message: string): void {
    this.callbackHook(JSON.parse(message));
  }

  public sendMessage(groupId: string, message: ConversationUpsertMessageModel): void {
    console.debug('Sending message to group:', groupId);
    this.hubConnection
      ?.invoke('SendMessageToGroup', groupId, message)
      .then(() => {
        console.debug('Message successfully sent!');
      })
      .catch((err) => {
        console.debug('Failed to send message to group:', groupId);
        console.debug(err);
      });
  }

  public async joinGroup(
    groupId: string = this.conversationId as string,
    callbackFn: MessageCallbackType = this.callbackHook,
  ): Promise<void> {
    this.conversationId = groupId;
    console.debug('Waiting to join group:', groupId);
    return new Promise((resolve, reject) => {
      this.hubConnection
        ?.invoke('joingroup', groupId, {
          id: this.userId,
        } as UserSummaryModel)
        .then(() => {
          console.debug(`Joined group ${groupId} successfully!`);
          console.debug('Setting up conversation listener...');
          this.registerListener(callbackFn, groupId);
          resolve();
        })
        .catch((err) => {
          console.debug(`Failed joining group ${groupId}!`);
          console.debug(err);
          reject(err);
        });
    });
  }

  public async leaveGroup(): Promise<void | undefined> {
    console.debug('Leaving group:', this.conversationId);
    const leavingGroup = this.conversationId;
    if (!this.conversationId) {
      return;
    }
    this.hubConnection?.off(this.conversationId); // Remove Handlers for old group
    this.hubConnection
      ?.invoke('leavegroup', this.conversationId)
      .then(() => {
        console.debug(`Left group ${this.conversationId} successfully!`);
        if (this.conversationId === leavingGroup) {
          this.conversationId = undefined;
          this.callbackHook = () => {
            console.log('empty');
          };
        }
      })
      .catch((err) => {
        console.debug(`Failed leaving group ${this.conversationId}!`);
        console.debug(err);
      });
  }

  getConnection(): HubConnection | undefined {
    return this.hubConnection;
  }
}
