import { createSlice } from '@reduxjs/toolkit';

// Sidebar Menu Slice
export const sidebarMenuSlice = createSlice({
  name: 'sidebar-items',
  initialState: {
    menuItems: [
      {
        id: 1,
        title: 'منابع انسانی',
        path: '/services',
        icon: 'home',
      },
      {
        id: 2,
        title: 'مدیریت',
        subMenu: [
          { title: 'اسناد مارکتینگ', path: '/manager/mark' },
          { title: 'تقویم محتوایی', path: '/manager/mark' },
        ],
        isOpen: true,
      },
      {
        id: 3,
        title: 'منابع انسانی',
        subMenu: [
          { title: 'اسناد مارکتینگ', path: '/manager/mark' },
          { title: 'تقویم محتوایی', path: '/manager/mark' },
        ],
        isOpen: false,
      },
      {
        id: 4,
        title: 'منابع انسانی',
        subMenu: [
          { title: 'اسناد مارکتینگ', path: '/manager/mark' },
          { title: 'تقویم محتوایی', path: '/manager/mark' },
        ],
        isOpen: false,
      },
    ],
  },
  reducers: {
    getSidebarItems: (state, action) => {
      state.menuItems = action.payload;
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
