import { getURL } from 'helpers/helpers';
const { RVDic } = window;

const NavButtons = [
  { index: 1, title: RVDic.Home, icon: 'home', linkTo: getURL('Home') },
  {
    index: 2,
    title: RVDic.Navigation,
    icon: 'direction',
    actions: [
      {
        index: 1,
        title: RVDic.Explorer,
        icon: 'site',
        linkTo: getURL('Explorer'),
      },
      {
        index: 2,
        title: RVDic.KnowledgeMap,
        icon: 'target',
        linkTo: getURL('Applications'),
      },
    ],
  },
  {
    index: 3,
    title: RVDic.Question,
    icon: 'question',
    actions: [
      {
        index: 1,
        title: RVDic.NewQuestion,
        icon: 'plus',
        linkTo: getURL('NewQuestion'),
      },
      {
        index: 2,
        title: RVDic.Questions,
        icon: 'question',
        linkTo: getURL('Questions'),
      },
    ],
  },
  {
    index: 4,
    title: RVDic.Teams,
    icon: 'teams',
    linkTo: getURL('Applications'),
  },
  {
    index: 5,
    title: RVDic.Messages,
    icon: 'messages',
    linkTo: getURL('Messages'),
  },
  {
    index: 6,
    title: RVDic.Dashboard,
    icon: 'dashboard',
    linkTo: getURL('Dashboard'),
  },
  {
    index: 7,
    title: RVDic.Notifications,
    icon: 'notifications',
    actions: [],
    badge: true,
  },
];

export default NavButtons;
