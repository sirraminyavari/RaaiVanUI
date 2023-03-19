import { HomeSvg, SocialSvg } from '@cliqmind/rv-components';
import {
  CLASSES_PATH,
  DASHBOARD_PATH,
  EXPLORER_PATH,
  GRAPH_PATH,
  HOME_PATH,
  MESSAGES_PATH,
  NEW_QUESTION_PATH,
  QUESTIONS_PATH,
  TEAMS_PATH,
} from 'constant/constants';
const { RVDic, RVGlobal } = window;

const MainSidebarPrimaryLinks = [
  // ...(RVGlobal.IsDev
  //   ? [
  //       {
  //         title: RVDic.Dashboard,
  //         icon: 'dashboard',
  //         linkTo: DASHBOARD_PATH,
  //       },
  //     ]
  //   : []),
  // {
  //   index: '7',
  //   title: RVDic.Notifications,
  //   icon: 'notifications',
  //   actions: [],
  //   badge: true,
  // },
];

export default MainSidebarPrimaryLinks;
