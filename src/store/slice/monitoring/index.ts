import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { monitoringSaga } from './saga';
import { EmptyMonitoringState, IMonitoringState } from './types';
import { PayloadAction } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'monitoring',
  initialState: EmptyMonitoringState,
  reducers: {
    getApplicationsMonitoring: (
      state: IMonitoringState,
      action: PayloadAction<any>
    ) => {},
    setTotalUsersCount: (
      state: IMonitoringState,
      action: PayloadAction<number>
    ) => {
      state.totalUsersCount = action.payload;
    },
    setMembersCount: (
      state: IMonitoringState,
      action: PayloadAction<number>
    ) => {
      state.membersCount = action.payload;
    },
    setLastActivityTime: (
      state: IMonitoringState,
      action: PayloadAction<string>
    ) => {
      state.lastActivityTime = action.payload;
    },
    setLoginsCountSinceNDaysAgo: (
      state: IMonitoringState,
      action: PayloadAction<number>
    ) => {
      state.loginsCountSinceNDaysAgo = action.payload;
    },
    setCount: (state: IMonitoringState, action: PayloadAction<number>) => {
      state.count = action.payload;
    },
    setLowerBoundary: (
      state: IMonitoringState,
      action: PayloadAction<number>
    ) => {
      state.lowerBoundary = action.payload;
    },
    setMonitoring: (state: IMonitoringState, action: PayloadAction<any>) => {
      state.monitoring = action.payload;
    },
    setFetchingApps: (
      state: IMonitoringState,
      action: PayloadAction<boolean>
    ) => {
      state.isFetching = action.payload;
    },
  },
});

export const { actions: monitoringActions } = slice;

export const useMonitoringSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: monitoringSaga });
  return { actions: slice.actions };
};
