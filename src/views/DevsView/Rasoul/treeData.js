export const customTreeData = [
  {
    key: '0',
    label: 'گروه اول',
    children: [
      {
        key: '0-0',
        label: 'زیرگروه اول',

        children: [
          {
            key: '0-1-1',
            label: 'شاخه ۱',
          },
          {
            key: '0-1-2',
            label: 'شاخه ۲',
          },
          {
            key: '0-1-3',
            label: 'شاخه ۳',
          },
          {
            key: '0-1-4',
            label: 'شاخه ۴',
          },
        ],
      },
    ],
  },
  {
    key: '1',
    label: 'گروه دوم',
    children: [
      {
        key: '1-0',
        label: 'شاخه اول',
      },
      {
        key: '0-0',
        label: 'شاخه دوم',
      },
    ],
  },
  {
    key: '2',
    label: 'گروه سوم',
    children: [],
  },
];

export const DnDTreeData = {
  rootId: '1',
  items: {
    1: {
      id: '1',
      parent: 'root',
      children: ['1-1', '1-2'],
      hasChildren: true,
      isExpanded: true,
      isChildrenLoading: false,
      isDeleted: false,
      data: {
        title: 'root',
      },
    },
    '1-1': {
      id: '1-1',
      parent: '1',
      children: ['1-1-1', '1-1-2'],
      hasChildren: true,
      isExpanded: false,
      isChildrenLoading: true,
      isEditable: true,
      isDeleted: false,
      data: {
        title: 'گروه اول',
      },
    },
    '1-2': {
      id: '1-2',
      parent: '1',
      children: ['1-2-1', '1-2-2'],
      hasChildren: true,
      isExpanded: true,
      isChildrenLoading: false,
      isDeleted: false,
      data: {
        title: 'گروه دوم',
      },
    },
    '1-1-1': {
      id: '1-1-1',
      parent: '1-1',
      children: [],
      hasChildren: false,
      isExpanded: false,
      isChildrenLoading: false,
      isEditable: true,
      isDeleted: false,
      data: {
        title: 'شاخه اول',
      },
    },
    '1-1-2': {
      id: '1-1-2',
      parent: '1-1',
      children: [],
      hasChildren: false,
      isExpanded: false,
      isChildrenLoading: false,
      isEditable: true,
      isDeleted: false,
      data: {
        title: 'شاخه دوم',
      },
    },
    '1-2-1': {
      id: '1-2-1',
      parent: '1-2',
      children: [],
      hasChildren: false,
      isExpanded: false,
      isChildrenLoading: false,
      isDeleted: false,
      data: {
        title: 'شاخه سوم',
      },
    },
    '1-2-2': {
      id: '1-2-2',
      parent: '1-2',
      children: [],
      hasChildren: false,
      isExpanded: false,
      isChildrenLoading: false,
      isDeleted: false,
      data: {
        title: 'شاخه چهارم',
      },
    },
  },
};
