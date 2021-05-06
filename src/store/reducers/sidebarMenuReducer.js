import { createSlice } from '@reduxjs/toolkit';

//! Sidebar Menu Slice
export const sidebarMenuSlice = createSlice({
  name: 'sidebar-items',
  initialState: {
    nodeTypes: [],
    tree: [],
    openMenuID: [],
    searchText: '',
    showSearchResults: false,
    configPanels: [],
  },
  reducers: {
    setSidebarNodeTypes: (state, action) => {
      state.nodeTypes = action.payload;
    },
    setSidebarTree: (state, action) => {
      state.tree = action.payload;
    },
    toggleSidebarMenu: (state, action) => {
      let IDs = state.openMenuID;
      if (IDs.includes(action.payload)) {
        let index = IDs.indexOf(action.payload);
        IDs.splice(index, 1);
        state.openMenuID = IDs;
      } else {
        state.openMenuID.push(action.payload);
      }
    },
    closeOpenMenus: (state, action) => {
      state.openMenuID = [];
    },
    setSearchText: (state, action) => {
      state.searchText = action.payload;
      if (action.payload.length >= 3) {
        state.showSearchResults = true;
      } else {
        state.showSearchResults = false;
      }
    },
    setConfigPanels: (state, action) => {
      state.configPanels = action.payload;
    },
  },
});

export default sidebarMenuSlice.reducer;
