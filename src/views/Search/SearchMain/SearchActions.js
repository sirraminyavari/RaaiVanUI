import { useContext, useRef, useEffect } from 'react';
import { createSelector } from 'reselect';
import { useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import * as Styled from 'views/Search/SearchView.styles';
import { searchContext } from 'views/Search/SearchView';
import Input from 'components/Inputs/Input';
import SearchIcon from 'components/Icons/SearchIcon/Search';
import { CV_DISTANT, TCV_REVERSE } from 'constant/CssVariables';
import useWindow from 'hooks/useWindowContext';
import SearchTypeButtons from './SearchTypeButtons';
import SearchAdvancedButtons from './SearchAdvancedButtons';
import SearchTypeCollapsed from './SearchTypeCollapsed';
import Heading from 'components/Heading/Heading';

const selectIsSidebarOpen = createSelector(
  (state) => state.theme,
  (theme) => theme.isSidebarOpen
);

const SearchActions = () => {
  const { RVDic } = useWindow();
  const { searchText, setSearchText, isAsideOpen, totalCount } =
    useContext(searchContext);
  const searchInputRef = useRef();
  const isSidebarOpen = useSelector(selectIsSidebarOpen);

  const { Search, SearchResults, SearchResultsForN } = RVDic || {};

  const isWindow = useMediaQuery({
    query: '(max-width: 1200px)',
  });

  const isMobileOrTablet = useMediaQuery({
    query: '(max-width: 1020px)',
  });

  //! Put input in focus when component is mounted.
  useEffect(() => {
    searchInputRef.current.focus();
  }, []);

  //! Set search text.
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  //! See if we should show collapsed mode of search types.
  const isCollapsed = () => {
    if (isAsideOpen && isSidebarOpen) return true;
    if (isAsideOpen && isWindow) return true;
    if (!isAsideOpen && isMobileOrTablet) return true;
    return false;
  };

  return (
    <Styled.SearchActionsContainer>
      <div
        style={{
          display: 'flex',
          flexFlow: 'row',
          alignItems: 'center',
          paddingInlineEnd: '0.5rem',
        }}
      >
        <Heading type="H1" style={{ flex: '1 1 auto', marginBottom: '1.5rem' }}>
          {searchText
            ? SearchResultsForN.replace('[n]', `"${searchText}"`)
            : SearchResults}
        </Heading>
        {!!totalCount &&
          false(
            <div
              style={{ flex: '0 0 auto', fontSize: '1rem', color: TCV_REVERSE }}
            >
              {RVDic.NItems.replace('[n]', totalCount)}
            </div>
          )}
      </div>
      <Styled.SearchActionsWrapper>
        <Styled.SearchArea>
          <Styled.InputWrapper>
            <Input
              ref={searchInputRef}
              placeholder={Search}
              onChange={handleSearch}
              value={searchText}
              style={{ padding: '0.5rem', fontSize: '1rem' }}
            >
              <SearchIcon size={22} color={CV_DISTANT} />
            </Input>
          </Styled.InputWrapper>
          {isCollapsed() ? <SearchTypeCollapsed /> : <SearchTypeButtons />}
        </Styled.SearchArea>
        <SearchAdvancedButtons />
      </Styled.SearchActionsWrapper>
    </Styled.SearchActionsContainer>
  );
};

export default SearchActions;
