import { getUUID } from 'helpers/helpers';
import TextInputIcon from 'components/Icons/TextInputIcon/TextInputIcon';
import TextAreaIcon from 'components/Icons/TextAreaIcon/TextAreaIcon';
import MailIcon from 'components/Icons/MailIcon/MailIcon';
import LinkIcon from 'components/Icons/LinkIcon/LinkIcon';
import NumericalIcon from 'components/Icons/NumericalIcon';
import FilledCalendarIcon from 'components/Icons/CalendarIcon/FilledCalendarIcon';
import {
  BsFileEarmarkArrowUp,
  FcCellPhone,
  FiToggleLeft,
  IoDocumentOutline,
  IoFilter,
  IoIosCheckboxOutline,
  IoIosStarOutline,
  IoReorderTwoOutline,
  RiAccountCircleFill,
  RiCellphoneLine,
} from 'react-icons/all';
import CellPhoneIcon from 'components/Icons/CellPhoneIcon/CellPhoneIcon';
import { IoMdRadioButtonOn } from 'react-icons/io';
import { BsTable } from 'react-icons/bs';

const formElementList = () => {
  const { RVDic } = window;
  const size = 22;

  return [
    {
      id: 1,
      title: 'فیلدهای متنی',
      items: [
        {
          id: getUUID(),
          title: 'متن کوتاه',
          icon: <TextInputIcon size={size} />,
        },
        {
          id: getUUID(),
          title: 'پاراگراف',
          icon: <TextAreaIcon size={size} />,
        },
        {
          id: getUUID(),
          title: 'ایمیل',
          icon: <MailIcon size={size} />,
        },
        {
          id: getUUID(),
          title: 'لینک',
          icon: <LinkIcon size={size} />,
        },
      ],
    },
    {
      id: 2,
      title: 'فیلدهای عددی',
      items: [
        {
          id: getUUID(),
          title: 'عددی',
          icon: <NumericalIcon size={size} />,
        },
        {
          id: getUUID(),
          title: 'شماره تماس',
          icon: <CellPhoneIcon size={size} />,
        },
        {
          id: getUUID(),
          title: 'تاریخ',
          icon: <FilledCalendarIcon size={size} />,
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
        },
        {
          id: getUUID(),
          title: 'چند انتخابی',
          icon: <IoIosCheckboxOutline size={size} />,
        },
        {
          id: getUUID(),
          title: 'دو گزینه ای',
          icon: <FiToggleLeft size={size} />,
        },
        {
          id: getUUID(),
          title: 'چندسطحی',
          icon: <IoFilter size={size} />,
        },
        {
          id: getUUID(),
          title: 'امتیازدهی',
          icon: <IoIosStarOutline size={size} />,
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
        },
        {
          id: getUUID(),
          title: 'کاربر',
          icon: <RiAccountCircleFill size={size} />,
        },
        {
          id: getUUID(),
          title: 'فایل و چند رسانه ای',
          icon: <BsFileEarmarkArrowUp size={size} />,
        },
        {
          id: getUUID(),
          title: 'جدول',
          icon: <BsTable size={size} />,
        },
        {
          id: getUUID(),
          title: 'جداکننده',
          icon: <IoReorderTwoOutline size={size} />,
        },
      ],
    },
  ];
};
export default formElementList;
