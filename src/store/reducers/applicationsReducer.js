import { createSlice } from '@reduxjs/toolkit';

//! Applications Slice
export const ApplicationsSlice = createSlice({
  name: 'applications',

  initialState: {
    applications: [],
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
  },
});

export default ApplicationsSlice.reducer;
