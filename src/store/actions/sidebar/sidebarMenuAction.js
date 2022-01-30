import { sidebarMenuSlice } from 'store/reducers/sidebarMenuReducer';
import { decodeBase64, encodeBase64, API_Provider } from 'helpers/helpers';
import {
  CN_API,
  PRIVACY_API,
  GET_FAVORITE_NODES_COUNT,
  RENAME_NODE_TYPE,
  REMOVE_NODE_TYPE,
  MOVE_NODE_TYPE,
  SET_NODE_TYPE_ORDER,
  RECOVER_NODE_TYPE,
  CHECK_AUTHORITY,
} from 'constant/apiConstants';
import { getNodeTypes } from 'apiHelper/ApiHandlers/CNApi';

const {
  setSidebarNodeTypes,
  setSidebarTree,
  setSidebarDnDTree,
  setFavoriteNodesCount,
  setUnderMenuList,
} = sidebarMenuSlice.actions;

const renameNodeAPI = API_Provider(CN_API, RENAME_NODE_TYPE);
const deleteNodeAPI = API_Provider(CN_API, REMOVE_NODE_TYPE);
const moveNodeAPI = API_Provider(CN_API, MOVE_NODE_TYPE);
const reorderNodesAPI = API_Provider(CN_API, SET_NODE_TYPE_ORDER);
const recoverNodeAPI = API_Provider(CN_API, RECOVER_NODE_TYPE);
const getFavoriteNodesCountAPI = API_Provider(CN_API, GET_FAVORITE_NODES_COUNT);
const getUnderMenuPermissionsAPI = API_Provider(PRIVACY_API, CHECK_AUTHORITY);

//! Filter hidden nodes out.
const filterHiddenNodes = (nodes) =>
  (nodes || []).filter((node) => !node.Hidden);

const getChildrenIds = (trees) => {
  return (trees || []).map((tree) => tree.NodeTypeID);
};

const provideItems = (data) => {
  const items = filterHiddenNodes(data?.NodeTypes) || [];
  const appId = data?.AppID;

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
  if (!data?.AppID) return {};

  const filteredNodes = filterHiddenNodes(data?.NodeTypes || []) || [];

  const rootChildren = getChildrenIds(
    filteredNodes?.filter((node) => {
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
 * @returns Dispatch to redux store.
 */
export const getSidebarNodeTypes = (done, error) => async (
  dispatch,
  getState
) => {
  const response = await getNodeTypes({
    Icon: true,
    Count: 1000,
    Tree: true,
    CheckAccess: true,
  });

  if (response.NodeTypes || response.Tree) {
    done && done();
    const dndTree = provideDnDTree(response);
    dispatch(setSidebarNodeTypes(response.NodeTypes));
    dispatch(setSidebarTree(response.Tree));
    dispatch(setSidebarDnDTree(dndTree));
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
        dispatch(getSidebarNodeTypes());
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
        dispatch(getSidebarNodeTypes());
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
        dispatch(getSidebarNodeTypes());
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
        dispatch(getSidebarNodeTypes());
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
              (response) => {
                dispatch(getSidebarNodeTypes());
              },
              (error) => console.log(error)
            );
          } catch (err) {
            console.log({ err });
          }
        } else {
          dispatch(getSidebarNodeTypes());
        }
      },
      (error) => {
        console.log({ error });
        dispatch(getSidebarNodeTypes());
      }
    );
  } catch (err) {
    console.log({ err });
  }
};

/**
 * @description A function (action) that gets favorite nodes count.
 * @returns -Dispatch to redux store.
 */
export const getFavoriteNodesCount = () => async (dispatch) => {
  try {
    getFavoriteNodesCountAPI.fetch(
      {},
      (response) => {
        const favoriteNodesCount = ((response || {}).NodeTypes || []).reduce(
          (acc, cur) => acc + cur.Count,
          0
        );
        dispatch(setFavoriteNodesCount(favoriteNodesCount));
      },
      (error) => {
        console.log({ error });
      }
    );
  } catch (err) {
    console.log({ err });
  }
};

/**
 * @description A function (action) that gets favorite nodes count.
 * @returns -Dispatch to redux store.
 */
export const getUnderMenuPermissions = (permissions) => async (dispatch) => {
  try {
    getUnderMenuPermissionsAPI.fetch(
      { Permissions: permissions.join('|') },
      (response) => {
        const permissionList =
          Object.keys(response).filter(
            (item) => permissions.includes(item) && !!response[item]
          ) || [];
        dispatch(setUnderMenuList(permissionList));
      },
      (error) => {
        console.log({ error });
      }
    );
  } catch (err) {
    console.log({ err });
  }
};
