import { createSlice } from '@reduxjs/toolkit';
import { loadLocalStorage, saveLocalStorage } from 'helpers/helpers';

const authUserId = window.RVGlobal?.CurrentUserID;

//! Applications Slice
export const ApplicationsSlice = createSlice({
  name: 'applications',

  initialState: {
    applications: loadLocalStorage(authUserId) || [],
  },

  reducers: {
    setApplications: (state, action) => {
      state.applications = action.payload;
      saveLocalStorage(authUserId, action.payload);
    },
    deleteApplication: (state, action) => {
      const newApplications = state.applications.filter(
        (app) => app.ApplicationID !== action.payload
      );
      state.applications = newApplications;
      saveLocalStorage(authUserId, newApplications);
    },
    addApplication: (state, action) => {
      const newApplications = state.applications.push(action.payload);
      state.applications = newApplications;
      saveLocalStorage(authUserId, newApplications);
    },
    clearApplications: (state, action) => {
      state.applications = [];
    },
  },
});

export default ApplicationsSlice.reducer;
