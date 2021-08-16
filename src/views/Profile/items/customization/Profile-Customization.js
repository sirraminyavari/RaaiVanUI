import { useEffect, memo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { getThemes, getCurrentTheme } from 'store/actions/themes/ThemeActions';
import * as Styled from 'views/Profile/Profile.styles';
import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import ThemeToggle from 'components/Toggle/Toggle';
import { C_DISTANT, C_GRAY_DARK } from 'constant/Colors';
import useWindow from 'hooks/useWindowContext';
import ThemePreview from './ThemePreview';
import { themeSlice } from 'store/reducers/themeReducer';
import {
  SIDEBAR_WINDOW,
  USER_CUSTOMIZATION_PATH,
  USER_PATH,
} from 'constant/constants';
import { saveUserSettings } from 'apiHelper/apiFunctions';

const {
  setSidebarCollapse,
  setDarkMode,
  setSidebarPattern,
} = themeSlice.actions;

const selectAllThemes = createSelector(
  (state) => state.theme,
  (theme) => theme.themes
);

const selectIsSidebarCollapsed = createSelector(
  (state) => state.theme,
  (theme) => theme.isSidebarCollapsed
);

const selectIsDarkMode = createSelector(
  (state) => state.theme,
  (theme) => theme.isDarkMode
);

const selectHasSidebarPattern = createSelector(
  (state) => state.theme,
  (theme) => theme.hasSidebarPattern
);

const ProfileCustomization = () => {
  const dispatch = useDispatch();
  const { RV_Float, RVGlobal, RVDic } = useWindow();
  const allThemes = useSelector(selectAllThemes);
  const isSidebarCollapsed = useSelector(selectIsSidebarCollapsed);
  const isDarkMode = useSelector(selectIsDarkMode);
  const hasSidebarPattern = useSelector(selectHasSidebarPattern);
  const [isSavingMenuSetting, setIsSavingMenuSetting] = useState(false);

  const PAGE_TITLE = RVDic.Personalization;

  const breadcrumbItems = [
    { id: 1, title: RVDic.Profile, linkTo: USER_PATH },
    { id: 2, title: PAGE_TITLE, linkTo: USER_CUSTOMIZATION_PATH },
  ];

  const isSaas = (RVGlobal || {}).SAASBasedMultiTenancy;

  const handleMenuCollapse = (toggleValue) => {
    dispatch(setSidebarCollapse(toggleValue));
    // console.log(toggleValue);
    setIsSavingMenuSetting(true);
    saveUserSettings(SIDEBAR_WINDOW, toggleValue)
      .then((response) => {
        console.log(response);
        setIsSavingMenuSetting(false);
        if (response.ErrorText) {
          alert(RVDic.MSG[response.ErrorText] || response.ErrorText);
        }
      })
      .catch((error) => {
        setIsSavingMenuSetting(false);
        console.log(error);
      });
  };

  const handlePattern = (toggleValue) => {
    dispatch(setSidebarPattern(toggleValue));
  };

  const handleDarkMode = (toggleValue) => {
    dispatch(setDarkMode(toggleValue));
  };

  useEffect(() => {
    dispatch(getThemes());
    dispatch(getCurrentTheme());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Styled.CustomizationView dir={RV_Float}>
      <Styled.ProfileViewContainer
        style={{
          width: 'calc(100% - 19rem)',
          margin: '0',
        }}>
        <Breadcrumb items={breadcrumbItems} />
        <Styled.ProfileTitleWrapper>
          <Styled.ProfileTitle>{PAGE_TITLE}</Styled.ProfileTitle>
          <Styled.ChooseThemeTitle>{RVDic.ThemeSelect}</Styled.ChooseThemeTitle>
          <Styled.PreviewGroups>
            {allThemes.map((preview, key) => (
              <ThemePreview key={key} preview={preview} />
            ))}
          </Styled.PreviewGroups>
        </Styled.ProfileTitleWrapper>
      </Styled.ProfileViewContainer>
      <Styled.ProfileViewContainer className="profile-theme-setting">
        <Styled.ThemeSettingTitle>
          {RVDic.ThemeSettings}
        </Styled.ThemeSettingTitle>
        <ThemeToggle
          disable={isSavingMenuSetting}
          onToggle={handleMenuCollapse}
          isChecked={isSidebarCollapsed}
          title="منو به صورت پیشفرض باز باشد"
          titleClass={`${C_GRAY_DARK} profile-theme-toggle`}
        />
        {!isSaas && (
          <ThemeToggle
            onToggle={handlePattern}
            isChecked={hasSidebarPattern}
            title={RVDic.RV.Settings.ColorfulBubbles}
            titleClass={`${C_GRAY_DARK} profile-theme-toggle`}
          />
        )}
        <ThemeToggle
          disable={true}
          onToggle={handleDarkMode}
          isChecked={isDarkMode}
          title="حالت تاریک (غیر فعال)"
          //TODO: Change color when dark mode is available.
          titleClass={`${C_DISTANT} profile-theme-toggle`}
        />
      </Styled.ProfileViewContainer>
    </Styled.CustomizationView>
  );
};

export default memo(ProfileCustomization);
