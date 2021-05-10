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
      isExpanded: false,
      isChildrenLoading: false,
      isEditable: true,
      isDeleted: false,
      isCategory: !!item.isCategory,
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
    data.NodeTypes.filter((node) => (!!node.ParentID ? false : true))
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
export const getSidebarNodes = () => async (dispatch, getState) => {
  //! Redux store.
  const { sidebarItems } = getState();
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
          console.log(filterHiddenNodes(response.NodeTypes));

          dispatch(setSidebarNodeTypes(filterHiddenNodes(response.NodeTypes)));
          dispatch(setSidebarTree(response.Tree));
          dispatch(setSidebarDnDTree(provideDnDTree(response)));
        }
      },
      (error) => console.log({ error })
    );
  } catch (err) {
    console.log({ err });
  }
};

/**
 * @description A function (action) that rename the sidebar menu item.
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
