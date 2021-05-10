/**
 * Renders regular sidebar with its menu.
 */
import { useEffect, memo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { sidebarMenuSlice } from 'store/reducers/sidebarMenuReducer';
import { themeSlice } from 'store/reducers/themeReducer';
import ReadableTree from '../sidebarTree/readable/R-Tree';
import UnderMenuList from '../UnderMenuList';
import SearchBox from '../SearchBox';
import SearchResultsList from '../SearchResultsList';
import { createSelector } from 'reselect';
import SettingIcon from 'components/Icons/SettingIcon/Setting';
import { getURL } from 'helpers/helpers';
import * as Styled from '../../Sidebar.styles';

const selectShowSearchResults = createSelector(
  (state) => state.sidebarItems,
  (sidebarItems) => sidebarItems.showSearchResults
);

const selectTeam = createSelector(
  (state) => state.theme,
  (theme) => theme.selectedTeam
);

const SidebarMainContent = () => {
  const dispatch = useDispatch();

  const { setSearchText } = sidebarMenuSlice.actions;
  const { setSidebarContent } = themeSlice.actions;

  const showSearchResults = useSelector(selectShowSearchResults);
  const selectedTeam = useSelector(selectTeam);

  //! Change sidebar content on click.
  const handleOnClick = useCallback(() => {
    dispatch(setSidebarContent('setting'));
  }, [dispatch]);

  useEffect(() => {
    //! clean up
    return () => {
      dispatch(setSearchText(''));
    };
  }, [dispatch]);

  return (
    <>
      <Styled.SidebarTitle>
        <Styled.TitleText as={Link} to={getURL('Classes')}>
          {selectedTeam.name}
        </Styled.TitleText>
        <Styled.SettingWrapper onClick={handleOnClick}>
          <SettingIcon />
        </Styled.SettingWrapper>
      </Styled.SidebarTitle>
      <SearchBox />
      {showSearchResults ? (
        <SearchResultsList />
      ) : (
        <>
          <ReadableTree />
          <Styled.Divider />
          <UnderMenuList />
        </>
      )}
    </>
  );
};

export default memo(SidebarMainContent);
