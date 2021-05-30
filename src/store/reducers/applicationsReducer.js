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
  },
});

export default ApplicationsSlice.reducer;
