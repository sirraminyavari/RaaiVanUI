import { encodeBase64 } from 'helpers/helpers';

const filters = [
  {
    ElementID: '1',
    Title: 'انتخاب چند گزینه ای',
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
    Title: 'موضوعات مشابه',
    Type: 'Node',
    Info: encodeBase64(
      JSON.stringify({
        MultiSelect: false,
        NodeTypes: [
          {
            NodeTypeID: '88ee70b3-38b7-4b9d-ba25-8cff1c4b512d',
            NodeType: 'گروه مخاطب جدید',
          },
        ],
      })
    ),
  },
  {
    ElementID: '8',
    Title: 'انتخاب دودویی',
    Type: 'Binary',
    Info: encodeBase64(
      JSON.stringify({ Yes: encodeBase64('Yes'), No: encodeBase64('No') })
    ),
  },
  {
    ElementID: '9',
    Title: 'انتخاب فایل',
    Type: 'File',
    Info: {},
  },
  {
    ElementID: '10',
    Title: 'فیلتر فرم',
    Type: 'Form',
    Info: {
      filters: [
        {
          ElementID: '3',
          Title: 'تاریخ وارد شده در فیلد',
          Type: 'Date',
          Info: null,
        },
        { ElementID: '4', Title: 'فیلتر نمونه متنی', Type: 'Text', Info: {} },
        {
          ElementID: '5',
          Title: 'انتخاب بازه اعداد',
          Type: 'Numeric',
          Info: {},
        },
      ],
    },
  },
];

export default filters;
