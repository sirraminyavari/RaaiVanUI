import { Fragment, useContext } from 'react';
import SearchNotFound from './SearchNotFound';
import SearchingAnimation from './SearchingAnimation';
import * as Styled from 'views/Search/SearchView.styles';
import { searchContext } from 'views/Search/SearchView';
import ScrollbarProvider from 'components/ScrollBarProvider/ScrollBarProvider';
import useWindow from 'hooks/useWindowContext';
import SearchItem from './Items/SearchItem/SearchItem';
import LoadingIconFlat from 'components/Icons/LoadingIcons/LoadingIconFlat';
import { TCV_DEFAULT } from 'constant/CssVariables';

const SearchList = () => {
  const { isSearching, searchText, searchItems, onScrollEnd, isFetchingMore } =
    useContext(searchContext);
  const { RVDic } = useWindow();

  if (isSearching) {
    return (
      <Styled.SearchListContainer>
        <SearchingAnimation />
      </Styled.SearchListContainer>
    );
  }

  if (!searchText || !searchItems.length) {
    return (
      <Styled.SearchListContainer>
        <SearchNotFound label={!searchText ? RVDic._HelpSearch : ''} />
      </Styled.SearchListContainer>
    );
  } else {
    return (
      <Styled.SearchListContainer>
        <ScrollbarProvider scrollEndOptions={{ onEndReach: onScrollEnd }}>
          {searchItems?.map((item, index) => (
            <Fragment key={item?.ID || index}>
              <SearchItem {...item} />
            </Fragment>
          ))}
          {isFetchingMore && (
            <div
              style={{ width: '100%', padding: '1rem', textAlign: 'center' }}
            >
              <LoadingIconFlat style={{ color: TCV_DEFAULT }} />
            </div>
          )}
        </ScrollbarProvider>
      </Styled.SearchListContainer>
    );
  }
};

export default SearchList;
