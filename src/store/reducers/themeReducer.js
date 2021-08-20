import { createSlice } from '@reduxjs/toolkit';
import { MIN_WIDTH, MAX_WIDTH, MAIN_CONTENT } from 'constant/constants';

const getWidth = (width) => {
  if (width > MAX_WIDTH) {
    return MAX_WIDTH;
  } else if (width < MIN_WIDTH) {
    return MIN_WIDTH;
  } else {
    return width;
  }
};

// Theme Slice
export const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    isSidebarOpen: false,
    isSettingShown: false,
    hasNavSide: false,
    activePath: '',
    sidebarContent: { current: MAIN_CONTENT, prev: '' },
    selectedTeam: { name: null, id: null },
    allTeams: [],
    sidebarOpenWidth: 320,
    sidebarCurrentWidth: 320,
    sidebarCloseWidth: 64,
    sidebarMinWidth: MIN_WIDTH,
    sidebarMaxWidth: MAX_WIDTH,
    themes: [],
    currentTheme: null,
    isDarkMode: false,
    hasSidebarPattern: true,
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
    setSelectedTeam: (state, action) => {
      state.selectedTeam = action.payload;
    },
    handleSettings: (state, action) => {
      if (!state.isSidebarOpen) {
        state.isSidebarOpen = true;
      } else {
        state.isSettingShown = !state.isSettingShown;
      }
    },
    setOpenWidth: (state, action) => {
      state.sidebarOpenWidth = getWidth(action.payload);
    },
    setCurrentWidth: (state, action) => {
      state.sidebarCurrentWidth = getWidth(action.payload);
    },
    setThemes: (state, action) => {
      state.themes = action.payload;
    },
    setCurrentTheme: (state, action) => {
      state.currentTheme = action.payload;
    },
    setDarkMode: (state, action) => {
      state.isDarkMode = action.payload;
    },
    setSidebarPattern: (state, action) => {
      state.hasSidebarPattern = action.payload;
    },
  },
});

export default themeSlice.reducer;
