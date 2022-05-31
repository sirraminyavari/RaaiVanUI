import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { sidebarSaga } from './saga';

import {
  EmptySidebarState,
  IMoveNodeTypeRequest,
  IRecoverNodeTypeRequest,
  IRemoveNodeTypeRequest,
  ISidebarState,
} from './types';
import { PayloadAction } from '@reduxjs/toolkit';
import { IReduxActionCall } from '../types';

const slice = createSlice({
  name: 'sidebarItems',
  initialState: EmptySidebarState,
  reducers: {
    getSidebarNodeTypes: (
      state: ISidebarState,
      action: PayloadAction<IReduxActionCall>
    ) => {},
    setSidebarNodeTypes: (state: ISidebarState, action: PayloadAction<any>) => {
      state.nodeTypes = action.payload;
    },
    renameSidebarNodeType: (
      state: ISidebarState,
      action: PayloadAction<{ NodeTypeID: string; Name: string }>
    ) => {},
    removeSidebarNodeType: (
      state: ISidebarState,
      action: PayloadAction<IRemoveNodeTypeRequest>
    ) => {},
    recoverSidebarNodeType: (
      state: ISidebarState,
      action: PayloadAction<IRecoverNodeTypeRequest>
    ) => {},
    moveSidebarNodeType: (
      state: ISidebarState,
      action: PayloadAction<IMoveNodeTypeRequest>
    ) => {},
    reorderSidebarNodeTypes: (
      state: ISidebarState,
      action: PayloadAction<{ NodeTypeIDs: string[] }>
    ) => {},
    setSidebarTree: (state: ISidebarState, action: PayloadAction<any>) => {
      state.tree = action.payload;
    },
    setSidebarDnDTree: (state: ISidebarState, action: PayloadAction<any>) => {
      state.dndTree = action.payload;
    },
    toggleSidebarMenu: (state: ISidebarState, action: PayloadAction<any>) => {
      let IDs = state.openMenuID;
      if (IDs.includes(action.payload)) {
        let index = IDs.indexOf(action.payload);
        IDs.splice(index, 1);
        state.openMenuID = IDs;
      } else {
        state.openMenuID.push(action.payload);
      }
    },
    closeOpenMenus: (state: ISidebarState, action: PayloadAction<any>) => {
      state.openMenuID = [];
    },
    setSearchText: (state: ISidebarState, action: PayloadAction<any>) => {
      state.searchText = action.payload;
      if (action.payload.length >= 3) {
        state.showSearchResults = true;
      } else {
        state.showSearchResults = false;
      }
    },
    getFavoriteNodesCount: (state: ISidebarState) => {},
    setFavoriteNodesCount: (
      state: ISidebarState,
      action: PayloadAction<any>
    ) => {
      state.favoriteNodesCount = action.payload;
    },
    checkAuthority: (
      state: ISidebarState,
      action: PayloadAction<{ Permissions: string[] }>
    ) => {},
    setUnderMenuList: (state: ISidebarState, action: PayloadAction<any>) => {
      state.underMenuList = action.payload;
    },
    getConfigPanels: (state: ISidebarState) => {},
    setConfigPanels: (state: ISidebarState, action: PayloadAction<any>) => {
      state.configPanels = action.payload;
    },
  },
});

export const { actions: sidebarActions } = slice;

export const useSidebarSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: sidebarSaga });
  return { actions: slice.actions };
};
