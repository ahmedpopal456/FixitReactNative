import { ConversationMessageModel, ConversationModel, ConversationQueryModel } from '../models/chat/chatModels';
import {
  FETCH_USER_CONVERSATIONS_BEGIN,
  FETCH_USER_CONVERSATIONS_FAILURE,
  FETCH_USER_CONVERSATIONS_SUCCESS,
  FETCH_USER_CONVERSATION_MESSAGES_BEGIN,
  FETCH_USER_CONVERSATION_MESSAGES_FAILURE,
  FETCH_USER_CONVERSATION_MESSAGES_SUCCESS,
} from '../slices/chatSlice';
import BaseConfigProvider from '../config/providers/baseConfigProvider';
export default class ChatService {
  private userId: string | undefined;
  config: BaseConfigProvider;
  store: any;

  constructor(userId: string, config: BaseConfigProvider, store: any) {
    this.config = config;
    this.store = store;
    this.userId = userId;
    if (this.userId === '') {
      console.error('user id cannot be empty');
    }
  }

  async getConversations(): Promise<Array<ConversationModel>> {
    this.store.dispatch(FETCH_USER_CONVERSATIONS_BEGIN());
    const conversationQuery = {
      participantQuery: { user: { id: this.userId } },
    } as ConversationQueryModel;

    const response = await fetch(`${this.config.chatBaseApiUrl}/conversations/query`, {
      body: JSON.stringify(conversationQuery),
      method: 'POST',
    }).catch((error) => this.store.dispatch(FETCH_USER_CONVERSATIONS_FAILURE(error)));

    const operation = await response.json();
    this.store.dispatch(FETCH_USER_CONVERSATIONS_SUCCESS(operation.result as ConversationModel[]));

    return operation;
  }

  async getMessages(
    conversationId: string,
    pageNumber: number,
    pageSize: number,
  ): Promise<Array<ConversationMessageModel>> {
    this.store.dispatch(FETCH_USER_CONVERSATION_MESSAGES_BEGIN());
    const response = await fetch(
      `${this.config.chatBaseApiUrl}/conversations/${conversationId}/messages?segmentSize=${pageSize}`,
      { method: 'GET' },
    ).catch((error) => {
      this.store.dispatch(FETCH_USER_CONVERSATION_MESSAGES_FAILURE(error));
    });

    const operation = await response?.json();
    this.store.dispatch(FETCH_USER_CONVERSATION_MESSAGES_SUCCESS(operation.results as ConversationMessageModel[]));

    return operation;
  }
}
