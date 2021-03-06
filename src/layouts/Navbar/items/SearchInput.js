/**
 * Renders a customized search input for navbar.
 */
import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import * as Styled from 'layouts/Navbar/Navbar.styles';
import SearchIcon from 'components/Icons/SearchIcon/Search';
import { C_DISTANT } from 'constant/Colors';
import useWindow from 'hooks/useWindowContext';
import { encodeBase64, getURL } from 'helpers/helpers';

const SearchInput = (props) => {
  const history = useHistory();
  const { RVDic } = useWindow();
  const [searchText, setSearchText] = useState('');

  //! The path that input is link to.
  const searchPath = getURL('Search', {
    SearchText: encodeBase64(!!searchText ? searchText : RVDic.Search),
  });

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
    <Styled.SearchContainer data-tut="main-search-box">
      <Styled.SearchInput
        value={searchText}
        onChange={handleInputChange}
        onKeyPress={handleInputEnter}
        type="search"
        {...props}>
        <Styled.SearchWrapper as={Link} to={searchPath}>
          <SearchIcon
            size={22}
            className={C_DISTANT}
            onClick={handleClearSearch}
          />
        </Styled.SearchWrapper>
      </Styled.SearchInput>
    </Styled.SearchContainer>
  );
};

export default SearchInput;
