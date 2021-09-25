import { createSlice } from '@reduxjs/toolkit';

//! Applications Slice
export const ApplicationsSlice = createSlice({
  name: 'applications',

  initialState: {
    userApps: [],
    userArchivedApps: [],
    isFetching: false,
    selectingApp: { isSelecting: false, selectingAppId: null },
    currentApp: null,
  },

  reducers: {
    setApplications: (state, action) => {
      state.userApps = action.payload;
    },
    setArchivedApplications: (state, action) => {
      state.userArchivedApps = action.payload;
    },
    deleteApplication: (state, action) => {
      state.userApps = action.payload;
    },
    addApplication: (state, action) => {
      state.userApps = action.payload;
    },
    clearApplications: (state, action) => {
      state.userApps = [];
    },
    setFetchingApps: (state, action) => {
      state.isFetching = action.payload;
    },
    setSelectingApp: (state, action) => {
      state.selectingApp = action.payload;
    },
    setCurrentApp: (state, action) => {
      state.currentApp = action.payload;
    },
  },
});

export default ApplicationsSlice.reducer;
