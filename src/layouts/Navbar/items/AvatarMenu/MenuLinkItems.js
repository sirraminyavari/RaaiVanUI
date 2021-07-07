import { getURL } from 'helpers/helpers';
import ProfileIcon from 'components/Icons/ProfileIcon/ProfileIcon';
// import AccountManIcon from 'components/Icons/AccountManIcon/AccountManIcon';
import QuestionIcon from 'components/Icons/QuestionIcon/QuestionIcon';
import { TCV_DEFAULT } from 'constant/CssVariables';

const { RVDic } = window;

const MenuLinkItems = [
  {
    id: 1,
    title: RVDic.Profile,
    linkTo: getURL('User'),
    icon: ProfileIcon,
    iconColor: TCV_DEFAULT,
  },
  // {
  //   id: 2,
  //   title: RVDic.AccountManagement,
  //   linkTo: '#',
  //   icon: AccountManIcon,
  //   iconColor: TCV_DEFAULT,
  // },
  {
    id: 3,
    title: RVDic.Help,
    linkTo: getURL('Help'),
    icon: QuestionIcon,
    iconColor: TCV_DEFAULT,
  },
];

export default MenuLinkItems;
