import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { applicationSaga } from './saga';
import {
  EmptyApplicationState,
  IAppID,
  IAppIDUserID,
  IApplicationState,
} from './types';

const slice = createSlice({
  name: 'applications',
  initialState: EmptyApplicationState,
  reducers: {
    selectApplication: (
      _state: IApplicationState,
      _action: PayloadAction<IAppID>
    ) => {},
    getApplicationsOrder: (
      _state: IApplicationState,
      _action: PayloadAction<{ UnorderedApplications: any[] }>
    ) => {},
    getApplications: (
      state: IApplicationState,
      _action: PayloadAction<any>
    ) => {
      state.isFetching = true;
    },
    getArchivedApplications: (
      _state: IApplicationState,
      _action: PayloadAction<any>
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
      _state: IApplicationState,
      _action: PayloadAction<IAppID>
    ) => {},
    removeApplicationSuccessful: (
      state: IApplicationState,
      action: PayloadAction<any>
    ) => {
      state.userApps = action.payload;
    },
    recoverApplication: (
      _state: IApplicationState,
      _action: PayloadAction<IAppID>
    ) => {},
    addApplication: (state: IApplicationState, action: PayloadAction<any>) => {
      state.userApps = action.payload;
    },
    clearApplications: (state: IApplicationState) => {
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
      _state: IApplicationState,
      _action: PayloadAction<IAppID>
    ) => {},
    removeUserFromApplication: (
      _state: IApplicationState,
      _action: PayloadAction<IAppIDUserID>
    ) => {},
  },
});

export const { actions: applicationActions } = slice;

export const useApplicationSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: applicationSaga });
  return { actions: slice.actions };
};
