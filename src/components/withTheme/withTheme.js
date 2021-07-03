import { useSelector } from 'react-redux';
import { themeSlice } from 'store/reducers/themeReducer';
import { createSelector } from 'reselect';

const selectThemeStates = createSelector(
  (state) => state.theme,
  (theme) => theme
);

const withTheme = (Component) => (props) => {
  const actions = themeSlice.actions;
  const states = useSelector(selectThemeStates);

  return <Component theme={{ states, actions }} {...props} />;
};

export default withTheme;
