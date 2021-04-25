import { sidebarMenuSlice } from 'store/reducers/sidebarMenuReducer';
import APIHandler from 'apiHelper/APIHandler';
import { pipe } from 'helpers/helpers';

const {
  setSidebarNodeTypes,
  setSidebarTree,
  setEditingTree,
} = sidebarMenuSlice.actions;
const apiHandler = new APIHandler('CNAPI', 'GetNodeTypes');

//! See if any changes happened in nodes.
const hasChanged = (newVal, oldVal) => {
  if (newVal.length !== oldVal.length) return true;
  return !newVal.every((item) => oldVal.includes(item));
};

//! Check if should dispatch to store or not, based on changes that may or may not happened.
const shouldDispatch = (response, state) => {
  const prevIDs = state.nodeTypes.map((node) => node.NodeTypeID);
  const prevNames = state.nodeTypes.map((node) => node.TypeName);
  const nextIDs = response.NodeTypes.map((node) => node.NodeTypeID);
  const nextNames = response.NodeTypes.map((node) => node.TypeName);

  if (hasChanged(nextIDs, prevIDs) || hasChanged(nextNames, prevNames))
    return true;

  return false;
};

//! Filter hidden nodes out.
const filterHiddens = (nodes) => {
  let newFiltered = nodes.next
    .filter((node) => !node.Hidden)
    .map((tree) => {
      if (tree.Sub) {
        let newSub = tree.Sub.filter((s) => !s.Hidden);
        tree.Sub = newSub;
        return tree;
      }
      return tree;
    });

  return { next: newFiltered, prev: nodes.prev };
};

//! Re-organize nodes and filter them down to fresh list.
const reorganize = (nodes) => {
  const oldList = Array.from(nodes.prev)
    //! Filter out brand new nodes.
    .filter(
      (old) => !nodes.next.every((fresh) => fresh.NodeTypeID !== old.NodeTypeID)
    )
    .map((old) => {
      //! Subtitute edited node.
      return nodes.next.find((fresh) => fresh.NodeTypeID === old.NodeTypeID);
    });
  const newList = Array.from(nodes.next).filter(
    (fresh) => !nodes.prev.some((old) => old.NodeTypeID === fresh.NodeTypeID)
  );
  return [...oldList, ...newList];
};

/**
 * @description A function that provides re-organized nodes for dispatching to redux store.
 * @param {Array} next -Fresh nodes fetched from server.
 * @param {Array} prev -Old nodes from redux store.
 * @returns An action that dispatches fresh nodes to redux store.
 */
const nodesToDispatch = (next, prev) => {
  return setSidebarNodeTypes(
    pipe(filterHiddens)({
      next: next.NodeTypes,
      prev: prev.nodeTypes,
    }).next
  );
};

/**
 * @description A function that provides re-organized trees for dispatching to redux store.
 * @param {Array} next -Fresh tree fetched from server.
 * @param {Array} prev -Old tree from redux store.
 * @returns An action that dispatches fresh trees to redux store.
 */
const treesToDispatch = (next, prev) => {
  return setSidebarTree(
    pipe(filterHiddens, reorganize)({ next: next.Tree, prev: prev.tree })
  );
};

/**
 * @description A function (action) that gets sidebar menu item from server.
 * @returns -Dispatch to redux store.
 */
export const getSidebarNodes = () => async (dispatch, getState) => {
  //! Redux store to compair with fresh list.
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
          //! If and only if any change happens in fresh list then it will dispatch to redux store.
          if (shouldDispatch(response, sidebarItems)) {
            dispatch(nodesToDispatch(response, sidebarItems));
            dispatch(treesToDispatch(response, sidebarItems));
          }
        }
      },
      (error) => console.log({ error })
    );
  } catch (err) {
    console.log({ err });
  }
};

/**
 * @description A function (action) that provides editing tree.
 * @returns -Dispatch to redux store.
 */
export const setEditableTrees = (mode = '') => (dispatch, getState) => {
  //! Redux store to get trees.
  const { sidebarItems } = getState();
  const { editingTree, tree } = sidebarItems;

  switch (mode) {
    case 'save':
      dispatch(setSidebarTree(editingTree));
      dispatch(setEditingTree([]));
      break;

    case 'abort':
      dispatch(setEditingTree([]));
      break;

    default:
      let extendedTree = tree.map((t) => {
        const exNode = Object.assign({}, t, {
          edited: false,
          deleted: false,
          created: false,
          moved: false,
        });
        return exNode;
      });
      dispatch(setEditingTree(extendedTree));
      break;
  }
};
