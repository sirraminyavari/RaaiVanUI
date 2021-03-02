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
      state.nodeTypes = action.payload.filter((node) => !node.Hidden);
    },
    setSidebarTree: (state, action) => {
      if (state.tree.length !== action.payload.length) {
        state.tree = action.payload
          .filter((node) => !node.Hidden)
          .map((tree) => {
            if (tree.Sub) {
              let newSub = tree.Sub.filter((s) => !s.Hidden);
              tree.Sub = newSub;
              return tree;
            }
            return tree;
          });
      }
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
