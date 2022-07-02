import { useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as Styled from 'views/Profile/Profile.styles';
import useWindow from 'hooks/useWindowContext';
import CheckIcon from 'components/Icons/CheckIcons/Check';
import { API_Provider } from 'helpers/helpers';
import { USERS_API, SET_THEME } from 'constant/apiConstants';
import { CustomSettingContext } from './Profile-Customization';
import { useThemeSlice } from 'store/slice/theme';
import { selectTheme } from 'store/slice/theme/selectors';

const setThemeAPI = API_Provider(USERS_API, SET_THEME);

const ThemePreview = ({ preview }) => {
  const dispatch = useDispatch();
  const { RV_Float, RVAPI, RVGlobal, DynamicFileUtilities, RVDic } =
    useWindow();

  const {
    actions: { setCurrentTheme },
  } = useThemeSlice();
  const themeState = useSelector(selectTheme);

  const hasPattern = themeState.hasSidebarPattern;

  const isDarkMode = themeState.isDarkMode;
  const currentTheme = themeState.currentTheme;
  const { isSidebarCollapsed } = useContext(CustomSettingContext);

  const { Codes, Name } = preview;
  const isActive = currentTheme === Name;

  const handleSelectTheme = () => {
    try {
      setThemeAPI.fetch(
        { Theme: Name },
        (response) => {
          if (response.Succeed) {
            const currentThemeURL = RVAPI.ThemeURL({
              Name: RVGlobal.Theme || 'Default',
            });
            const newThemeURL = RVAPI.ThemeURL({ Name });
            DynamicFileUtilities.replace_css(currentThemeURL, newThemeURL);
            RVGlobal.Theme = Name;
            dispatch(setCurrentTheme(Name));
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
      isActive={isActive}
      isDark={isDarkMode}
      onClick={handleSelectTheme}
    >
      <Styled.NavbarPreview previewColor={Codes?.warm} />
      <Styled.SidebarPreview
        previewColor={Codes?.verywarm}
        hasPattern={hasPattern}
        isClose={!isSidebarCollapsed}
        dir={RV_Float}
      />
      {isActive && (
        <Styled.PreviewSelectionWrapper isOpen={isSidebarCollapsed}>
          <div>
            <CheckIcon size={40} />
          </div>
          <div>{RVDic.CurrentTheme}</div>
        </Styled.PreviewSelectionWrapper>
      )}
    </Styled.ThemePreviewContainer>
  );
};

export default ThemePreview;
