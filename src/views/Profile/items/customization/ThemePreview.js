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
import clsx from 'clsx';
import { RVColorProp } from '@cliqmind/rv-components';

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
  const isActive = currentTheme === preview;

  const handleSelectTheme = () => {
    try {
      setThemeAPI.fetch(
        { Theme: preview },
        (response) => {
          if (response.Succeed) {
            const currentThemeURL = RVAPI.ThemeURL({
              Name: RVGlobal.Theme || 'default',
            });
            const newThemeURL = RVAPI.ThemeURL({ preview });
            DynamicFileUtilities.replace_css(currentThemeURL, newThemeURL);
            RVGlobal.Theme = preview;
            dispatch(setCurrentTheme(preview));
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
      className={clsx(preview, RVColorProp.cgBlue)}
    >
      <Styled.NavbarPreview className={preview} />
      <Styled.SidebarPreview
        hasPattern={false}
        isClose={!isSidebarCollapsed}
        dir={RV_Float}
        className={RVColorProp.oxford}
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
