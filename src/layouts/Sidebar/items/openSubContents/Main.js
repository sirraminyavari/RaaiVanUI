/**
 * Renders regular sidebar with its menu.
 */
import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { sidebarMenuSlice } from 'store/reducers/sidebarMenuReducer';
import { themeSlice } from 'store/reducers/themeReducer';
import ReadableTree from '../sidebarTree/readable/ReadableTree';
import UnderMenuList from '../underMenu/UnderMenuList';
import SearchBox from '../openSubContents/searchBox/SearchBox';
import SearchResultsList from '../openSubContents/searchBox/SearchResultsList';
import { createSelector } from 'reselect';
import SettingIcon from 'components/Icons/SettingIcon/Setting';
import * as Styled from 'layouts/Sidebar/Sidebar.styles';
import {
  SETTING_CONTENT,
  MAIN_CONTENT,
  INTRO_ONBOARD,
  CLASSES_PATH,
} from 'constant/constants';

const selectShowSearchResults = createSelector(
  (state) => state.sidebarItems,
  (sidebarItems) => sidebarItems.showSearchResults
);

const selectTeam = createSelector(
  (state) => state.theme,
  (theme) => theme.selectedTeam
);

const selecteOnboardingName = createSelector(
  (state) => state.onboarding,
  (onboarding) => onboarding.name
);

const SidebarMainContent = () => {
  const dispatch = useDispatch();

  const { setSearchText } = sidebarMenuSlice.actions;
  const { setSidebarContent } = themeSlice.actions;

  const showSearchResults = useSelector(selectShowSearchResults);
  const selectedTeam = useSelector(selectTeam);
  const onboardingName = useSelector(selecteOnboardingName);

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
  }, [dispatch]);

  useEffect(() => {
    //! clean up
    return () => {
      dispatch(setSearchText(''));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return (
    <>
      <Styled.SidebarTitle>
        <Styled.TitleText as={!isIntroOnboarding && Link} to={CLASSES_PATH}>
          {selectedTeam?.name}
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

export default SidebarMainContent;
