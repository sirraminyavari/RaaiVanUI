import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import * as Styled from 'views/Profile/Profile.styles';
import useWindow from 'hooks/useWindowContext';
import CheckIcon from 'components/Icons/CheckIcons/Check';
import { API_Provider } from 'helpers/helpers';
import { USERS_API, SET_THEME } from 'constant/apiConstants';

const selectThemeSettings = createSelector(
  (state) => state.theme,
  (theme) => theme.themeSettings
);

const selectCurrentThemes = createSelector(
  (state) => state.theme,
  (theme) => theme.currentTheme
);

const setThemeAPI = API_Provider(USERS_API, SET_THEME);

const ThemePreview = ({ preview }) => {
  const { RV_Float } = useWindow();
  const { hasSidebarPattern, isSidebarCollapsed, isDarkMode } = useSelector(
    selectThemeSettings
  );
  const currentTheme = useSelector(selectCurrentThemes);

  const { Codes, Name } = preview;
  const isActive = currentTheme === Name;

  const handleSelectTheme = () => {
    try {
      setThemeAPI.fetch(
        { Theme: Name },
        (response) => {
          if (response.Succeed) {
            window.location.reload();
          }
        },
        (error) => console.log(error)
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Styled.ThemePreviewContainer
      isDark={isDarkMode}
      onClick={handleSelectTheme}>
      <Styled.NavbarPreview previewColor={Codes.warm} />
      <Styled.SidebarPreview
        previewColor={Codes.verywarm}
        hasPattern={hasSidebarPattern}
        isClose={!isSidebarCollapsed}
        dir={RV_Float}
      />
      {isActive && (
        <Styled.PreviewSelectionWrapper isOpen={isSidebarCollapsed}>
          <div>
            <CheckIcon size={40} />
          </div>
          <div>پوسته فعلی</div>
        </Styled.PreviewSelectionWrapper>
      )}
    </Styled.ThemePreviewContainer>
  );
};

export default ThemePreview;
