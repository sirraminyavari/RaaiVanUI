import { createSlice } from '@reduxjs/toolkit';

//! Sidebar Menu Slice
export const sidebarMenuSlice = createSlice({
  name: 'sidebar-items',
  initialState: {
    nodeTypes: [],
    tree: [],
    openMenuID: [],
    searchText: '',
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
    setReorderedTree: (state, action) => {
      state.tree = action.payload;
    },
    setSearchText: (state, action) => {
      state.searchText = action.payload;
    },
    setConfigPanels: (state, action) => {
      state.configPanels = action.payload;
    },
  },
});

export default sidebarMenuSlice.reducer;
