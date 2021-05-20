import { encodeBase64 } from 'helpers/helpers';

const filters = [
  {
    ElementID: '1',
    Title: 'موضوعات مشابه',
    Type: 'Checkbox',
    Info: encodeBase64(
      JSON.stringify({
        AutoSuggestMode: true,
        Options: [
          { value: 'انتخاب اول', title: 'انتخاب اول', group: 'checkbox' },
          { value: 'انتخاب دوم', title: 'انتخاب دوم', group: 'checkbox' },
          { value: 'انتخاب سوم', title: 'انتخاب سوم', group: 'checkbox' },
        ],
      })
    ),
  },
  {
    ElementID: '2',
    Title: 'یکی از موارد لیست زیر را انتخاب کنید',
    Type: 'Select',
    Info: encodeBase64(
      JSON.stringify({
        AutoSuggestMode: false,
        Options: [
          { value: 'انتخاب چهارم', title: 'انتخاب چهارم', group: 'select' },
          { value: 'انتخاب پنجم', title: 'انتخاب پنجم', group: 'select' },
          { value: 'انتخاب ششم', title: 'انتخاب ششم', group: 'select' },
        ],
      })
    ),
  },
  { ElementID: '3', Title: 'تاریخ وارد شده در فیلد', Type: 'Date', Info: null },
  { ElementID: '4', Title: 'فیلتر نمونه متنی', Type: 'Text', Info: {} },
  { ElementID: '5', Title: 'انتخاب بازه اعداد', Type: 'Numeric', Info: {} },
  {
    ElementID: '6',
    Title: 'انتخاب کاربر',
    Type: 'User',
    Info: encodeBase64(JSON.stringify({ MultiSelect: true })),
  },
  {
    ElementID: '7',
    Title: 'انتخاب کلاس',
    Type: 'Node',
    Info: encodeBase64(
      JSON.stringify({
        MultiSelect: false,
        NodeTypes: [
          { NodeTypeID: '1', NodeType: 'first node' },
          { NodeTypeID: '2', NodeType: 'second node' },
        ],
      })
    ),
  },
];

export default filters;
