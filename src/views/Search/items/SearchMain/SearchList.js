import { Fragment, useContext } from 'react';
import SearchNotFound from './SearchNotFound';
import SearchingAnimation from './SearchingAnimation';
import * as Styled from 'views/Search/SearchView.styles';
import { searchContext } from 'views/Search/SearchView';
import FileSearchItem from './SearchItems/FileItem';
import QuestionSearchItem from './SearchItems/QuestionItem';
import UserSearchItem from './SearchItems/UserItem';
import NodeSearchItem from './SearchItems/NodeItem';
import PerfectScrollbar from 'components/ScrollBarProvider/ScrollBarProvider';
import useWindow from 'hooks/useWindowContext';

const SearchList = () => {
  const { isSearching, searchText, searchItems } = useContext(searchContext);
  const { RVDic } = useWindow();

  //! Render correct item based on search list.
  const renderItem = (item) => {
    const { ItemType } = item || {};

    switch (ItemType) {
      case 'User':
        return <UserSearchItem item={item} />;

      case 'Node':
        return <NodeSearchItem item={item} />;

      case 'Question':
        return <QuestionSearchItem item={item} />;

      case 'File':
        return <FileSearchItem item={item} />;

      default:
        return null;
    }
  };

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
        <PerfectScrollbar>
          {searchItems?.map((item, index) => {
            return (
              <Fragment key={item?.ID || index}>{renderItem(item)}</Fragment>
            );
          })}
        </PerfectScrollbar>
      </Styled.SearchListContainer>
    );
  }
};

export default SearchList;
