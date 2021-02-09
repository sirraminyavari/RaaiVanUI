import { sidebarMenuSlice } from '../../reducers/sidebarMenuReducer';
import APIHandler from '../../../apiHelper/APIHandler';

const { setSidebarNodes } = sidebarMenuSlice.actions;
const apiHandler = new APIHandler('CNAPI', 'GetNodeTypes');

const getSidebarNodes = () => async (dispatch) => {
  try {
    apiHandler.fetch(
      {
        Icon: true,
        Count: 1000,
        Tree: true,
        CheckAccess: true,
        ParseResults: true,
      },
      (response) => dispatch(setSidebarNodes(response)),
      (error) => console.log({ error })
    );
  } catch (err) {
    console.log({ err });
  }
};
export default getSidebarNodes;
