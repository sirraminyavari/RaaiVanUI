/**
 * Renders regular sidebar with its menu.
 */
import { useEffect, useCallback, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { createSelector } from 'reselect';
import { sidebarMenuSlice } from 'store/reducers/sidebarMenuReducer';
import { themeSlice } from 'store/reducers/themeReducer';
import ReadableTree from 'layouts/Sidebar/items/sidebarTree/readable/ReadableTree';
import UnderMenuList from 'layouts/Sidebar/items/underMenu/UnderMenuList';
import SearchBox from 'layouts/Sidebar/items/openSubContents/searchBox/SearchBox';
import SearchResultsList from 'layouts/Sidebar/items/openSubContents/searchBox/SearchResultsList';
import SettingIcon from 'components/Icons/SettingIcon/Setting';
import * as Styled from 'layouts/Sidebar/Sidebar.styles';
import {
  SETTING_CONTENT,
  MAIN_CONTENT,
  INTRO_ONBOARD,
  CLASSES_PATH,
} from 'constant/constants';
import { decodeBase64 } from 'helpers/helpers';

const { setSearchText } = sidebarMenuSlice.actions;
const { setSidebarContent } = themeSlice.actions;

const selectShowSearchResults = createSelector(
  (state) => state.sidebarItems,
  (sidebarItems) => sidebarItems.showSearchResults
);

const selectTeam = createSelector(
  (state) => state.applications,
  (theme) => theme.currentApp
);

const selectOnboardingName = createSelector(
  (state) => state.onboarding,
  (onboarding) => onboarding.name
);

const SidebarMainContent = () => {
  const dispatch = useDispatch();

  const showSearchResults = useSelector(selectShowSearchResults);
  const selectedTeam = useSelector(selectTeam);
  const onboardingName = useSelector(selectOnboardingName);

  //! Check if onboarding is activated on 'intro' mode.
  const isIntroOnboarding =
    !!onboardingName && onboardingName === INTRO_ONBOARD;

  //! Change sidebar content on click.
  const handleOnClick = useCallback(() => {
    if (isIntroOnboarding) return;
    dispatch(
      setSidebarContent({ current: SETTING_CONTENT, prev: MAIN_CONTENT })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    //! clean up
    return () => {
      dispatch(setSearchText(''));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Styled.SidebarTitle>
        <Styled.TitleText as={!isIntroOnboarding && Link} to={CLASSES_PATH}>
          {decodeBase64(selectedTeam?.Title)}
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
