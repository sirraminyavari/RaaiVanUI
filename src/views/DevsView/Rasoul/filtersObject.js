const filters = [
  { id: '1', Type: 'SuggestType' },
  {
    id: '2',
    Type: 'RadioType',
    options: [
      { value: 'انتخاب اول', label: 'انتخاب اول', group: 'options' },
      { value: 'انتخاب دوم', label: 'انتخاب دوم', group: 'options' },
      { value: 'انتخاب سوم', label: 'انتخاب سوم', group: 'options' },
    ],
  },
  { id: '3', Type: 'DateType' },
  { id: '4', Type: 'TextType' },
];

export default filters;
