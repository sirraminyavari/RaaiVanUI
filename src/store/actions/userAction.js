import { userSlice } from "../reducers/userReducer";

const { loginUser, logoutUser } = userSlice.actions;

export const login = ({ username, password }) => async (dispatch) => {
  try {
    // await for api to login with username and password
    dispatch(loginUser({ username }));
  } catch (e) {
    return console.error(e);
  }
};

export const logout = () => async (dispatch) => {
  try {
    // await for api to logout user
    return dispatch(logoutUser());
  } catch (e) {
    return console.error(e);
  }
};
