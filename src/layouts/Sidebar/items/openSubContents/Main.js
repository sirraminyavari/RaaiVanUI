/**
 * Renders regular sidebar with its menu.
 */
import { useEffect, useCallback, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
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
import { useThemeSlice } from 'store/slice/theme';
import { useSidebarSlice } from 'store/slice/sidebar';
import { selectSidebar } from 'store/slice/sidebar/selectors';
import { selectOnboarding } from 'store/slice/onboarding/selectors';
import { selectApplication } from 'store/slice/applications/selectors';

const SidebarMainContent = () => {
  const dispatch = useDispatch();

  const {
    actions: { setSidebarContent },
  } = useThemeSlice();

  const { actions: sidebarActions } = useSidebarSlice();
  const { showSearchResults } = useSelector(selectSidebar);
  const { name: onboardingName } = useSelector(selectOnboarding);
  const { currentApp: selectedTeam } = useSelector(selectApplication);

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
      dispatch(sidebarActions.setSearchText(''));
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
