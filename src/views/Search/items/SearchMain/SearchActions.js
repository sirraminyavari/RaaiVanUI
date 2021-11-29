import { useContext, useRef, useEffect } from 'react';
import { createSelector } from 'reselect';
import { useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import * as Styled from 'views/Search/SearchView.styles';
import { searchContext } from 'views/Search/SearchView';
import Input from 'components/Inputs/Input';
import SearchIcon from 'components/Icons/SearchIcon/Search';
import { CV_DISTANT } from 'constant/CssVariables';
import useWindow from 'hooks/useWindowContext';
import SearchTypeButtons from './SearchTypeButtons';
import SearchAdvancedButtons from './SearchAdvancedButtons';
import SearchTypeCollapsed from './SearchTypeCollapsed';

const selectIsSidebarOpen = createSelector(
  (state) => state.theme,
  (theme) => theme.isSidebarOpen
);

const SearchActions = () => {
  const { RVDic } = useWindow();
  const { searchText, setSearchText, isAsideOpen } = useContext(searchContext);
  const searchInputRef = useRef();
  const isSidebarOpen = useSelector(selectIsSidebarOpen);

  const isWindow = useMediaQuery({
    query: '(max-width: 1200px)',
  });

  const isMobileOrTablet = useMediaQuery({
    query: '(max-width: 1020px)',
  });

  useEffect(() => {
    searchInputRef.current.focus();
  }, []);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const isCollapsed = () => {
    if (isAsideOpen && isSidebarOpen) return true;
    if (isAsideOpen && isWindow) return true;
    if (!isAsideOpen && isMobileOrTablet) return true;
    return false;
  };

  return (
    <Styled.SearchActionsContainer>
      <Styled.SearchViewHeaderTitle>
        {searchText ? `نتایج جستجو برای "${searchText}"` : 'نتایج جستجو'}
      </Styled.SearchViewHeaderTitle>
      <Styled.SearchActionsWrapper>
        <Styled.SearchArea>
          <Styled.InputWrapper>
            <Input
              ref={searchInputRef}
              type="search"
              placeholder={RVDic.Search}
              onChange={handleSearch}
              value={searchText}
            />
            <SearchIcon
              size={20}
              color={CV_DISTANT}
              className="search-input-icon"
            />
          </Styled.InputWrapper>
          {isCollapsed() ? (
            <SearchTypeCollapsed />
          ) : (
            <SearchTypeButtons onTypeChange={(type) => console.log(type)} />
          )}
        </Styled.SearchArea>
        <SearchAdvancedButtons />
      </Styled.SearchActionsWrapper>
    </Styled.SearchActionsContainer>
  );
};

export default SearchActions;
