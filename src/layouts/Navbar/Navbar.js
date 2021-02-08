import Avatar from 'components/Avatar';
import NavbarButton from './components/NavbarButton';
import NavbarSearchInput from './components/NavbarSearchInput';
import * as Styled from './Navbar.styles';

const navButtons = [
  { title: 'خانه', icon: 'home', linkTo: '/home' },
  {
    title: 'پیمایش',
    icon: 'direction',
    options: [
      { optName: 'مرورگر', optIcon: 'site' },
      { optName: 'نقشه گرافیکی', optIcon: 'target' },
    ],
  },
  {
    title: 'پرسش',
    icon: 'question',
    options: [
      { optName: 'پرسش جدید', optIcon: 'plus' },
      { optName: 'پرسش ها', optIcon: 'question' },
    ],
  },
  { title: 'همکاران', icon: 'teams', linkTo: '/teams' },
  { title: 'پیام ها', icon: 'messages', linkTo: '/messages' },
  { title: 'کارتابل', icon: 'dashboard', linkTo: '/dashboard' },
  {
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
        {navButtons.map((btn, key) => {
          return <NavbarButton btnProps={btn} key={key} />;
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
