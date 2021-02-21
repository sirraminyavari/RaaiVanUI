import { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { sidebarMenuSlice } from 'store/reducers/sidebarMenuReducer';
import useOnClickOtside from 'hooks/useOnClickOtside';
import SearchBox from './SearchBox';
import SearchResultsList from './SearchResultsList';
import SidebarMenuTrees from './MenuTrees';
import UnderMenuList from './UnderMenuList';

const SidebarMain = () => {
  const searchAt = 3;
  const containerRef = useRef(null);
  const dispatch = useDispatch();
  const { setSearchResults } = sidebarMenuSlice.actions;

  const searchResults = useSelector(
    (state) => state.sidebarItems.searchResults
  );

  useOnClickOtside(containerRef, () => dispatch(setSearchResults([])));

  return (
    <div ref={containerRef}>
      <SearchBox searchAt={searchAt} />
      <SearchResultsList results={searchResults} />
      {searchResults?.length < searchAt + 1 && (
        <>
          <SidebarMenuTrees />
          <hr />
          <UnderMenuList />
        </>
      )}
    </div>
  );
};

export default SidebarMain;
