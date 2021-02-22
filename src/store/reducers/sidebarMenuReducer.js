import { createSlice } from '@reduxjs/toolkit';

//! Sidebar Menu Slice
export const sidebarMenuSlice = createSlice({
  name: 'sidebar-items',
  initialState: {
    nodeTypes: [],
    tree: [],
    openMenuID: [],
    searchResults: [],
  },
  reducers: {
    setSidebarNodes: (state, action) => {
      state.nodeTypes = action.payload.NodeTypes.filter((node) => !node.Hidden);
      if (state.tree.length !== action.payload?.Tree.length) {
        state.tree = action.payload.Tree.filter((node) => !node.Hidden).map(
          (tree) => {
            if (tree.Sub) {
              let newSub = tree.Sub.filter((s) => !s.Hidden);
              tree.Sub = newSub;
              return tree;
            }
            return tree;
          }
        );
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
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },
  },
});

export default sidebarMenuSlice.reducer;
