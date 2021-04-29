/**
 * Renders a customized search input for navbar.
 */
import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { encodeBase64 } from 'helpers/helpers';
import * as Styled from '../Navbar.styles';
import SearchIcon from 'components/Icons/SearchIcon/Search';
import { TC_DISTANT } from 'constant/Colors';

const SearchInput = (props) => {
  const history = useHistory();
  const [searchText, setSearchText] = useState('');

  //! The path that input is link to.
  let searchPath = `/dosearch/${encodeBase64(
    searchText !== '' ? searchText : 'جستجو'
  )}`;

  //! Set search text.
  const handleInputChange = (e) => {
    setSearchText(e.target.value);
  };

  //! Clear input field after redirection.
  const handleClearSearch = () => {
    setSearchText('');
  };

  //! Redirect to search path on input enter.
  const handleInputEnter = (e) => {
    if (e.key === 'Enter') {
      history.push(searchPath);
      handleClearSearch();
    }
  };

  return (
    <Styled.SearchContainer>
      <Styled.SearchInput
        value={searchText}
        onChange={handleInputChange}
        onKeyPress={handleInputEnter}
        type="search"
        {...props}>
        <Styled.SearchWrapper as={Link} to={searchPath}>
          <SearchIcon
            size={22}
            className={TC_DISTANT}
            onClick={handleClearSearch}
          />
        </Styled.SearchWrapper>
      </Styled.SearchInput>
    </Styled.SearchContainer>
  );
};

export default SearchInput;
