import { createSlice } from '@reduxjs/toolkit';

//! Invitations Slice
export const invitationSlice = createSlice({
  name: 'invitations',

  initialState: {
    teamInvitationList: {},
    invitationModal: { isOpen: false, inviteApp: null },
  },

  reducers: {
    setTeamInvitations: (state, action) => {
      state.teamInvitationList = action.payload;
    },
    closeInvitationModal: (state, action) => {
      state.invitationModal = { isOpen: false, inviteApp: null };
    },
    openInvitationModal: (state, action) => {
      state.invitationModal = { isOpen: true, inviteApp: action.payload };
    },
  },
});

export default invitationSlice.reducer;
