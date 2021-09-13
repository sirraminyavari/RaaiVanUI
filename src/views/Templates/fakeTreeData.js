import { encodeBase64 } from 'helpers/helpers';

const list_3 = [
  {
    id: '1',
    IconURL: '../../images/Preview.png',
    Tags: [],
    TypeName: encodeBase64('لیست اطلاعات تماس'),
  },
  {
    id: '2',
    IconURL: '../../images/Preview.png',
    Tags: [],
    TypeName: encodeBase64('شرح شغلی'),
  },
  {
    id: '3',
    IconURL: '../../images/Preview.png',
    Tags: [],
    TypeName: encodeBase64('لیست متقاضیان شغل'),
  },
  {
    id: '4',
    IconURL: '../../images/Preview.png',
    Tags: [],
    TypeName: encodeBase64('اسناد مارکتینگ'),
  },
  {
    id: '5',
    IconURL: '../../images/Preview.png',
    Tags: [],
    TypeName: encodeBase64('تقویم محتوا'),
  },
];

const list_2 = [
  {
    id: '1',
    IconURL: '../../images/Preview.png',
    Tags: [],
    TypeName: encodeBase64('اسناد مارکتینگ'),
  },
  {
    id: '2',
    IconURL: '../../images/Preview.png',
    Tags: [],
    TypeName: encodeBase64('تقویم محتوا'),
  },
];

const list_1 = [
  {
    id: '1',
    IconURL: '../../images/Preview.png',
    Tags: [],
    TypeName: encodeBase64('لیست اطلاعات تماس'),
  },
  {
    id: '2',
    IconURL: '../../images/Preview.png',
    Tags: [],
    TypeName: encodeBase64('شرح شغلی'),
  },
  {
    id: '3',
    IconURL: '../../images/Preview.png',
    Tags: [],
    TypeName: encodeBase64('لیست متقاضیان شغل'),
  },
];

const fakeTreeData = {
  rootId: 'templates-class-tree',
  items: {
    'templates-class-tree': {
      id: 'templates-class-tree',
      children: ['1', '2', '3'],
      hasChildren: true,
      isCategory: true,
      isExpanded: true,
      isChildrenLoading: false,
      data: {
        title: 'Templates Class Tree',
      },
    },
    1: {
      id: '1',
      children: ['1-1'],
      hasChildren: true,
      isCategory: true,
      isExpanded: true,
      isChildrenLoading: false,
      data: {
        title: 'عنوان طولانی برای یک کلاس در حوزه مدیریت منابع انسانی',
      },
    },
    2: {
      id: '2',
      children: ['2-1'],
      hasChildren: true,
      isCategory: true,
      isExpanded: true,
      isChildrenLoading: false,
      data: {
        title: 'بازاریابی',
      },
    },
    3: {
      id: '3',
      children: ['3-1'],
      hasChildren: true,
      isCategory: true,
      isOther: true,
      isExpanded: true,
      isChildrenLoading: false,
      data: {
        title: 'دسته‌بندی نشده',
      },
    },
    '1-1': {
      id: '1-1',
      children: [],
      hasChildren: false,
      isCategory: false,
      isExpanded: false,
      isChildrenLoading: false,
      data: {
        templates: list_1,
      },
    },
    '2-1': {
      id: '2-1',
      children: [],
      hasChildren: false,
      isCategory: false,
      isExpanded: false,
      isChildrenLoading: false,
      data: {
        templates: list_2,
      },
    },
    '3-1': {
      id: '3-1',
      children: [],
      hasChildren: false,
      isCategory: false,
      isExpanded: false,
      isChildrenLoading: false,
      data: {
        templates: list_3,
      },
    },
  },
};

export default fakeTreeData;
