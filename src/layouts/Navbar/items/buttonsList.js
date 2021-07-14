import {
  DASHBOARD_PATH,
  EXPLORER_PATH,
  GRAPH_PATH,
  HOME_PATH,
  MESSAGES_PATH,
  NEW_QUESTION_PATH,
  QUESTIONS_PATH,
  TEAMS_PATH,
} from 'constant/constants';
const { RVDic } = window;

const NavButtons = [
  { index: '1', title: RVDic.Home, icon: 'home', linkTo: HOME_PATH },
  {
    index: '2',
    title: RVDic.Navigation,
    icon: 'direction',
    actions: [
      {
        index: '2-1',
        title: RVDic.Explorer,
        icon: 'site',
        linkTo: EXPLORER_PATH,
      },
      {
        index: '2-2',
        title: RVDic.KnowledgeMap,
        icon: 'target',
        linkTo: GRAPH_PATH,
      },
    ],
  },
  {
    index: '3',
    title: RVDic.Question,
    icon: 'question',
    actions: [
      {
        index: '3-1',
        title: RVDic.NewQuestion,
        icon: 'plus',
        linkTo: NEW_QUESTION_PATH,
      },
      {
        index: '3-2',
        title: RVDic.Questions,
        icon: 'question',
        linkTo: QUESTIONS_PATH,
      },
    ],
  },
  {
    index: '4',
    title: RVDic.Teams,
    icon: 'teams',
    linkTo: TEAMS_PATH,
  },
  {
    index: '5',
    title: RVDic.Messages,
    icon: 'messages',
    linkTo: MESSAGES_PATH,
  },
  {
    index: '6',
    title: RVDic.Dashboard,
    icon: 'dashboard',
    linkTo: DASHBOARD_PATH,
  },
  {
    index: '7',
    title: RVDic.Notifications,
    icon: 'notifications',
    actions: [],
    badge: true,
  },
];

export default NavButtons;
