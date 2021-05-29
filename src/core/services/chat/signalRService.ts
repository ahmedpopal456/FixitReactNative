import axios from 'axios';
// import { persistentStore } from 'fixit-common-data-store';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { MessageModel, UserSummaryModel } from 'src/features/chat/models/chatModel';
import config from '../../config/appConfig';

export default class SignalRService {
  private userId: string | undefined;

  private conversationId: string | undefined;

  private connection: HubConnection | undefined;

  constructor(userId: string, conversationId: string) {
    this.userId = userId;
    if (this.userId === '') {
      console.error('user id cannot be empty');
    }

    this.conversationId = conversationId;
    if (this.conversationId === '') {
      console.error('conversation id cannot be empty');
    }
  }

  getConnection(): HubConnection | undefined {
    return this.connection;
  }

  private getAxiosConfig() {
    return {
      headers: {
        'x-ms-signalr-user-id': this.userId,
      },
    };
  }

  private getConnectionInfo(): Promise<Response> {
    return (
      axios.post(`${config.chatTriggerUrl}/negotiate`, null, this.getAxiosConfig())
        .then((response) => response.data)
        .catch((error) => console.error(error.response.data))
    );
  }

  buildConnection(): Promise<void | Response> {
    return this.getConnectionInfo()
      .then((info) => {
        const option = {
          accessTokenFactory: () => info.accessToken,
        };
        this.connection = new HubConnectionBuilder()
          .withUrl(info.url, option)
          .build();
      })
      .catch((error) => console.error(error));
  }

  sendMessage(sender: UserSummaryModel, recipient: UserSummaryModel, message: string) : void {
    if (this.connection && message) {
      this.connection.invoke('sendToUser', this.conversationId, sender, recipient, message)
      // .then(() => console.log(`sent message ${message}`))
        .catch((error) => console.error(error));
    }
  }

  getMessages(pageNumber = 1, pageSize = 100): Promise<Array<MessageModel>> {
    return (
      axios.get(`${config.chatApiUrl}/users/me/conversations/${this.conversationId}
      /messages?pageNumber=${pageNumber}&pageSize=${pageSize}`)
        .then((response) => response.data.messages)
        .catch((error) => { console.log('messages not found'); return []; })
    );
  }
}
