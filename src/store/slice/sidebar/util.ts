import { decodeBase64 } from 'helpers/helpers';

export const filterHiddenNodes = (nodes) =>
  (nodes || []).filter((node) => !node.Hidden);

const getChildrenIds = (trees) => {
  return (trees || []).map((tree) => tree.NodeTypeID);
};

export const provideItems = (data) => {
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

export const provideDnDTree = (data) => {
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
