import { getUUID } from 'helpers/helpers';
import TextInputIcon from 'components/Icons/TextInputIcon/TextInputIcon';
import TextAreaIcon from 'components/Icons/TextAreaIcon/TextAreaIcon';
import MailIcon from 'components/Icons/MailIcon/MailIcon';
import LinkIcon from 'components/Icons/LinkIcon/LinkIcon';
import NumericalIcon from 'components/Icons/NumericalIcon';
import FilledCalendarIcon from 'components/Icons/CalendarIcon/FilledCalendarIcon';
import {
  BsFileEarmarkArrowUp,
  FiToggleLeft,
  GiCannonShot,
  IoDocumentOutline,
  IoFilter,
  IoIosCheckboxOutline,
  IoIosStarOutline,
  IoReorderTwoOutline,
  RiAccountCircleFill,
} from 'react-icons/all';
import CellPhoneIcon from 'components/Icons/CellPhoneIcon/CellPhoneIcon';
import { IoMdRadioButtonOn } from 'react-icons/io';
import { BsTable } from 'react-icons/bs';

const sharedProps = {
  Name: '', //optional
  Title: '', //necessary
  Help: '', //optional
  Necessary: false, //default: false
  UniqueValue: false, //default: false
  Weight: null, //default: null
};
const formElementList = () => {
  const { RVDic } = window;
  const size = 22;

  return [
    {
      id: 1,
      title: 'فیلدهای متنی',
      type: 'Text',
      items: [
        {
          id: getUUID(),
          title: 'متن کوتاه',
          type: 'shortText',
          icon: <TextInputIcon size={size} />,
          data: {
            ...sharedProps,
            Type: 'Text',
            Info: { UseSimpleEditor: true, min: '', max: '', Sample: '' },
          },
        },
        {
          id: getUUID(),
          title: 'پاراگراف',
          type: 'paragraph',
          icon: <TextAreaIcon size={size} />,
          data: {
            ...sharedProps,
            Type: 'Text',
            Info: {
              min: '',
              max: '',
              Sample: '',
            },
          },
        },
        {
          id: getUUID(),
          title: 'ایمیل',
          type: 'email',
          icon: <MailIcon size={size} />,
          data: {
            ...sharedProps,
            Type: 'Text',
            Info: { UseSimpleEditor: true, PatternName: 'email', Sample: '' },
          },
        },
        {
          id: getUUID(),
          title: 'لینک',
          type: 'url',
          icon: <LinkIcon size={size} />,
          data: {
            ...sharedProps,
            Type: 'Text',
            Info: { UseSimpleEditor: true, PatternName: 'url', Sample: '' },
          },
        },
      ],
    },
    {
      id: 2,
      title: 'فیلدهای عددی',
      type: 'Numeric',
      items: [
        {
          id: getUUID(),
          title: 'عددی',
          icon: <NumericalIcon size={size} />,
          type: 'Numeric',
          data: {
            ...sharedProps,
            Type: 'Numeric',
            Info: {
              min: '',
              max: '',
              PatternName: 'NONE',
              currency: 'NONE',
              separator: true,
              percentage: true,
              Sample: '',
            },
          },
        },
        {
          id: getUUID(),
          title: 'شماره تماس',
          type: 'phone',
          icon: <CellPhoneIcon size={size} />,
          data: {
            ...sharedProps,
            Type: 'Text',
            Info: {
              PatternName: 'mobile',
              UseSimpleEditor: true,
              Sample: '',
            },
          },
        },
        {
          id: getUUID(),
          title: 'تاریخ',
          type: 'Date',
          icon: <FilledCalendarIcon size={size} />,
          data: {
            ...sharedProps,
            Type: 'Date',
            Info: {
              Calendar: '',
            },
          },
        },
      ],
    },
    {
      id: 3,
      title: 'فیلدهای انتخابی',
      items: [
        {
          id: getUUID(),
          title: 'تک انتخابی',
          icon: <IoMdRadioButtonOn size={size} />,
          type: 'Select',
          data: {
            ...sharedProps,
            Type: 'Select',
            Info: {
              Items: [{ text: '', color: '', min: '', max: '' }],
              ViewType: 'sliding',
              addOption: true,
            },
          },
        },
        {
          id: getUUID(),
          title: 'چند انتخابی',
          icon: <IoIosCheckboxOutline size={size} />,
          type: 'Checkbox',
          data: {
            ...sharedProps,
            Type: 'Checkbox',
            Info: {
              Items: [{ text: '', color: '' }],
              ViewType: 'sliding',
              addOption: true,
            },
          },
        },
        {
          id: getUUID(),
          title: 'دو گزینه ای',
          icon: <FiToggleLeft size={size} />,
          type: 'Binary',
          data: {
            ...sharedProps,
            Type: 'Binary',
            Info: {
              Yes: '',
              No: '',
            },
          },
        },
        {
          id: getUUID(),
          title: 'چندسطحی',
          type: 'multi',
          icon: <IoFilter size={size} />,
          data: {
            ...sharedProps,
          },
        },
        {
          id: getUUID(),
          title: 'امتیازدهی',
          type: 'Rating',
          icon: <IoIosStarOutline size={size} />,
          data: {
            ...sharedProps,
            Type: 'Numeric',
            Info: {
              PatternName: 'rating',
              min: '',
              max: '',
              ViewType: 'numeric',
            },
          },
        },
      ],
    },
    {
      id: 4,
      title: 'سایر فیلدها',
      items: [
        {
          id: getUUID(),
          title: 'آیتم',
          icon: <IoDocumentOutline size={size} />,
          type: 'Node',
          data: {
            ...sharedProps,
            Type: 'Node',
            Info: {
              MultiSelect: true,
              NodeTypes: [],
            },
          },
        },
        {
          id: getUUID(),
          title: 'کاربر',
          icon: <RiAccountCircleFill size={size} />,
          type: 'User',
          data: {
            ...sharedProps,
            Type: 'User',
            Info: {
              MultiSelect: false,
              GroupSelect: true,
              Groups: [],
            },
          },
        },
        {
          id: getUUID(),
          title: 'فایل و چند رسانه ای',
          type: 'File',
          icon: <BsFileEarmarkArrowUp size={size} />,
          data: {
            ...sharedProps,
            Type: 'File',
            Info: {
              MaxCount: '',
              MaxSize: '',
              TotalSize: '',
              ImageOnly: false,
              AllowedExtensions: [],
            },
          },
        },
        {
          id: getUUID(),
          title: 'جدول',
          type: 'table',
          icon: <BsTable size={size} />,
          data: {
            ...sharedProps,
          },
        },
        {
          id: getUUID(),
          title: 'جداکننده',
          icon: <IoReorderTwoOutline size={size} />,
          type: 'Separator',
          data: {
            ...sharedProps,
            Type: 'Separator',
            Info: {
              SeparatorType: 'text',
              SeparatorText: '',
            },
          },
        },
      ],
    },
  ];
};

export const flatFormElements = () => {
  const list = formElementList()
    ?.map(({ items }) => items)
    .flat();
  return list;
};

export default formElementList;
