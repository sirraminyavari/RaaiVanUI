import { getURL } from 'helpers/helpers';
import ProfileIcon from 'components/Icons/ProfileIcon/ProfileIcon';
import AccountManIcon from 'components/Icons/AccountManIcon/AccountManIcon';
import QuestionIcon from 'components/Icons/QuestionIcon/QuestionIcon';
import { TC_DEFAULT } from 'constant/Colors';

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
];

export default MenuLinkItems;
