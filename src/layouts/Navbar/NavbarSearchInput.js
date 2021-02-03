import * as Styled from './Navbar.styles';
import Icons from 'components/Icons';

const NavbarSearchInput = () => {
  return (
    <Styled.SearchContainer>
      <Styled.SearchIcon>{Icons.search}</Styled.SearchIcon>
      <Styled.SearchInput
        type="search"
        placeholder={'جستجو در مطالب،کاربران،ابزارها و ...'}
      />
    </Styled.SearchContainer>
  );
};

export default NavbarSearchInput;
