const treeData = [
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

export default treeData;
