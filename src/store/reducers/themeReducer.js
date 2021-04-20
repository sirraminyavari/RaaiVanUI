import { createSlice } from '@reduxjs/toolkit';

// Theme Slice
export const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    isSidebarOpen: false,
    isSettingShown: false,
    hasNavSide: false,
    activePath: '',
    sidebarContent: 'main',
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
    setActivePath: (state, action) => {
      state.activePath = action.payload;
    },
    setSidebarContent: (state, action) => {
      state.sidebarContent = action.payload;
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
