import useWindowContext from 'hooks/useWindowContext';
import { PropsWithChildren, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useThemeSlice } from 'store/slice/theme';
import { selectTheme } from 'store/slice/theme/selectors';

const ThemeProvider = ({ children }: PropsWithChildren<void>) => {
  const { RV_RTL } = useWindowContext();
  const themeState = useSelector(selectTheme);
  const dispatch = useDispatch();
  const { actions: themeActions } = useThemeSlice();
  useEffect(() => {
    dispatch(themeActions.getCurrentTheme({}));
    const directionState = RV_RTL ? 'direction-rtl' : 'direction-ltr';

    document.body.setAttribute('dir', RV_RTL ? 'rtl' : 'ltr');

    if (themeState.currentTheme)
      document.documentElement.className = [
        themeState.currentTheme,
        'overflow-enabled',
        directionState,
      ].join(' ');
    else
      document.documentElement.className = [
        'default',
        'overflow-enabled',
        directionState,
      ].join(' ');
  }, [themeState.currentTheme, RV_RTL, dispatch, themeActions]);

  return <>{children}</>;
};

export default ThemeProvider;
