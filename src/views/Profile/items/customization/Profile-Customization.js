import { useEffect, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { getThemes, getCurrentTheme } from 'store/actions/themes/ThemeActions';
import * as Styled from 'views/Profile/Profile.styles';
import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import ThemeToggle from 'components/Toggle/Toggle';
import { C_GRAY_DARK } from 'constant/Colors';
import useWindow from 'hooks/useWindowContext';
import ThemePreview from './ThemePreview';
import { themeSlice } from 'store/reducers/themeReducer';
import { USER_PATH } from 'constant/constants';

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

const breadcrumbItems = [
  { id: 1, title: 'حساب کاربری', linkTo: USER_PATH },
  { id: 2, title: 'شخصی سازی', linkTo: '#' },
];

const ProfileCustomization = () => {
  const dispatch = useDispatch();
  const { RV_Float } = useWindow();
  const allThemes = useSelector(selectAllThemes);
  const isSidebarCollapsed = useSelector(selectIsSidebarCollapsed);
  const isDarkMode = useSelector(selectIsDarkMode);
  const hasSidebarPattern = useSelector(selectHasSidebarPattern);

  const handleMenuCollapse = (toggleValue) => {
    dispatch(setSidebarCollapse(toggleValue));
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
      <Styled.ProfileViewContainer style={{ width: '72%', margin: '0' }}>
        <Breadcrumb items={breadcrumbItems} />
        <Styled.ProfileTitleWrapper>
          <Styled.ProfileTitle>شخصی سازی</Styled.ProfileTitle>
          <Styled.ChooseThemeTitle>انتخاب پوسته</Styled.ChooseThemeTitle>
          <Styled.PreviewGroups>
            {allThemes.map((preview, key) => (
              <ThemePreview key={key} preview={preview} />
            ))}
          </Styled.PreviewGroups>
        </Styled.ProfileTitleWrapper>
      </Styled.ProfileViewContainer>
      <Styled.ProfileViewContainer className="profile-theme-setting">
        <Styled.ThemeSettingTitle>تنظیمات پوسته</Styled.ThemeSettingTitle>
        <ThemeToggle
          onToggle={handleMenuCollapse}
          isChecked={isSidebarCollapsed}
          title="منو به صورت پیشفرض باز باشد"
          titleClass={`${C_GRAY_DARK} profile-theme-toggle`}
        />
        <ThemeToggle
          onToggle={handlePattern}
          isChecked={hasSidebarPattern}
          title="نمایش حباب های رنگی"
          titleClass={`${C_GRAY_DARK} profile-theme-toggle`}
        />
        <ThemeToggle
          onToggle={handleDarkMode}
          isChecked={isDarkMode}
          title="حالت تاریک"
          titleClass={`${C_GRAY_DARK} profile-theme-toggle`}
        />
      </Styled.ProfileViewContainer>
    </Styled.CustomizationView>
  );
};

export default memo(ProfileCustomization);
