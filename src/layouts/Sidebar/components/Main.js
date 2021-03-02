/**
 * Renders regular sidebar with its menu.
 */
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { sidebarMenuSlice } from 'store/reducers/sidebarMenuReducer';
import SidebarMenuTrees from './MenuTrees';
import UnderMenuList from './UnderMenuList';
import SearchBox from './SearchBox';
import SearchResultsList from './SearchResultsList';

const SidebarMain = () => {
  const dispatch = useDispatch();
  const { setSearchText } = sidebarMenuSlice.actions;
  const searchText = useSelector((state) => state.sidebarItems.searchText);

  //! If true, Shows search results, Otherwise Shows sidebar menu.
  const showSearch = () => searchText.length >= 3;

  useEffect(() => {
    //! clean up
    return () => {
      dispatch(setSearchText(''));
    };
  }, []);

  return (
    <>
      <SearchBox />
      {showSearch() ? (
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

export default SidebarMain;
