import axios from 'axios';
import {
  ConversationMessageModel,
  ConversationModel,
  ConversationQueryModel,
} from '../../../features/chat/models/chatModels';
import config from '../../config/appConfig';

export default class ChatService {
  private userId: string | undefined;

  constructor(userId: string) {
    this.userId = userId;
    if (this.userId === '') {
      console.error('user id cannot be empty');
    }
  }

  getConversations(): Promise<Array<ConversationModel>> {
    const conversationQuery = {
      participantQuery: { user: { id: this.userId } },
    } as ConversationQueryModel;

    return axios
      .post(`${config.chatApiUrl}/conversations/query`, conversationQuery)
      .then((response) => response.data.result)
      .catch((error) => console.error(error));
  }

  getMessages(conversationId: string, pageNumber = 1, pageSize = 100): Promise<Array<ConversationMessageModel>> {
    return axios
      .get(`${config.chatApiUrl}/conversations/${conversationId}/messages?segmentSize=${pageSize}`)
      .then((response) => response.data.results)
      .catch((error) => {
        console.log('messages not found');
        return [];
      });
  }
}
