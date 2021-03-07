import { getURL } from 'helpers/helpers';
import ProfileIcon from 'components/Icons/ProfileIcon/ProfileIcon';
import AccountsIcon from 'components/Icons/AccountsIcon/AccountsIcon';
import QuestionIcon from 'components/Icons/QuestionIcon/QuestionIcon';
import ServerIcon from 'components/Icons/ServerIcon/ServerIcon';

const { RVDic } = window;

const MenuLinkItems = [
  {
    id: 1,
    title: RVDic.Profile,
    linkTo: getURL('User'),
    icon: ProfileIcon,
    iconColor: '#2B7BE4',
  },
  {
    id: 2,
    title: 'مدیریت حساب ها',
    linkTo: '#',
    icon: AccountsIcon,
    iconColor: '#2B7BE4',
  },
  {
    id: 3,
    title: RVDic.Help,
    linkTo: '#',
    icon: QuestionIcon,
    iconColor: '#2B7BE4',
  },
  {
    id: 4,
    title: 'ورک اسپیس شماره ۱',
    linkTo: '#',
    icon: ServerIcon,
    iconColor: '#002479',
  },
  {
    id: 5,
    title: 'ورک اسپیس کلیک مایند',
    linkTo: '#',
    icon: ServerIcon,
    iconColor: '#707070',
    textColor: '#707070',
  },
];

export default MenuLinkItems;
