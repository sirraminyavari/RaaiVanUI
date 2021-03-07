import { getURL } from 'helpers/helpers';
const { RVDic } = window;

const NavButtons = [
  { id: 1, title: RVDic.Home, icon: 'home', linkTo: getURL('Home') },
  {
    id: 2,
    title: RVDic.Browser,
    icon: 'direction',
    //TODO: Change link to url
    actions: [
      { id: 1, title: RVDic.Browser, icon: 'site', linkTo: '/teams' },
      { id: 2, title: RVDic.KnowledgeMap, icon: 'target', linkTo: '/teams' },
    ],
  },
  {
    id: 3,
    title: RVDic.Question,
    icon: 'question',
    actions: [
      {
        id: 1,
        title: RVDic.NewQuestion,
        icon: 'plus',
        linkTo: getURL('NewQuestion'),
      },
      {
        id: 2,
        title: RVDic.Questions,
        icon: 'question',
        linkTo: getURL('Questions'),
      },
    ],
  },
  {
    id: 4,
    title: RVDic.Teams,
    icon: 'teams',
    linkTo: getURL('Applications'),
  },
  {
    id: 5,
    title: RVDic.Messages,
    icon: 'messages',
    linkTo: getURL('Messages'),
  },
  {
    id: 6,
    title: RVDic.Dashboard,
    icon: 'dashboard',
    linkTo: getURL('Dashboard'),
  },
  {
    id: 7,
    title: RVDic.Notifications,
    icon: 'notifications',
    // TODO: change link to notifications
    linkTo: '/notifications',
    badge: 99,
  },
];

export default NavButtons;
