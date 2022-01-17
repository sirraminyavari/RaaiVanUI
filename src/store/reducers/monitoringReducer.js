import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  totalUsersCount: true,
  membersCount: true,
  lastActivityTime: true,
  loginsCountSinceNDaysAgo: 30,
  count: 20,
  lowerBoundary: 1,
  monitoring: {},
};
//! Monitoring Slice
export const MonitoringSlice = createSlice({
  name: 'monitoring',
  initialState,
  reducers: {
    settotalUsersCount: (state, action) => {
      state.totalUsersCount = action.payload;
    },
    setmembersCount: (state, action) => {
      state.membersCount = action.payload;
    },
    setlastActivityTime: (state, action) => {
      state.lastActivityTime = action.payload;
    },
    setloginsCountSinceNDaysAgo: (state, action) => {
      state.loginsCountSinceNDaysAgo = action.payload;
    },
    setcount: (state, action) => {
      state.count = action.payload;
    },
    setlowerBoundary: (state, action) => {
      state.lowerBoundary = action.payload;
    },
    setMonitoring: (state, action) => {
      state.monitoring = action.payload;
    },
    setFetchingApps: (state, action) => {
      state.isFetching = action.payload;
    },
  },
});
// export const { setMonitoring, setFetchingApps } = MonitoringSlice.actions;
export default MonitoringSlice.reducer;
