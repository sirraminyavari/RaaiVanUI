import { sidebarMenuSlice } from 'store/reducers/sidebarMenuReducer';
import permissions from 'views/AdminPanel/permissions';
import APIHandler from 'apiHelper/APIHandler';

const { setConfigPanels } = sidebarMenuSlice.actions;
const apiHandler = new APIHandler('PrivacyAPI', 'CheckAuthority');

const getConfigPanels = () => async (dispatch) => {
  let itemNames = [];

  for (let i = 0; i < permissions.length; ++i) {
    itemNames.push(permissions[i].Name);
  }

  try {
    apiHandler.fetch(
      {
        Permissions: itemNames.join('|'),
        ParseResults: true,
      },
      (response) => {
        const panels = permissions.filter(
          (permission) => response[permission.Name]
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
