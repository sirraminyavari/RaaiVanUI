import * as Styled from '../Navbar.styles';
import SearchIcon from 'components/Icons/SearchIcon/Search';

const NavSearchInput = (props) => {
  return (
    <Styled.SearchContainer>
      <Styled.SearchIcon>
        <SearchIcon />
      </Styled.SearchIcon>
      <Styled.SearchInput type="search" {...props} />
    </Styled.SearchContainer>
  );
};

export default NavSearchInput;
