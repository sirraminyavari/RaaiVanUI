import { encodeBase64 } from 'helpers/helpers';

const filters = [
  {
    ElementID: 'Checkbox_id',
    Title: 'انتخاب چند گزینه ای',
    Type: 'Checkbox',
    Info: encodeBase64(
      JSON.stringify({
        AutoSuggestMode: false,
        Options: [
          { value: 'انتخاب اول', title: 'انتخاب اول', group: 'checkbox' },
          { value: 'انتخاب دوم', title: 'انتخاب دوم', group: 'checkbox' },
          { value: 'انتخاب سوم', title: 'انتخاب سوم', group: 'checkbox' },
        ],
      })
    ),
  },
  {
    ElementID: 'Select_id',
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
  {
    ElementID: 'Date_id',
    Title: 'تاریخ وارد شده در فیلد',
    Type: 'Date',
    Info: null,
  },
  { ElementID: 'Text_id', Title: 'فیلتر نمونه متنی', Type: 'Text', Info: {} },
  {
    ElementID: 'Numeric_id',
    Title: 'انتخاب بازه اعداد',
    Type: 'Numeric',
    Info: {},
  },
  {
    ElementID: 'User_id',
    Title: 'انتخاب کاربر',
    Type: 'User',
    Info: encodeBase64(JSON.stringify({ MultiSelect: true })),
  },
  {
    ElementID: 'Node_id',
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
    ElementID: 'Binary_id',
    Title: 'انتخاب دودویی',
    Type: 'Binary',
    Info: encodeBase64(
      JSON.stringify({ Yes: encodeBase64('Yes'), No: encodeBase64('No') })
    ),
  },
  {
    ElementID: 'File_id',
    Title: 'انتخاب فایل',
    Type: 'File',
    Info: {},
  },
  {
    ElementID: 'Form_id',
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
