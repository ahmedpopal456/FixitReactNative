import { createSlice } from '@reduxjs/toolkit';
import { FixitAction } from '../models/common/fixitAction';
import { Schedule } from '../models/common/scheduleModel';
import { ClientEstimatedCostModel } from '../models/common/clientEstimatedCostModel';
import { AddressModel } from './addressSlice';
import { LicenseDto } from '../models/license/licenseDto';
import { UserSummaryModel } from '../models/user';

export interface TagModel {
  id?: string;
  name: string;
}

export interface SectionDetailsModel {
  name: string;
  value: string;
}

export interface SectionModel {
  name: string;
  details: Array<SectionDetailsModel>;
}

export interface Details {
  name: string;
  description: string;
  category: string;
  type: string;
  unit?: string;
  sections: Array<SectionModel>;
}

export interface MetadataModel {
  createdTimeStampUTC: number;
  updatedTimeStampUTC: number;
}

export interface ImageModel {
  id: string;
  name: string;
  url: string;
  metadata: MetadataModel;
}

export interface AssignedToCraftsmanModel {
  id: string;
  firstName: string;
  lastName: string;
}

export interface CraftsmanEstimatedCostModel {
  cost: number;
  comment: string;
}

export interface FixTagModel {
  id: string;
  groupId: string;
  name: string;
  statistics: {
    createdTimestampUtc: number;
    updatedTimeStampUtc: number;
    totalFixesCount: number;
    completedFixesCount: number;
    percentageUsage: number;
  };
}

export interface FixTagWithAction {
  tags: Array<FixTagModel>;
  isLoading: boolean;
  error: any;
}

export interface FixesModel {
  id: string;
  activityHistoryId: string;
  assignedToCraftsman: AssignedToCraftsmanModel;
  billingActivityId: string;
  clientEstimatedCost: ClientEstimatedCostModel;
  craftsmanEstimatedCost: CraftsmanEstimatedCostModel;
  details: Details;
  images: Array<ImageModel>;
  licenses: Array<LicenseDto>;
  location?: AddressModel;
  schedule: Array<Schedule>;
  status: number;
  systemCalculatedCost: number;
  tags: Array<TagModel>;
  createdByClient: UserSummaryModel;
  updatedByUser: UserSummaryModel;
  createdTimestampUtc: number;
  updatedTimestampUtc: number;
}
export interface FixesStateWithAction {
  fixes: Array<FixesModel>;
  isLoading: boolean;
  error: any;
}

export interface UpdateFixStateWithAction {
  fix: FixesModel | undefined;
  isLoading: boolean;
  error: any;
}

export interface FixesStates {
  readonly newFixesState: FixesStateWithAction;
  readonly pendingFixesState: FixesStateWithAction;
  readonly inProgressFixesState: FixesStateWithAction;
  readonly inReviewFixesState: FixesStateWithAction;
  readonly completedFixesState: FixesStateWithAction;
  readonly terminatedFixesState: FixesStateWithAction;
  readonly topFixTagsState: FixTagWithAction;
  readonly updateFixState: UpdateFixStateWithAction;
  readonly terminatedByCraftsmanFixesState: FixesStateWithAction;
  readonly terminatedByClientFixesState: FixesStateWithAction;
}

export const fixesInitialState: FixesStates = {
  newFixesState: { fixes: [], isLoading: false, error: null },
  pendingFixesState: { fixes: [], isLoading: false, error: null },
  inProgressFixesState: { fixes: [], isLoading: false, error: null },
  inReviewFixesState: { fixes: [], isLoading: false, error: null },
  completedFixesState: { fixes: [], isLoading: false, error: null },
  terminatedFixesState: { fixes: [], isLoading: false, error: null },
  terminatedByCraftsmanFixesState: { fixes: [], isLoading: false, error: null },
  terminatedByClientFixesState: { fixes: [], isLoading: false, error: null },
  topFixTagsState: { tags: [], isLoading: false, error: null },
  updateFixState: { fix: undefined, isLoading: false, error: null },
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

const fixesSlice = createSlice({
  name: 'fixes',
  initialState: fixesInitialState,
  reducers: {
    RESET_FIXES_SLICE: () => fixesInitialState,
    FETCH_NEWFIXES_BEGIN: (state: FixesStates) => {
      state.newFixesState.error = null;
      state.newFixesState.isLoading = true;
    },
    FETCH_NEWFIXES_SUCCESS: {
      reducer: (state: FixesStates, action: FixitAction<FixesModel[]>) => {
        state.newFixesState.fixes = action.payload;
        state.newFixesState.isLoading = false;
        state.newFixesState.error = null;
      },
      prepare: (payload: FixesModel[]) => prepareSuccess(payload),
    },
    FETCH_NEWFIXES_FAILURE: {
      reducer: (state: FixesStates, action: FixitAction<FixesModel[]>) => {
        state.newFixesState.isLoading = false;
        state.newFixesState.error = action.error;
      },
      prepare: (error: any) => prepareFailure<FixesModel[]>(error),
    },
    FETCH_PENDINGFIXES_BEGIN: (state: FixesStates) => {
      state.pendingFixesState.error = null;
      state.pendingFixesState.isLoading = true;
    },
    FETCH_PENDINGFIXES_SUCCESS: {
      reducer: (state: FixesStates, action: FixitAction<FixesModel[]>) => {
        state.pendingFixesState.fixes = action.payload;
        state.pendingFixesState.isLoading = false;
        state.pendingFixesState.error = null;
      },
      prepare: (payload: FixesModel[]) => prepareSuccess(payload),
    },
    FETCH_PENDINGFIXES_FAILURE: {
      reducer: (state: FixesStates, action: FixitAction<FixesModel[]>) => {
        state.pendingFixesState.isLoading = false;
        state.pendingFixesState.error = action.error;
      },
      prepare: (error: any) => prepareFailure<FixesModel[]>(error),
    },
    FETCH_INPROGRESSFIXES_BEGIN: (state: FixesStates) => {
      state.inProgressFixesState.error = null;
      state.inProgressFixesState.isLoading = true;
    },
    FETCH_INPROGRESSFIXES_SUCCESS: {
      reducer: (state: FixesStates, action: FixitAction<FixesModel[]>) => {
        state.inProgressFixesState.fixes = action.payload;
        state.inProgressFixesState.isLoading = false;
        state.inProgressFixesState.error = null;
      },
      prepare: (payload: FixesModel[]) => prepareSuccess(payload),
    },
    FETCH_INPROGRESSFIXES_FAILURE: {
      reducer: (state: FixesStates, action: FixitAction<FixesModel[]>) => {
        state.inProgressFixesState.isLoading = false;
        state.inProgressFixesState.error = action.error;
      },
      prepare: (error: any) => prepareFailure<FixesModel[]>(error),
    },
    FETCH_INREVIEWFIXES_BEGIN: (state: FixesStates) => {
      state.inReviewFixesState.error = null;
      state.inReviewFixesState.isLoading = true;
    },
    FETCH_INREVIEWFIXES_SUCCESS: {
      reducer: (state: FixesStates, action: FixitAction<FixesModel[]>) => {
        state.inReviewFixesState.fixes = action.payload;
        state.inReviewFixesState.isLoading = false;
        state.inReviewFixesState.error = null;
      },
      prepare: (payload: FixesModel[]) => prepareSuccess(payload),
    },
    FETCH_INREVIEWFIXES_FAILURE: {
      reducer: (state: FixesStates, action: FixitAction<FixesModel[]>) => {
        state.inReviewFixesState.isLoading = false;
        state.inReviewFixesState.error = action.error;
      },
      prepare: (error: any) => prepareFailure<FixesModel[]>(error),
    },
    FETCH_COMPLETEDFIXES_BEGIN: (state: FixesStates) => {
      state.completedFixesState.error = null;
      state.completedFixesState.isLoading = true;
    },
    FETCH_COMPLETEDFIXES_SUCCESS: {
      reducer: (state: FixesStates, action: FixitAction<FixesModel[]>) => {
        state.completedFixesState.fixes = action.payload;
        state.completedFixesState.isLoading = false;
        state.completedFixesState.error = null;
      },
      prepare: (payload: FixesModel[]) => prepareSuccess(payload),
    },
    FETCH_COMPLETEDFIXES_FAILURE: {
      reducer: (state: FixesStates, action: FixitAction<FixesModel[]>) => {
        state.completedFixesState.isLoading = false;
        state.completedFixesState.error = action.error;
      },
      prepare: (error: any) => prepareFailure<FixesModel[]>(error),
    },
    FETCH_TERMINATEDFIXES_BEGIN: (state: FixesStates) => {
      state.terminatedFixesState.error = null;
      state.terminatedFixesState.isLoading = true;
    },
    FETCH_TERMINATEDFIXES_SUCCESS: {
      reducer: (state: FixesStates, action: FixitAction<FixesModel[]>) => {
        state.terminatedFixesState.fixes = action.payload;
        state.terminatedFixesState.isLoading = false;
        state.terminatedFixesState.error = null;
      },
      prepare: (payload: FixesModel[]) => prepareSuccess(payload),
    },
    FETCH_TERMINATEDFIXES_FAILURE: {
      reducer: (state: FixesStates, action: FixitAction<FixesModel[]>) => {
        state.terminatedFixesState.isLoading = false;
        state.terminatedFixesState.error = action.error;
      },
      prepare: (error: any) => prepareFailure<FixesModel[]>(error),
    },
    FETCH_TERMINATEDBYCRAFTSMANFIXES_SUCCESS: {
      reducer: (state: FixesStates, action: FixitAction<FixesModel[]>) => {
        state.terminatedByCraftsmanFixesState.fixes = action.payload;
        state.terminatedFixesState.isLoading = false;
        state.terminatedFixesState.error = null;
      },
      prepare: (payload: FixesModel[]) => prepareSuccess(payload),
    },
    FETCH_TERMINATEDBYCRAFTSMANFIXES_FAILURE: {
      reducer: (state: FixesStates, action: FixitAction<FixesModel[]>) => {
        state.terminatedByCraftsmanFixesState.isLoading = false;
        state.terminatedByCraftsmanFixesState.error = action.error;
      },
      prepare: (error: any) => prepareFailure<FixesModel[]>(error),
    },
    FETCH_TERMINATEDBYCLIENTFIXES_SUCCESS: {
      reducer: (state: FixesStates, action: FixitAction<FixesModel[]>) => {
        state.terminatedByClientFixesState.fixes = action.payload;
        state.terminatedFixesState.isLoading = false;
        state.terminatedFixesState.error = null;
      },
      prepare: (payload: FixesModel[]) => prepareSuccess(payload),
    },
    FETCH_TERMINATEDBYCLIENTFIXES_FAILURE: {
      reducer: (state: FixesStates, action: FixitAction<FixesModel[]>) => {
        state.terminatedByClientFixesState.isLoading = false;
        state.terminatedByClientFixesState.error = action.error;
      },
      prepare: (error: any) => prepareFailure<FixesModel[]>(error),
    },
    FETCH_POPULARFIXTAGS_BEGIN: (state: FixesStates) => {
      state.topFixTagsState.error = null;
      state.topFixTagsState.isLoading = true;
    },
    FETCH_POPULARFIXTAGS_SUCCESS: {
      reducer: (state: FixesStates, action: FixitAction<FixTagModel[]>) => {
        state.topFixTagsState.tags = action.payload;
        state.topFixTagsState.isLoading = false;
        state.topFixTagsState.error = null;
      },
      prepare: (payload: FixTagModel[]) => prepareSuccess(payload),
    },
    FETCH_POPULARFIXTAGS_FAILURE: {
      reducer: (state: FixesStates, action: FixitAction<FixTagModel[]>) => {
        state.topFixTagsState.isLoading = false;
        state.topFixTagsState.error = action.error;
      },
      prepare: (error: any) => prepareFailure<FixTagModel[]>(error),
    },
    UPDATE_FIX_BEGIN: (state: FixesStates) => {
      state.updateFixState.error = null;
      state.updateFixState.isLoading = true;
    },
    UPDATE_FIX_SUCCESS: {
      reducer: (state: FixesStates, action: FixitAction<FixesModel>) => {
        state.updateFixState.fix = action.payload;
        state.updateFixState.error = null;
        state.updateFixState.isLoading = false;
      },
      prepare: (payload: FixesModel) => prepareSuccess(payload),
    },
    UPDATE_FIX_FAILURE: {
      reducer: (state: FixesStates, action: FixitAction<FixesModel>) => {
        state.updateFixState.error = action.error;
        state.updateFixState.isLoading = false;
      },
      prepare: (error: any) => prepareFailure<FixesModel>(error),
    },
  },
});
export const {
  FETCH_NEWFIXES_BEGIN,
  FETCH_NEWFIXES_SUCCESS,
  FETCH_NEWFIXES_FAILURE,
  FETCH_PENDINGFIXES_BEGIN,
  FETCH_PENDINGFIXES_SUCCESS,
  FETCH_PENDINGFIXES_FAILURE,
  FETCH_INPROGRESSFIXES_BEGIN,
  FETCH_INPROGRESSFIXES_SUCCESS,
  FETCH_INPROGRESSFIXES_FAILURE,
  FETCH_INREVIEWFIXES_BEGIN,
  FETCH_INREVIEWFIXES_SUCCESS,
  FETCH_INREVIEWFIXES_FAILURE,
  FETCH_COMPLETEDFIXES_BEGIN,
  FETCH_COMPLETEDFIXES_SUCCESS,
  FETCH_COMPLETEDFIXES_FAILURE,
  FETCH_TERMINATEDFIXES_BEGIN,
  FETCH_TERMINATEDFIXES_SUCCESS,
  FETCH_TERMINATEDFIXES_FAILURE,
  FETCH_TERMINATEDBYCRAFTSMANFIXES_SUCCESS,
  FETCH_TERMINATEDBYCRAFTSMANFIXES_FAILURE,
  FETCH_TERMINATEDBYCLIENTFIXES_SUCCESS,
  FETCH_TERMINATEDBYCLIENTFIXES_FAILURE,
  FETCH_POPULARFIXTAGS_BEGIN,
  FETCH_POPULARFIXTAGS_SUCCESS,
  FETCH_POPULARFIXTAGS_FAILURE,
  RESET_FIXES_SLICE,
  UPDATE_FIX_BEGIN,
  UPDATE_FIX_SUCCESS,
  UPDATE_FIX_FAILURE,
} = fixesSlice.actions;

export default fixesSlice.reducer;
