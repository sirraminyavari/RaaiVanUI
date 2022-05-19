import { MIN_WIDTH, MAX_WIDTH, MAIN_CONTENT } from 'constant/constants';

interface ISidebarContent {
  current: string;
  prev: string;
}

interface ISelectedTeam {
  name?: string | null;
  id?: string | null;
}

export interface IThemeState {
  isSidebarOpen: boolean;
  isSettingShown: boolean;
  hasNavSide: boolean;
  activePath: string;
  sidebarContent: ISidebarContent;
  selectedTeam: ISelectedTeam;
  allTeams: any[];
  sidebarOpenWidth: number;
  sidebarCurrentWidth: number;
  sidebarCloseWidth: number;
  sidebarMinWidth: number;
  sidebarMaxWidth: number;
  themes: any[];
  currentTheme?: any;
  isDarkMode: boolean;
  hasSidebarPattern: boolean;
}

export const EmptyThemeState: IThemeState = {
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
};
