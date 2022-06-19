import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { themeSaga } from './saga';

import { MIN_WIDTH, MAX_WIDTH } from 'constant/constants';
import { EmptyThemeState, IThemeState } from './types';
import { PayloadAction } from '@reduxjs/toolkit';

const getWidth = (width) => {
  if (width > MAX_WIDTH) {
    return MAX_WIDTH;
  } else if (width < MIN_WIDTH) {
    return MIN_WIDTH;
  } else {
    return width;
  }
};

const slice = createSlice({
  name: 'theme',
  initialState: EmptyThemeState,
  reducers: {
    toggleSidebar: (state: IThemeState, action: PayloadAction<any>) => {
      state.isSidebarOpen = action.payload;
    },
    toggleSetting: (state: IThemeState, action: PayloadAction<any>) => {
      state.isSettingShown = action.payload;
    },
    toggleNavSide: (state: IThemeState, action: PayloadAction<any>) => {
      state.hasNavSide = action.payload;
    },
    setActivePath: (state: IThemeState, action: PayloadAction<any>) => {
      state.activePath = action.payload;
    },
    setSidebarContent: (state: IThemeState, action: PayloadAction<any>) => {
      state.sidebarContent = action.payload;
    },
    setSelectedTeam: (state: IThemeState, action: PayloadAction<any>) => {
      state.selectedTeam = action.payload;
    },
    handleSettings: (state: IThemeState, action: PayloadAction<any>) => {
      if (!state.isSidebarOpen) {
        state.isSidebarOpen = true;
      } else {
        state.isSettingShown = !state.isSettingShown;
      }
    },
    setOpenWidth: (state: IThemeState, action: PayloadAction<any>) => {
      state.sidebarOpenWidth = getWidth(action.payload);
    },
    setCurrentWidth: (state: IThemeState, action: PayloadAction<any>) => {
      state.sidebarCurrentWidth = getWidth(action.payload);
    },
    getThemes: (state: IThemeState, action: PayloadAction<any>) => {},
    getCurrentTheme: (state: IThemeState, action: PayloadAction<any>) => {},
    setTheme: (state: IThemeState, action: PayloadAction<any>) => {
      state.themes = action.payload;
    },
    setCurrentTheme: (state: IThemeState, action: PayloadAction<any>) => {
      state.currentTheme = action.payload;
    },
    setDarkMode: (state: IThemeState, action: PayloadAction<any>) => {
      state.isDarkMode = action.payload;
    },
    setSidebarPattern: (state: IThemeState, action: PayloadAction<any>) => {
      state.hasSidebarPattern = action.payload;
    },
    setSidebarVisibility: (state: IThemeState, action) => {
      if (action.payload === 'hidden') state.hideSidebar = true;
      else state.hideSidebar = false;
    },
  },
});

export const { actions: themeActions } = slice;

export const useThemeSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: themeSaga });
  return { actions: slice.actions };
};
