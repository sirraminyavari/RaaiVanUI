import { createSlice } from '@reduxjs/toolkit';

//! Sidebar Menu Slice
export const sidebarMenuSlice = createSlice({
  name: 'sidebar-items',
  initialState: {
    nodeTypes: [],
    tree: [],
    editingTree: [],
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
    setReorderedTree: (state, action) => {
      state.editingTree = action.payload;
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
    setEditingTree: (state, action) => {
      state.editingTree = action.payload;
    },
  },
});

export default sidebarMenuSlice.reducer;
