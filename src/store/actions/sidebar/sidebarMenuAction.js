import { sidebarMenuSlice } from 'store/reducers/sidebarMenuReducer';
import APIHandler from 'apiHelper/APIHandler';
import { pipe } from 'helpers/helpers';

const { setSidebarNodeTypes, setSidebarTree } = sidebarMenuSlice.actions;
const apiHandler = new APIHandler('CNAPI', 'GetNodeTypes');

//! See if any changes happened in nodes.
const hasChanged = (newVal, oldVal) => {
  if (newVal.length !== oldVal.length) return { type: 'length', value: true };
  return { type: 'prop', value: !newVal.every((id) => oldVal.includes(id)) };
};

//! Check if should dispatch to store or not, based on changes.
const shouldDispatch = (state, response) => {
  const oldNodeIDs = state.nodeTypes.map((node) => node.NodeTypeID);
  const oldNodeNames = state.nodeTypes.map((node) => node.TypeName);
  const newNodeIDs = response.NodeTypes.map((node) => node.NodeTypeID);
  const newNodeNames = response.NodeTypes.map((node) => node.TypeName);

  if (
    hasChanged(newNodeIDs, oldNodeIDs).value ||
    hasChanged(newNodeNames, oldNodeNames).value
  )
    return true;

  return false;
};

//! Filter hidden nodes out.
const filterHiddens = (nodes) => {
  return nodes
    .filter((node) => !node.Hidden)
    .map((tree) => {
      if (tree.Sub) {
        let newSub = tree.Sub.filter((s) => !s.Hidden);
        tree.Sub = newSub;
        return tree;
      }
      return tree;
    });
};

const getSidebarNodes = () => async (dispatch, getState) => {
  const { sidebarItems } = getState();
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
          if (shouldDispatch(sidebarItems, response)) {
            const nodesToDispatch =
              pipe(filterHiddens)(response.NodeTypes) || [];
            const treesToDispatch = pipe(filterHiddens)(response.Tree) || [];
            console.log({ nodesToDispatch, treesToDispatch });
            dispatch(setSidebarNodeTypes(nodesToDispatch));
            dispatch(setSidebarTree(treesToDispatch));
          }
        }
      },
      (error) => console.log({ error })
    );
  } catch (err) {
    console.log({ err });
  }
};
export default getSidebarNodes;
