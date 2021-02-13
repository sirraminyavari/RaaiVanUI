const NavButtons = [
  { id: 1, title: 'خانه', icon: 'home', linkTo: '/home' },
  {
    id: 2,
    title: 'پیمایش',
    icon: 'direction',
    actions: [
      { id: 1, title: 'مرورگر', icon: 'site', linkTo: '/teams' },
      { id: 2, title: 'نقشه گرافیکی', icon: 'target', linkTo: '/teams' },
    ],
  },
  {
    id: 3,
    title: 'پرسش',
    icon: 'question',
    actions: [
      { id: 1, title: 'پرسش جدید', icon: 'plus', linkTo: '/teams' },
      { id: 2, title: 'پرسش ها', icon: 'question', linkTo: '/teams' },
    ],
  },
  { id: 4, title: 'همکاران', icon: 'teams', linkTo: '/teams' },
  { id: 5, title: 'پیام ها', icon: 'messages', linkTo: '/messages' },
  { id: 6, title: 'کارتابل', icon: 'dashboard', linkTo: '/dashboard' },
  {
    id: 7,
    title: 'اعلان ها',
    icon: 'notifications',
    linkTo: '/notifications',
    badge: 99,
  },
];

export default NavButtons;
