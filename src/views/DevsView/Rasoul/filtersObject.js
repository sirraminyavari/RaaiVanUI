import { encodeBase64 } from 'helpers/helpers';

const filters = [
  {
    ElementID: '1',
    Title: 'موضوعات مشابه',
    Type: 'Checkbox',
    info:
      '{ AutoSuggestMode: "boolean", Options: ["array of base64 encoded string values"] }',
  },
  {
    ElementID: '2',
    Title: 'یکی از موارد لیست زیر را انتخاب کنید',
    Type: 'Select',
    Info: encodeBase64(
      JSON.stringify({
        AutoSuggestMode: true,
        Options: [
          { value: 'انتخاب اول', title: 'انتخاب اول', group: 'options' },
          { value: 'انتخاب دوم', title: 'انتخاب دوم', group: 'options' },
          { value: 'انتخاب سوم', title: 'انتخاب سوم', group: 'options' },
        ],
      })
    ),
  },
  { ElementID: '3', Title: 'تاریخ وارد شده در فیلد', Type: 'Date', Info: null },
  { ElementID: '4', Title: 'فیلتر نمونه متنی', Type: 'Text', Info: {} },
  { ElementID: '5', Title: 'انتخاب بازه اعداد', Type: 'Numeric', Info: {} },
];

export default filters;
