import Avatar from 'components/Avatar';
import NavbarButton from './components/NavbarButton';
import NavbarSearchInput from './components/NavbarSearchInput';
import * as Styled from './Navbar.styles';

const navButtons = [
  { id: 1, title: 'خانه', icon: 'home', linkTo: '/home' },
  {
    id: 2,
    title: 'پیمایش',
    icon: 'direction',
    options: [
      { id: 1, optName: 'مرورگر', optIcon: 'site' },
      { id: 2, optName: 'نقشه گرافیکی', optIcon: 'target' },
    ],
  },
  {
    id: 3,
    title: 'پرسش',
    icon: 'question',
    options: [
      { id: 1, optName: 'پرسش جدید', optIcon: 'plus' },
      { id: 2, optName: 'پرسش ها', optIcon: 'question' },
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

const Navbar = ({ isSidebarOpen }) => {
  return (
    <Styled.NavbarContainer isSidebarOpen={isSidebarOpen}>
      <Styled.ButtonsWrapper>
        {navButtons.map((btn) => {
          return <NavbarButton btnProps={btn} key={btn.id} />;
        })}
      </Styled.ButtonsWrapper>
      <Styled.SearchWrapper>
        <NavbarSearchInput />
        <Avatar radius={32} />
      </Styled.SearchWrapper>
    </Styled.NavbarContainer>
  );
};

export default Navbar;
