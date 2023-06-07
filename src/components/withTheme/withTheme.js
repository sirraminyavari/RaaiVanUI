import { useSelector } from 'react-redux';
import { useThemeSlice } from 'store/slice/theme';
import { selectTheme } from 'store/slice/theme/selectors';

const withTheme = (Component) => (props) => {
  const { actions } = useThemeSlice();
  const states = useSelector(selectTheme);

  return <Component theme={{ states, actions }} {...props} />;
};
withTheme.displayName = 'withTheme';
export default withTheme;
