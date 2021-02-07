import * as Styled from './Navbar.styles';
import SearchIcon from 'components/Icons/SearchIcon/Search';

const NavbarSearchInput = () => {
  return (
    <Styled.SearchContainer>
      <Styled.SearchIcon>
        <SearchIcon />
      </Styled.SearchIcon>
      <Styled.SearchInput
        type="search"
        placeholder={'جستجو در مطالب،کاربران،ابزارها و ...'}
      />
    </Styled.SearchContainer>
  );
};

export default NavbarSearchInput;
