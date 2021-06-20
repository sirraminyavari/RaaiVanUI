import { sidebarMenuSlice } from 'store/reducers/sidebarMenuReducer';
import APIHandler from 'apiHelper/APIHandler';
import { decodeBase64, encodeBase64 } from 'helpers/helpers';

const {
  setSidebarNodeTypes,
  setSidebarTree,
  setSidebarDnDTree,
} = sidebarMenuSlice.actions;

const getNodesAPI = new APIHandler('CNAPI', 'GetNodeTypes');
const renameNodeAPI = new APIHandler('CNAPI', 'RenameNodeType');
const deleteNodeAPI = new APIHandler('CNAPI', 'RemoveNodeType');
const moveNodeAPI = new APIHandler('CNAPI', 'MoveNodeType');
const reorderNodesAPI = new APIHandler('CNAPI', 'SetNodeTypesOrder');
const recoverNodeAPI = new APIHandler('CNAPI', 'RecoverNodeType');

//! Filter hidden nodes out.
const filterHiddenNodes = (nodes) => nodes.filter((node) => !node.Hidden);

const getChildrenIds = (trees) => {
  return trees.map((tree) => tree.NodeTypeID);
};

const provideItems = (data) => {
  const items = filterHiddenNodes(data.NodeTypes);
  const appId = data.AppID;

  return items.reduce((prevItems, item, _, self) => {
    const itemChildrens = self.filter((i) => i.ParentID === item.NodeTypeID);

    const extendedItem = {
      id: item.NodeTypeID,
      parent: item.ParentID || appId,
      children: getChildrenIds(itemChildrens),
      hasChildren: !!itemChildrens.length,
      isCategory: !!item.IsCategory,
      isExpanded: false,
      isChildrenLoading: false,
      isEditable: true,
      isDeleted: false,
      isEditing: false,
      data: {
        title: decodeBase64(item.TypeName),
        iconURL: item.IconURL,
      },
    };
    return { ...prevItems, [item.NodeTypeID]: extendedItem };
  }, {});
};

const provideDnDTree = (data) => {
  const rootChildren = getChildrenIds(
    data.NodeTypes.filter((node) => {
      if (node.ParentID) return false;
      return true;
    })
  );
  const restItems = provideItems(data);
  return {
    rootId: data.AppID,
    items: {
      [data.AppID]: {
        id: data.AppID,
        parent: 'root',
        children: rootChildren,
        hasChildren: true,
        isCategory: true,
        isExpanded: true,
        isChildrenLoading: false,
        isDeleted: false,
        data: {
          title: 'root',
        },
      },
      ...restItems,
    },
  };
};

/**
 * @description A function (action) that gets sidebar menu item from server.
 * @returns -Dispatch to redux store.
 */
export const getSidebarNodes = (done, error) => async (dispatch, getState) => {
  try {
    getNodesAPI.fetch(
      {
        Icon: true,
        Count: 1000,
        Tree: true,
        CheckAccess: true,
        ParseResults: true,
      },
      (response) => {
        if (response.NodeTypes || response.Tree) {
          done && done();
          dispatch(setSidebarNodeTypes(filterHiddenNodes(response.NodeTypes)));
          dispatch(setSidebarTree(response.Tree));
          dispatch(setSidebarDnDTree(provideDnDTree(response)));
        }
      },
      (err) => {
        console.log({ err });
        error && error();
      }
    );
  } catch (err) {
    console.log({ err });
  }
};

/**
 * @description A function (action) that renames the sidebar menu item.
 * @returns -Dispatch to redux store.
 */
export const renameSidebarNode = (nodeId, nodeName) => async (
  dispatch,
  getState
) => {
  try {
    renameNodeAPI.fetch(
      {
        NodeTypeID: nodeId,
        Name: encodeBase64(nodeName),
      },
      (response) => {
        dispatch(getSidebarNodes());
      },
      (error) => console.log({ error })
    );
  } catch (err) {
    console.log({ err });
  }
};

/**
 * @description A function (action) that removes the sidebar menu item.
 * @returns -Dispatch to redux store.
 */
export const deleteSidebarNode = (node, hierarchy = false, done) => async (
  dispatch
) => {
  try {
    deleteNodeAPI.fetch(
      {
        NodeTypeID: node.id,
        RemoveHierarchy: hierarchy,
      },
      (response) => {
        console.log(response);
        done(node);
        dispatch(getSidebarNodes());
      },
      (error) => console.log({ error })
    );
  } catch (err) {
    console.log({ err });
  }
};

/**
 * @description A function (action) that moves item on sidebar tree.
 * @returns -Dispatch to redux store.
 */
export const moveSidebarNode = (newTree, source, destination) => async (
  dispatch,
  getState
) => {
  //! Redux store.
  const { theme } = getState();
  const { selectedTeam } = theme;
  let parentId = null; //! Item is at root level.

  //! Check if item moved to root or not.
  if (destination.parentId !== selectedTeam.id) {
    parentId = destination.parentId; //! Item is NOT at root level.
  }

  const nodeId = source.id;

  try {
    moveNodeAPI.fetch(
      {
        NodeTypeID: nodeId,
        ParentID: parentId,
      },
      (response) => {
        dispatch(getSidebarNodes());
      },
      (error) => console.log({ error })
    );
  } catch (err) {
    console.log({ err });
  }
};

/**
 * @description A function (action) that reorder items on sidebar tree.
 * @returns -Dispatch to redux store.
 */
export const reorderSidebarNode = (newTree, source, destination) => async (
  dispatch,
  getState
) => {
  try {
    const nodeIds = newTree.items[source.parentId].children.join('|');

    reorderNodesAPI.fetch(
      {
        NodeTypeIDs: nodeIds,
      },
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log({ error });
        dispatch(getSidebarNodes());
      }
    );
  } catch (err) {
    console.log({ err });
  }
};

/**
 * @description A function (action) that recover deleted items to sidebar tree.
 * @returns -Dispatch to redux store.
 */
export const recoverSidebarNode = (node) => async (dispatch, getState) => {
  try {
    recoverNodeAPI.fetch(
      {
        NodeTypeID: node.id,
      },
      (response) => {
        if (node.hasChildren) {
          const nodeTypeIds = node.children.join('|');
          try {
            moveNodeAPI.fetch(
              {
                NodeTypeID: nodeTypeIds,
                ParentID: node.id,
              },
              () => {
                dispatch(getSidebarNodes());
              },
              (error) => console.log(error)
            );
          } catch (err) {
            console.log({ err });
          }
        } else {
          dispatch(getSidebarNodes());
        }
      },
      (error) => {
        console.log({ error });
        dispatch(getSidebarNodes());
      }
    );
  } catch (err) {
    console.log({ err });
  }
};
