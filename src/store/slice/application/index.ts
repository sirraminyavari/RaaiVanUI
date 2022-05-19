import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { applicationSaga } from './saga';

const slice = createSlice({
  name: 'application',
  initialState: {
    userApps: [],
    userArchivedApps: [],
    isFetching: false,
    selectingApp: { isSelecting: false, selectingAppId: null },
    currentApp: null,
  },
  reducers: {
    selectApplication: (state, action) => {},
    createApplication: (state, action) => {},
    setApplicationsOrder: (state, action) => {},
    getApplications: (state, action) => {
      state.isFetching = true;
    },
    getArchivedApplications: (state, action) => {},
    setApplications: (state, action) => {
      state.userApps = action.payload;
    },
    setArchivedApplications: (state, action) => {
      state.userArchivedApps = action.payload;
    },
    removeApplication: (state, action) => {},
    removeApplicationSuccessful: (state, action) => {
      state.userApps = action.payload;
    },
    recoverApplication: (state, action) => {},
    addApplication: (state, action) => {
      state.userApps = action.payload;
    },
    modifyApplication: (state, action) => {},
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

export const { actions: applicationActions } = slice;

export const useApplicationSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: applicationSaga });
  return { actions: slice.actions };
};
