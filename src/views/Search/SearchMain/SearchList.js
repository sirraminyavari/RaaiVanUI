import { Fragment, useContext } from 'react';
import SearchNotFound from './SearchNotFound';
import SearchingAnimation from './SearchingAnimation';
import * as Styled from 'views/Search/SearchView.styles';
import { searchContext } from 'views/Search/SearchView';
import ScrollbarProvider from 'components/ScrollBarProvider/ScrollBarProvider';
import useWindow from 'hooks/useWindowContext';
import SearchItem from './Items/SearchItem/SearchItem';

const SearchList = () => {
  const { isSearching, searchText, searchItems } = useContext(searchContext);
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
        <ScrollbarProvider
          scrollEndOptions={{
            onEndReach: () => {
              console.log('end reached!!!', 'ramin');
            },
          }}>
          {searchItems?.map((item, index) => {
            return (
              <Fragment key={item?.ID || index}>
                <SearchItem {...item} />
              </Fragment>
            );
          })}
        </ScrollbarProvider>
      </Styled.SearchListContainer>
    );
  }
};

export default SearchList;
