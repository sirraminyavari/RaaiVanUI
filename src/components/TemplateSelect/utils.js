import { decodeBase64 } from 'helpers/helpers';

export const provideNodeTypesForTree = (data) => {
  const { AppID, NodeTypes } = data || {};

  //! Root id for tree (It is required according to documentation).
  const rootId = `templates-${AppID || 'templates-list'}`;

  const categories = NodeTypes?.filter((node) => !node?.ParentID);
  const children = NodeTypes?.filter((node) => node?.ParentID);

  //! Provide category ids.
  const parentIds = categories.map((node) => node?.NodeTypeID);

  //! Provide categories for tree.
  const templateCategories = categories?.reduce((acc, currentValue) => {
    const { NodeTypeID: id, TypeName: title } = currentValue;
    const childrenIds = NodeTypes.filter((node) => node?.ParentID === id).map(
      (node) => node?.NodeTypeID
    );

    const treeObj = {
      id,
      children: childrenIds,
      hasChildren: !!childrenIds.length,
      isCategory: true,
      isExpanded: false,
      isChildrenLoading: false,
      data: {
        title: decodeBase64(title),
        rawData: currentValue,
      },
    };

    return { ...acc, [id]: treeObj };
  }, {});

  //! Provide children for tree.
  const templateChildren = children?.reduce((acc, currentValue) => {
    const { NodeTypeID: id, TypeName: title } = currentValue;

    const treeObj = {
      id,
      children: [],
      hasChildren: false,
      isCategory: false,
      isExpanded: false,
      isChildrenLoading: false,
      data: {
        title: decodeBase64(title),
        rawData: currentValue,
      },
    };

    return { ...acc, [id]: treeObj };
  }, {});

  const templatesForTree = {
    rootId,
    items: {
      [rootId]: {
        id: rootId,
        children: parentIds,
        hasChildren: true,
        isCategory: true,
        isExpanded: true,
        isChildrenLoading: false,
        data: {
          title: 'Templates Tree',
        },
      },
      ...templateCategories,
      ...templateChildren,
    },
  };

  return templatesForTree;
};
