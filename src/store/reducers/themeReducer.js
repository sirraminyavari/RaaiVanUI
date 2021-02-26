import { createSlice } from '@reduxjs/toolkit';

// Theme Slice
export const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    isSidebarOpen: false,
    isSettingShown: false,
    hasNavSide: false,
  },
  reducers: {
    toggleSidebar: (state, action) => {
      state.isSidebarOpen = action.payload;
    },
    toggleSetting: (state, action) => {
      state.isSettingShown = action.payload;
    },
    toggleNavSide: (state, action) => {
      state.hasNavSide = action.payload;
    },
    handleSettings: (state, action) => {
      if (!state.isSidebarOpen) {
        state.isSidebarOpen = true;
        state.isSettingShown = true;
      } else {
        state.isSettingShown = !state.isSettingShown;
      }
    },
  },
});

export default themeSlice.reducer;
