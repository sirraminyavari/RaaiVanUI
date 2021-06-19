import { createSlice } from '@reduxjs/toolkit';
import { loadLocalStorage, saveLocalStorage } from 'helpers/helpers';

const authUserId = window.RVGlobal?.CurrentUserID;
const appsKey = 'apps_' + authUserId;

//! Applications Slice
export const ApplicationsSlice = createSlice({
  name: 'applications',

  initialState: {
    applications: loadLocalStorage(appsKey) || [],
  },

  reducers: {
    setApplications: (state, action) => {
      state.applications = action.payload;
      saveLocalStorage(appsKey, action.payload);
    },
    deleteApplication: (state, action) => {
      const newApplications = state.applications.filter(
        (app) => app.ApplicationID !== action.payload
      );
      state.applications = newApplications;
      saveLocalStorage(appsKey, newApplications);
    },
    addApplication: (state, action) => {
      const savedApps = loadLocalStorage(appsKey);
      if (savedApps !== undefined) {
        savedApps.splice(savedApps.length - 2, 0, action.payload);
        state.applications = savedApps;
        saveLocalStorage(appsKey, savedApps);
      } else {
        const newApplications = state.applications.splice(
          state.applications.length - 2,
          0,
          action.payload
        );
        state.applications = newApplications;
        saveLocalStorage(appsKey, newApplications);
      }
    },
    clearApplications: (state, action) => {
      state.applications = [];
    },
  },
});

export default ApplicationsSlice.reducer;
