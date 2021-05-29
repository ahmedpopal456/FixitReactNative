import axios from 'axios';
import { ConversationModel } from 'src/features/chat/models/chatModel';
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
    return (
      axios.get(`${config.chatApiUrl}/users/${this.userId}/conversations`)
        .then((response) => response.data.results)
        .catch((error) => console.error(error))
    );
  }
}
