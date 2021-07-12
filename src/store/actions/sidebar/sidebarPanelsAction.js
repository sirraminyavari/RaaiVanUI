import { sidebarMenuSlice } from 'store/reducers/sidebarMenuReducer';
import permissions from 'views/AdminPanel/permissions';
import { API_Provider } from 'helpers/helpers';
import { PRIVACY_API, CHECK_AUTHORITY } from 'constant/apiConstants';

const { setConfigPanels } = sidebarMenuSlice.actions;
const checkAuthorityAPI = API_Provider(PRIVACY_API, CHECK_AUTHORITY);

const getConfigPanels = () => async (dispatch) => {
  let itemNames = permissions?.map((permisson) => permisson.Name);

  try {
    checkAuthorityAPI.fetch(
      { Permissions: itemNames.join('|') },
      (response) => {
        const panels = permissions?.filter(
          (permission) => response?.[permission.Name]
        );
        dispatch(setConfigPanels(panels));
      },
      (error) => console.log(error)
    );
  } catch (err) {
    console.log({ err });
  }
};
export default getConfigPanels;
