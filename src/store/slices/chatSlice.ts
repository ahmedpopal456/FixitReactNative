import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ConversationMessageModel, ConversationModel } from '../models/chat/chatModels';
import { FixitAction } from '../models/common/fixitAction';

export interface ChatConversationsStateWithAction {
  conversations: ConversationModel[];
  isLoading: boolean;
  error: any;
}

export interface ChatMessagesStateWithAction {
  messages: ConversationMessageModel[];
  isLoading: boolean;
  error: any;
}

export interface ChatState {
  readonly userConversations: ChatConversationsStateWithAction;
  readonly selectedConversationMessages: ChatMessagesStateWithAction;
}

export const chatInitialState: ChatState = {
  selectedConversationMessages: {
    isLoading: false,
    error: null,
    messages: [],
  },
  userConversations: {
    isLoading: false,
    error: null,
    conversations: [],
  },
};

const prepareSuccess = <T>(payload: T): FixitAction<T> => ({
  payload,
  type: 'inherit',
  meta: 'empty',
  error: null,
});

const prepareFailure = <T>(error: any): FixitAction<T> => ({
  payload: {} as T,
  type: 'inherit',
  meta: 'empty',
  error,
});

const chatSlice = createSlice({
  name: 'user',
  initialState: chatInitialState,
  reducers: {
    FETCH_USER_CONVERSATIONS_BEGIN: (state) => {
      state.userConversations.error = null;
      state.userConversations.isLoading = true;
    },
    FETCH_USER_CONVERSATIONS_SUCCESS: {
      reducer: (state, action: FixitAction<ConversationModel[]>) => {
        state.userConversations.isLoading = false;
        state.userConversations.error = null;
        state.userConversations.conversations = action.payload;
      },
      prepare: (payload: ConversationModel[]) => prepareSuccess(payload),
    },
    FETCH_USER_CONVERSATIONS_FAILURE: {
      reducer: (state, action: FixitAction<ConversationModel[]>) => {
        state.userConversations.isLoading = false;
        state.userConversations.error = action.error;
      },
      prepare: (error: any) => prepareFailure<ConversationModel[]>(error),
    },
    FETCH_USER_CONVERSATION_MESSAGES_BEGIN: (state) => {
      state.selectedConversationMessages.error = null;
      state.selectedConversationMessages.isLoading = true;
    },
    FETCH_USER_CONVERSATION_MESSAGES_SUCCESS: {
      reducer: (state, action: FixitAction<ConversationMessageModel[]>) => {
        state.selectedConversationMessages.isLoading = false;
        state.selectedConversationMessages.error = null;
        state.selectedConversationMessages.messages = action.payload?.reverse();
      },
      prepare: (payload: ConversationMessageModel[]) => prepareSuccess(payload),
    },
    FETCH_USER_CONVERSATION_MESSAGES_FAILURE: {
      reducer: (state, action: FixitAction<ConversationMessageModel[]>) => {
        state.selectedConversationMessages.isLoading = false;
        state.selectedConversationMessages.error = action.error;
      },
      prepare: (error: any) => prepareFailure<ConversationMessageModel[]>(error),
    },
    PUSH_MESSAGE_TO_CONVERSATION: (state, action: PayloadAction<ConversationMessageModel>) => {
      state.selectedConversationMessages.messages.push(action.payload);
    },
    RESET_MESSAGES_FROM_CONVERSATION: (state) => {
      state.selectedConversationMessages.messages = [];
    },
  },
});

export const {
  FETCH_USER_CONVERSATIONS_BEGIN,
  FETCH_USER_CONVERSATIONS_SUCCESS,
  FETCH_USER_CONVERSATIONS_FAILURE,
  FETCH_USER_CONVERSATION_MESSAGES_BEGIN,
  FETCH_USER_CONVERSATION_MESSAGES_SUCCESS,
  FETCH_USER_CONVERSATION_MESSAGES_FAILURE,
  PUSH_MESSAGE_TO_CONVERSATION,
  RESET_MESSAGES_FROM_CONVERSATION,
} = chatSlice.actions;
export default chatSlice.reducer;
