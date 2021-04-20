import { getURL } from 'helpers/helpers';
import ProfileIcon from 'components/Icons/ProfileIcon/ProfileIcon';
import AccountManIcon from 'components/Icons/AccountManIcon/AccountManIcon';
import QuestionIcon from 'components/Icons/QuestionIcon/QuestionIcon';
import ApprovalIcon from 'components/Icons/ApprovalIcon/ApprovalIcon';

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
    title: RVDic.AccountManagement,
    linkTo: '#',
    icon: AccountManIcon,
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
    title: 'نام تیم فعلی',
    linkTo: '#',
    icon: ApprovalIcon,
    textColor: '#15113C',
  },
  {
    id: 5,
    title: 'نام تیم دیگر',
    linkTo: '#',
    icon: ApprovalIcon,
    iconColor: '#707070',
    textColor: '#707070',
  },
];

export default MenuLinkItems;
