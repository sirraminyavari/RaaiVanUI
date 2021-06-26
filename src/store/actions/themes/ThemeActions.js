import { API_Provider } from 'helpers/helpers';
import { themeSlice } from 'store/reducers/themeReducer';
import {
  RV_API,
  USERS_API,
  GET_THEMES,
  GET_THEME,
} from 'constant/apiConstants';

const { setThemes, setCurrentTheme } = themeSlice.actions;

const getAllThemesAPI = API_Provider(RV_API, GET_THEMES);
const getCurrentThemeAPI = API_Provider(USERS_API, GET_THEME);

/**
 * @description A function (action) that gets all themes from server.
 * @returns -Dispatch to redux store.
 */
export const getThemes = () => async (dispatch) => {
  try {
    getAllThemesAPI.fetch(
      {},
      (response) => {
        dispatch(setThemes(response?.Themes));
      },
      (error) => console.log({ error })
    );
  } catch (err) {
    console.log({ err });
  }
};

/**
 * @description A function (action) that gets current theme from server.
 * @returns -Dispatch to redux store.
 */
export const getCurrentTheme = () => async (dispatch) => {
  try {
    getCurrentThemeAPI.fetch(
      {},
      (response) => {
        dispatch(setCurrentTheme(response?.Theme));
      },
      (error) => console.log({ error })
    );
  } catch (err) {
    console.log({ err });
  }
};
