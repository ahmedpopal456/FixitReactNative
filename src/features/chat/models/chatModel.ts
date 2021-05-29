export interface UserSummaryModel {
  id: string,
  firstName: string,
  lastName: string,
  profilePictureUrl: string,
  role: number,
  status: string
}
export interface ParticipantModel {
  user: UserSummaryModel,
  createdTimestampsUtc: number,
  updatedTimestampsUtc: number,
  unreadCount: number,
  lastRead: number
}
export interface MessageModel {
  id: string,
  createdTimestampsUtc: number,
  updatedTimestampsUtc: number,
  createdByUser: UserSummaryModel,
  type: number,
  message: string
}
export interface ConversationModel {
  id: string,
  entityId: string,
  fixInstanceId: string,
  participants: Array<ParticipantModel>,
  lastMessage: MessageModel,
  createdTimestampsUtc: number,
  updatedTimestampsUtc: number,
}
export interface NewMessageModel {
  conversationId: string,
  recipient: UserSummaryModel,
  message: MessageModel
}
