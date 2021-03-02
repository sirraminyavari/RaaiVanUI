import { useSelector } from 'react-redux';
import { themeSlice } from 'store/reducers/themeReducer';

const withTheme = (Component) => (props) => {
  const actions = themeSlice.actions;
  const states = useSelector((state) => state.theme);

  return <Component theme={{ states, actions }} {...props} />;
};

export default withTheme;
