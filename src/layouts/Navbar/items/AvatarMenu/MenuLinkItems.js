import { getURL } from 'helpers/helpers';
import ProfileIcon from 'components/Icons/ProfileIcon/ProfileIcon';
import AccountManIcon from 'components/Icons/AccountManIcon/AccountManIcon';
import QuestionIcon from 'components/Icons/QuestionIcon/QuestionIcon';
import ApprovalIcon from 'components/Icons/ApprovalIcon/ApprovalIcon';
import { TC_DEFAULT, TC_VERYWARM, C_GRAY } from 'constant/Colors';

const { RVDic } = window;

const MenuLinkItems = [
  {
    id: 1,
    title: RVDic.Profile,
    linkTo: getURL('User'),
    icon: ProfileIcon,
    iconClass: TC_DEFAULT,
  },
  {
    id: 2,
    title: RVDic.AccountManagement,
    linkTo: '#',
    icon: AccountManIcon,
    iconClass: TC_DEFAULT,
  },
  {
    id: 3,
    title: RVDic.Help,
    linkTo: '#',
    icon: QuestionIcon,
    iconClass: TC_DEFAULT,
  },
  {
    id: 4,
    title: 'نام تیم فعلی',
    linkTo: '#',
    icon: ApprovalIcon,
    textClass: TC_VERYWARM,
  },
  {
    id: 5,
    title: 'نام تیم دیگر',
    linkTo: '#',
    icon: ApprovalIcon,
    iconClass: C_GRAY,
    textClass: C_GRAY,
  },
];

export default MenuLinkItems;
