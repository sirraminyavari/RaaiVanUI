import { SearchContainer, SearchInput, SearchIcon } from './Navbar.styles';
import Icons from 'components/Icons';

const NavbarSearchInput = () => {
  return (
    <SearchContainer>
      <SearchIcon>{Icons['search']}</SearchIcon>
      <SearchInput
        type="search"
        placeholder={'جستجو در مطالب،کاربران،ابزارها و ...'}
      />
    </SearchContainer>
  );
};

export default NavbarSearchInput;
