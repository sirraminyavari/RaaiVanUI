import { createSlice } from '@reduxjs/toolkit';
import { encodeBase64 } from 'helpers/helpers';

//! Sidebar Menu Slice
export const sidebarMenuSlice = createSlice({
  name: 'sidebar-items',
  initialState: {
    nodeTypes: [],
    tree: [],
    editingTree: [],
    openMenuID: [],
    searchText: '',
    isCreatingNode: false,
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
    setNewNode: (state, action) => {
      let newNode = {
        NodeTypeID: 'new',
        TypeName: encodeBase64('ایجاد دسته جدید'),
        edited: false,
        deleted: false,
        created: false,
        creating: true,
        moved: false,
      };
      state.editingTree = [...state.editingTree, newNode];
      state.isCreatingNode = true;
    },
    createNewNode: (state, action) => {
      state.editingTree = state.editingTree.map((t) => {
        if (t.NodeTypeID === 'new') {
          return Object.assign({}, t, { created: true, creating: false });
        }
        return t;
      });
      state.isCreatingNode = false;
    },
    cancelNewNode: (state, action) => {
      state.editingTree = state.editingTree.filter((t) => {
        return t.NodeTypeID !== 'new';
      });
      state.isCreatingNode = false;
    },
  },
});

export default sidebarMenuSlice.reducer;
