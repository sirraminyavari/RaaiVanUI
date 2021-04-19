/**
 * Renders a customized search input for navbar.
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import * as Styled from '../Navbar.styles';
import SearchIcon from 'components/Icons/SearchIcon/Search';

const NavSearchInput = (props) => {
  const [searchText, setSearchText] = useState('');

  const handleInputChange = (e) => {
    setSearchText(e.target.value);
  };

  return (
    <Styled.SearchContainer>
      <Styled.SearchInput onChange={handleInputChange} type="search" {...props}>
        <Styled.SearchWrapper as={Link} to={`/dosearch/${searchText}`}>
          <SearchIcon size={22} color="#BAC9DC" />
        </Styled.SearchWrapper>
      </Styled.SearchInput>
    </Styled.SearchContainer>
  );
};

export default NavSearchInput;
