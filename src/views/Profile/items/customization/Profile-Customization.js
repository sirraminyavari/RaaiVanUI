import { useEffect, memo, useState, createContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Styled from 'views/Profile/Profile.styles';
import BreadcrumbLayout from 'layouts/NewSidebar/breadCrumbLayout/breadcrumbLayout';
import ThemeToggle from 'components/Buttons/Toggle/Toggle';
import { C_DISTANT, C_GRAY_DARK } from 'constant/Colors';
import useWindow from 'hooks/useWindowContext';
import ThemePreview from './ThemePreview';
import {
  SIDEBAR_WINDOW,
  USER_CUSTOMIZATION_PATH,
  USER_PATH,
  TOAST_TIMEOUT,
} from 'constant/constants';
import { saveUserSettings } from 'apiHelper/apiFunctions';
import InfoToast from 'components/toasts/info-toast/InfoToast';
import { useThemeSlice } from 'store/slice/theme';
import { selectTheme } from 'store/slice/theme/selectors';
import {
  RVColorProp,
  RVSizeProp,
  RVVariantProp,
  ShirtSvg,
} from '@cliqmind/rv-components';

export const CustomSettingContext = createContext({});

const ProfileCustomization = ({ route }) => {
  const dispatch = useDispatch();
  const { RV_Float, RVGlobal, RVDic } = useWindow();
  const isSaas = (RVGlobal || {}).SAASBasedMultiTenancy;
  const currentUser = (route || {}).User;

  const {
    actions: { setDarkMode, setSidebarPattern },
  } = useThemeSlice();

  const {
    themes: allThemes,
    isDarkMode,
    hasSidebarPattern,
  } = useSelector(selectTheme);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
    !!currentUser?.Settings?.[SIDEBAR_WINDOW]
  );

  const PAGE_TITLE = RVDic.Personalization;

  const breadcrumbItems = [
    { id: 1, title: RVDic.Profile, linkTo: USER_PATH },
    { id: 2, title: PAGE_TITLE, linkTo: USER_CUSTOMIZATION_PATH },
  ];

  /**
   * @description Provides an appropriate message according to RVDics.
   * @param {String} msg
   * @returns A string message.
   */
  const getMessage = (msg) => {
    return RVDic.MSG[msg] || msg;
  };

  /**
   * @description Renders a toast.
   * @param {('error' | 'info' | 'success' | 'warning' | 'dark')} type -The type of the toast.
   * @param {String} message -The message of the toast.
   */
  const renderToast = (type, message) => {
    return InfoToast({
      type,
      autoClose: TOAST_TIMEOUT,
      message: getMessage(message),
    });
  };

  const handleMenuCollapse = (event) => {
    const isToggled = event.currentTarget.value === 'on';
    setIsSidebarCollapsed(isToggled);

    saveUserSettings(SIDEBAR_WINDOW, isToggled)
      .then((response) => {
        // console.log(response);
        if (response?.ErrorText) {
          setIsSidebarCollapsed(!!currentUser?.Settings?.[SIDEBAR_WINDOW]);
          renderToast('error', response?.ErrorText);
        }
        if (response.Succeed) {
          console.log(response.Succeed);
        }
      })
      .catch((error) => {
        renderToast('error', error);
      });
  };

  const handlePattern = (toggleValue) => {
    dispatch(setSidebarPattern(toggleValue));
  };

  const handleDarkMode = (toggleValue) => {
    dispatch(setDarkMode(toggleValue));
  };

  const { actions: themeActions } = useThemeSlice();

  useEffect(() => {
    dispatch(themeActions.getThemes());
    dispatch(themeActions.getCurrentTheme());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <BreadcrumbLayout
        Icon={(props) => <ShirtSvg {...props} outline />}
        variant={RVVariantProp.white}
        size={RVSizeProp.medium}
        color={RVColorProp.grayDark}
        routeLinks={[{ label: 'Personalization', path: '' }]}
      />
      <Styled.CustomizationView dir={RV_Float}>
        <CustomSettingContext.Provider value={{ isSidebarCollapsed }}>
          <Styled.ProfileViewContainer
            style={{
              margin: '0',
              width: '70%',
            }}
          >
            <div className="profile-theme-setting" style={{ flexShrink: 0 }}>
              <Styled.ThemeSettingTitle>
                {RVDic.ThemeSettings}
              </Styled.ThemeSettingTitle>
              <ThemeToggle
                // disable={isSavingMenuSetting}
                onChange={handleMenuCollapse}
                value={isSidebarCollapsed}
                title="Action menu should be open by default"
                titleClass={`${C_GRAY_DARK} profile-theme-toggle`}
              />
              {!isSaas && (
                <ThemeToggle
                  onToggle={handlePattern}
                  isChecked={hasSidebarPattern}
                  title={RVDic.RV.Settings.ColorfulBubbles}
                  titleClass={`profile-theme-toggle`}
                />
              )}
            </div>
            <Styled.ProfileTitleWrapper>
              <Styled.ChooseThemeTitle>
                {RVDic.ThemeSelect}
              </Styled.ChooseThemeTitle>
              <Styled.PreviewGroups>
                {['default', 'dark', 'amoled'].map((preview, key) => (
                  <ThemePreview key={key} preview={preview} />
                ))}
              </Styled.PreviewGroups>
            </Styled.ProfileTitleWrapper>
          </Styled.ProfileViewContainer>
        </CustomSettingContext.Provider>
      </Styled.CustomizationView>
    </>
  );
};

export default memo(ProfileCustomization);
