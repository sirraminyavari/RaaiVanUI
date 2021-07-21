import { createSlice } from '@reduxjs/toolkit';

//! Invitations Slice
export const invitationSlice = createSlice({
  name: 'invitations',

  initialState: {
    teamInvitationList: {},
  },

  reducers: {
    setTeamInvitations: (state, action) => {
      state.teamInvitationList = action.payload;
    },
  },
});

export default invitationSlice.reducer;
