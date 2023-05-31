import { WindowContext } from 'context/WindowProvider';
import useWindowContext from 'hooks/useWindowContext';
import { PropsWithChildren, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectTheme } from 'store/slice/theme/selectors';

const ThemeProvider = ({ children }: PropsWithChildren<void>) => {
  const { RV_RTL } = useWindowContext();
  const themeState = useSelector(selectTheme);
  useEffect(() => {
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
  }, [themeState.currentTheme, RV_RTL]);
  return <>{children}</>;
};

export default ThemeProvider;
