import { sidebarMenuSlice } from 'store/reducers/sidebarMenuReducer';
import APIHandler from 'apiHelper/APIHandler';

const { setSidebarNodeTypes, setSidebarTree } = sidebarMenuSlice.actions;
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
      (response) => {
        if (response.NodeTypes || response.Tree) {
          dispatch(setSidebarNodeTypes(response.NodeTypes));
          dispatch(setSidebarTree(response.Tree));
        }
      },
      (error) => console.log({ error })
    );
  } catch (err) {
    console.log({ err });
  }
};
export default getSidebarNodes;
