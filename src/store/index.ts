import { Reducer, applyMiddleware, createStore } from 'redux';
import { PersistGate } from 'redux-persist/integration/react';
import { PersistPartial } from 'redux-persist/es/persistReducer';
import thunk from 'redux-thunk';
import { Provider, connect, useSelector, useDispatch } from 'react-redux';
import { persistStore, persistReducer } from 'redux-persist';
import ConfigFactory from './config/factory/configFactory';
import * as persistentActions from './storage/persistentActions';
import ApplicationTypesEnum from './models/config/applicationTypesEnum';
import { ConfigModel } from './models/config/configModel';
import { PersistentStateModel } from './models/persistentStore/persistentStateModel';
import { RootState, rootReducer, persistConfig, rootReducerActions } from './rootReducer';
import ProfileService from './services/profileService';
import RatingsService from './services/ratingsService';
import NotificationsService from './services/notificationService';
import AddressService from './services/addressService';
import FixesService from './services/fixesService';
import UserService from './services/userService';
import * as notificationsActions from './slices/notificationsSlice';
import * as userSlice from './slices/userSlice';
import { FixRequestService, FixTemplateUpdateRequest, FixTemplateCreateRequest } from './services/fixRequestService';
import * as fixRequestSlice from './slices/fixRequestSlice';
import * as fixTemplateSlice from './slices/fixTemplateSlice';
import { ProfileModel } from './slices/profileSlice';
import { FixesModel, FixTagModel, SectionDetailsModel, SectionModel, ImageModel, TagModel } from './slices/fixesSlice';
import { AddressModel, AddressQueryItemModel } from './slices/addressSlice';
import { RatingsModel } from './slices/ratingSlice';
import { Category, Type, Unit } from './models/common';
import Status from './models/common/fixTemplateStatus';
import { Schedule } from './models/common/scheduleModel';
import { UserAddressModel, UserAddressModelBase } from './slices/userSlice';
import {
  DeviceInstallation,
  DeviceInstallationUpsertRequestDto,
  EnqueueNotificationRequestDto,
  NotificationPayloadDto,
  NotificationStatusUpdateRequestDto,
  NotificationStatusUpdateResponseDto,
  NotificationTagDto,
  NotificationTemplateBaseDto,
} from './models/notification';
import { NotificationDocument } from './models/notification/notificationDocument';
import { UserBaseModel, UserSummaryModel } from './models/user';
import { PagedDocumentCollection } from './models/common/pagedDocumentCollection';
import { OperationStatus } from './models/common/operationStatus';
import { NotificationPlatform, NotificationStatus, NotificationTypes } from './models/notification/enums';
import {
  ChatEntityTypes,
  ContextDetailsModel,
  ContextDetailsQueryModel,
  ConversationMessageAttachmentModel,
  ConversationMessageModel,
  ConversationModel,
  ConversationQueryModel,
  ConversationUpsertMessageModel,
  NewMessageModel,
  ParticipantModel,
  ParticipantQueryModel,
  QueryBuilderOperators,
  TimestampsQueryModel,
  UserQueryModel,
} from './models/chat/chatModels';
import { LicenseDto, UserLicenseDto } from './models/license';

const persistedRootReducer: Reducer<RootState & PersistPartial, any> = persistReducer(persistConfig, rootReducer);
const store = createStore(persistedRootReducer, applyMiddleware(thunk));
const persistor = persistStore(store);

export {
  ConfigFactory,
  Provider,
  PersistGate,
  store,
  persistor,
  persistentActions,
  notificationsActions,
  rootReducerActions,
  fixTemplateSlice as fixTemplateActions,
  fixRequestSlice as fixRequestActions,
  userSlice as userActions,
  ProfileService,
  RatingsService,
  FixesService,
  AddressService,
  UserService,
  NotificationsService,
  FixRequestService,
  Status as FixTemplateStatus,
  NotificationPlatform,
  NotificationStatus,
  NotificationTypes,
  QueryBuilderOperators,
  ChatEntityTypes,
  connect,
  useSelector,
  useDispatch,
  ApplicationTypesEnum,
};

type UserModel = userSlice.UserModel;
type FixRequestModel = fixRequestSlice.FixRequestModel;
type FixTemplateModel = fixTemplateSlice.FixTemplateModel;
type FixTemplateSection = fixTemplateSlice.FixTemplateSection;
type FixTemplateSectionField = fixTemplateSlice.FixTemplateSectionField;

export type {
  ConfigModel as Config,
  PersistentStateModel as PersistentState,
  RootState as StoreState,
  FixRequestModel,
  ProfileModel,
  UserAddressModelBase,
  UserAddressModel,
  RatingsModel,
  FixesModel,
  ImageModel,
  TagModel,
  FixTagModel,
  SectionModel,
  SectionDetailsModel,
  UserModel,
  FixTemplateModel,
  FixTemplateSection,
  UserSummaryModel,
  UserBaseModel,
  AddressModel,
  AddressQueryItemModel,
  Category,
  Type,
  Unit,
  FixTemplateSectionField,
  FixTemplateUpdateRequest,
  FixTemplateCreateRequest,
  Schedule,
  DeviceInstallation,
  DeviceInstallationUpsertRequestDto,
  EnqueueNotificationRequestDto,
  NotificationDocument,
  NotificationStatusUpdateRequestDto,
  NotificationStatusUpdateResponseDto,
  NotificationTagDto,
  NotificationPayloadDto,
  NotificationTemplateBaseDto,
  ParticipantModel,
  ConversationMessageModel,
  ConversationModel,
  ConversationMessageAttachmentModel,
  NewMessageModel,
  ContextDetailsModel,
  ConversationQueryModel,
  ContextDetailsQueryModel,
  ParticipantQueryModel,
  UserQueryModel,
  LicenseDto,
  UserLicenseDto,
  TimestampsQueryModel,
  ConversationUpsertMessageModel,
  PagedDocumentCollection,
  OperationStatus,
};
