import { UserBaseModel, UserSummaryModel } from '../user';

export interface ParticipantModel {
  user: UserBaseModel;
  hasUnreadMessages: boolean;
}

export interface ConversationMessageModel {
  id: string;
  createdTimestampUtc: number;
  updatedTimestampUtc: number;
  createdByUser: UserBaseModel;
  updatedByUser: UserBaseModel;
  attachments: ConversationMessageAttachmentModel[];
  type: number;
  message: string;
}

export interface ConversationModel {
  id: string;
  entityId: string;
  details: ContextDetailsModel;
  participants: Array<ParticipantModel>;
  lastMessage: ConversationMessageModel;
  createdTimestampUtc: number;
  updatedTimestampUtc: number;
  isDeleted: boolean;
  deletedTimestampUtc: number;
}

export interface ConversationMessageAttachmentModel {
  fileId: string;
  attachmentUrl: string;
  attachmentThumbnailUrl: string;
}

export interface NewMessageModel {
  conversationId: string;
  recipient: UserSummaryModel;
  message: ConversationMessageModel;
}

export enum ChatEntityTypes {
  FIXES = 0,
}
export interface ContextDetailsModel {
  type: ChatEntityTypes;
  id: string;
  name: string;
}

export interface ConversationQueryModel {
  ids: string[];
  entityIds: string[];
  contextDetailsQuery: ContextDetailsQueryModel;
  participantQuery: ParticipantQueryModel;
  isDeleted?: boolean;
  deletedTimestampUtcQuery: TimestampsQueryModel;
}

export interface ContextDetailsQueryModel {
  types: ChatEntityTypes[];
  ids: string[];
}

export interface ParticipantQueryModel {
  user: UserQueryModel;
  hasUnreadMessages?: boolean;
}

export interface UserQueryModel {
  id: string;
  firstName: string;
  lastName: string;
}

export interface TimestampsQueryModel {
  queryBuilderOperator?: QueryBuilderOperators;
  minTimestampUtc: number;
  maxTimestampUtc?: number;
}

export enum QueryBuilderOperators {
  Equal,
  GreaterThan,
  GreaterThanEqual,
  LessThan,
  LessThanEqual,
}

export interface ConversationUpsertMessageModel {
  sentByUser: UserBaseModel;
  attachments: ConversationMessageAttachmentModel[];
  message: string;
}
