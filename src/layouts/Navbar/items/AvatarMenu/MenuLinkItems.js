import ProfileIcon from 'components/Icons/ProfileIcon/ProfileIcon';
// import AccountManIcon from 'components/Icons/AccountManIcon/AccountManIcon';
import QuestionIcon from 'components/Icons/QuestionIcon/QuestionIcon';
import { TCV_DEFAULT } from 'constant/CssVariables';
import { HELP_PATH, USER_PATH } from 'constant/constants';

const { RVDic } = window;

const MenuLinkItems = [
  {
    id: 1,
    title: RVDic.Profile,
    linkTo: USER_PATH,
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
    linkTo: HELP_PATH,
    icon: QuestionIcon,
    iconColor: TCV_DEFAULT,
  },
];

export default MenuLinkItems;
