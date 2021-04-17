/**
 * Renders regular sidebar with its menu.
 */
import { useEffect, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { sidebarMenuSlice } from 'store/reducers/sidebarMenuReducer';
import SidebarMenuTrees from './MenuTrees';
import UnderMenuList from './UnderMenuList';
import SearchBox from './SearchBox';
import SearchResultsList from './SearchResultsList';
import { createSelector } from 'reselect';

const selectShowSearchResults = createSelector(
  (state) => state.sidebarItems,
  (sidebarItems) => sidebarItems.showSearchResults
);

const SidebarMain = () => {
  const dispatch = useDispatch();
  const { setSearchText } = sidebarMenuSlice.actions;
  const showSearchResults = useSelector(selectShowSearchResults);

  useEffect(() => {
    //! clean up
    return () => {
      dispatch(setSearchText(''));
    };
  }, [dispatch]);

  return (
    <>
      <SearchBox />
      {showSearchResults ? (
        <SearchResultsList />
      ) : (
        <>
          <SidebarMenuTrees />
          <hr />
          <UnderMenuList />
        </>
      )}
    </>
  );
};

export default memo(SidebarMain);
