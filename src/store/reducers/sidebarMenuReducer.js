import { createSlice } from '@reduxjs/toolkit';

// Sidebar Menu Slice
export const sidebarMenuSlice = createSlice({
  name: 'sidebar-items',
  initialState: {
    nodeTypes: [],
    tree: [],
  },
  reducers: {
    setSidebarNodes: (state, action) => {
      state.nodeTypes = action.payload.NodeTypes;
      state.tree = action.payload.Tree;
    },
    toggleSidebarMenu: (state, action) => {
      let newItems = state.menuItems.map((item) => {
        if (item.id === action.payload) {
          item.isOpen = !item.isOpen;
          return item;
        }
        return item;
      });
      state.menuItems = newItems;
    },
  },
});

export default sidebarMenuSlice.reducer;
