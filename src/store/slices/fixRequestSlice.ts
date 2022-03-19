import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Schedule } from '../models/common/scheduleModel';
import { UserSummaryModel } from './userSlice';
import { AddressModel } from './addressSlice';
import { FixesModel, SectionDetailsModel, SectionModel, TagModel } from './fixesSlice';

export type FixRequestModel = Pick<
  FixesModel,
  | 'id'
  | 'tags'
  | 'details'
  | 'location'
  | 'schedule'
  | 'clientEstimatedCost'
  | 'createdByClient'
  | 'updatedByUser'
  | 'status'
  | 'images'
>;

export type FixRequestState = FixRequestModel;

export const fixRequestInitialState: FixRequestState = {
  id: '',
  tags: [],
  details: {
    name: '',
    description: '',
    category: 'Foundation',
    type: 'Quick Fix',
    sections: [
      {
        name: '',
        details: [
          {
            name: '',
            value: '',
          },
        ],
      },
    ],
    unit: 'Front Yard',
  },
  location: {
    AddressComponents: [],
    formattedAddress: '',
  },
  schedule: [],
  images: [],
  clientEstimatedCost: {
    maximumCost: 0,
    minimumCost: 0,
  },
  createdByClient: {
    userPrincipalName: '',
    firstName: '',
    lastName: '',
    savedAddresses: [],
    role: 1,
    status: { lastSeenTimestampUtc: 0, status: 1 },
  },
  updatedByUser: {
    userPrincipalName: '',
    firstName: '',
    lastName: '',
    savedAddresses: [],
    role: 1,
    status: { lastSeenTimestampUtc: 0, status: 1 },
  },
  status: 0,
};

type CreatedByUserPick = Pick<
  UserSummaryModel,
  'firstName' | 'lastName' | 'savedAddresses' | 'role' | 'status' | 'userPrincipalName'
>;

type UpdatedByUserPick = Pick<
  UserSummaryModel,
  'firstName' | 'lastName' | 'savedAddresses' | 'role' | 'status' | 'userPrincipalName'
>;

const fixRequestSlice = createSlice({
  name: 'fixRequest',
  initialState: fixRequestInitialState,
  reducers: {
    setFixSectionTitle: (state: FixRequestState, action: PayloadAction<{ index: number; sectionName: string }>) => {
      if (state.details.sections[action.payload.index]) {
        state.details.sections[action.payload.index].name = action.payload.sectionName;
      } else {
        state.details.sections[action.payload.index] = {
          name: action.payload.sectionName,
          details: [],
        };
      }
    },
    setFixSectionDetails: (
      state: FixRequestState,
      action: PayloadAction<{
        index: number;
        details: Array<SectionDetailsModel>;
      }>,
    ) => {
      if (state.details.sections[action.payload.index]) {
        state.details.sections[action.payload.index] = {
          name: state.details.sections[action.payload.index] ? state.details.sections[action.payload.index].name : '',
          details: action.payload.details,
        };
      }
    },
    addFixRequestTag: (state: FixRequestState, action: PayloadAction<TagModel>) => {
      state.tags.push(action.payload);
    },
    setFixRequestAddress: (state: FixRequestState, action: PayloadAction<{ address: AddressModel }>) => {
      state.location = action.payload.address;
    },
    setFixRequestSchedules: (state: FixRequestState, action: PayloadAction<Array<Schedule>>) => {
      state.schedule = action.payload;
    },
    setFixRequestClientMinEstimatedCost: (state: FixRequestState, action: PayloadAction<{ minimumCost: number }>) => {
      state.clientEstimatedCost.minimumCost = action.payload.minimumCost;
    },
    setFixRequestClientMaxEstimatedCost: (state: FixRequestState, action: PayloadAction<{ maximumCost: number }>) => {
      state.clientEstimatedCost.maximumCost = action.payload.maximumCost;
    },
    setFixRequestCreatedByUser: (state: FixRequestState, action: PayloadAction<CreatedByUserPick>) => {
      state.createdByClient = action.payload;
    },
    setFixRequestUpdatedByUser: (state: FixRequestState, action: PayloadAction<UpdatedByUserPick>) => {
      state.updatedByUser = action.payload;
    },
    setFixRequestDetailsSection: (
      state: FixRequestState,
      action: PayloadAction<{ index: number; section: SectionModel }>,
    ) => {
      state.details.sections[action.payload.index] = action.payload.section;
    },
    clearData: () => fixRequestInitialState,
  },
});

export const {
  setFixRequestClientMaxEstimatedCost,
  setFixRequestClientMinEstimatedCost,
  setFixRequestCreatedByUser,
  setFixRequestDetailsSection,
  setFixRequestAddress,
  setFixRequestUpdatedByUser,
  setFixRequestSchedules,
  addFixRequestTag,
  setFixSectionTitle,
  setFixSectionDetails,
  clearData,
} = fixRequestSlice.actions;

export default fixRequestSlice.reducer;
