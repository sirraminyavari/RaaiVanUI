import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { applicationSaga } from './saga';
import {
  EmptyApplicationState,
  IAppID,
  IAppIDs,
  IAppIDTitle,
  IAppIDUserID,
  IApplicationState,
  IWorkspaceIDTitle,
} from './types';

const slice = createSlice({
  name: 'application',
  initialState: EmptyApplicationState,
  reducers: {
    selectApplication: (
      state: IApplicationState,
      action: PayloadAction<IAppID>
    ) => {},
    createApplication: (
      state: IApplicationState,
      action: PayloadAction<IWorkspaceIDTitle>
    ) => {},
    getApplicationsOrder: (
      state: IApplicationState,
      action: PayloadAction<{ UnorderedApplications: any[] }>
    ) => {},
    setApplicationsOrder: (
      state: IApplicationState,
      action: PayloadAction<IAppIDs>
    ) => {},
    getApplications: (state: IApplicationState, action: PayloadAction<any>) => {
      state.isFetching = true;
    },
    getArchivedApplications: (
      state: IApplicationState,
      action: PayloadAction<any>
    ) => {},
    setApplications: (state: IApplicationState, action: PayloadAction<any>) => {
      state.userApps = action.payload;
    },
    setArchivedApplications: (
      state: IApplicationState,
      action: PayloadAction<any>
    ) => {
      state.userArchivedApps = action.payload;
    },
    removeApplication: (
      state: IApplicationState,
      action: PayloadAction<IAppID>
    ) => {},
    removeApplicationSuccessful: (
      state: IApplicationState,
      action: PayloadAction<any>
    ) => {
      state.userApps = action.payload;
    },
    recoverApplication: (
      state: IApplicationState,
      action: PayloadAction<IAppID>
    ) => {},
    addApplication: (state: IApplicationState, action: PayloadAction<any>) => {
      state.userApps = action.payload;
    },
    modifyApplication: (
      state: IApplicationState,
      action: PayloadAction<IAppIDTitle>
    ) => {},
    clearApplications: (
      state: IApplicationState,
      action: PayloadAction<any>
    ) => {
      state.userApps = [];
    },
    setFetchingApps: (state: IApplicationState, action: PayloadAction<any>) => {
      state.isFetching = action.payload;
    },
    setSelectingApp: (state: IApplicationState, action: PayloadAction<any>) => {
      state.selectingApp = action.payload;
    },
    setCurrentApp: (state: IApplicationState, action: PayloadAction<any>) => {
      state.currentApp = action.payload;
    },
    unsubscribeFromApplication: (
      state: IApplicationState,
      action: PayloadAction<IAppID>
    ) => {},
    removeUserFromApplication: (
      state: IApplicationState,
      action: PayloadAction<IAppIDUserID>
    ) => {},
  },
});

export const { actions: applicationActions } = slice;

export const useApplicationSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: applicationSaga });
  return { actions: slice.actions };
};
