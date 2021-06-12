import { createSlice } from '@reduxjs/toolkit';

//! Applications Slice
export const ApplicationsSlice = createSlice({
  name: 'applications',

  initialState: {
    applications: [],
    currentUser: null,
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
      const newApplications = state.applications.push(action.payload);
      state.applications = newApplications;
    },
    clearApplications: (state, action) => {
      state.applications = [];
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
  },
});

export default ApplicationsSlice.reducer;
