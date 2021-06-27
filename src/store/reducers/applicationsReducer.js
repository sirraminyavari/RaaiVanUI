import { createSlice } from '@reduxjs/toolkit';

//! Applications Slice
export const ApplicationsSlice = createSlice({
  name: 'applications',

  initialState: {
    applications: [],
    isFetching: false,
    selectingApp: { isSelecting: false, selectingAppId: null },
  },

  reducers: {
    setApplications: (state, action) => {
      state.applications = action.payload;
    },
    deleteApplication: (state, action) => {
      const newApplications = state.applications.filter(
        (app) => app.ApplicationID !== action.payload
      );
      state.applications = newApplications;
    },
    addApplication: (state, action) => {
      const appsLength = state.applications.length;
      state.applications.splice(appsLength - 2, 0, action.payload);
    },
    clearApplications: (state, action) => {
      state.applications = [];
    },
    setFetchingApps: (state, action) => {
      state.isFetching = action.payload;
    },
    setSelectingApp: (state, action) => {
      state.selectingApp = action.payload;
    },
  },
});

export default ApplicationsSlice.reducer;
