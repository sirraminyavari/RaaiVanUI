import { decodeBase64 } from 'helpers/helpers';

const provideTree = (data) => {
  const { NodeTypes, AppID } = data || {};

  const categoryNodes = NodeTypes?.filter((node) => !!node?.IsCategory);
  const notCategoryNodes = NodeTypes?.filter((node) => !node?.IsCategory);

  const rootId = `templates-tree-${AppID}`;
  const categoryIds = categoryNodes?.map((node) => node?.NodeTypeID);

  //! Add not categorized to tree if there are any.
  if (notCategoryNodes.length) {
    categoryIds.push('not-categorized');
  }

  const categoriesForTree = categoryNodes.reduce((acc, current) => {
    const { NodeTypeID, TypeName, HasChild } = current || {};
    const nodeForTree = {
      id: NodeTypeID,
      children: [],
      hasChildren: !!HasChild,
      isCategory: true,
      isExpanded: false,
      isChildrenLoading: false,
      data: {
        title: decodeBase64(TypeName),
      },
    };

    return { ...acc, [NodeTypeID]: nodeForTree };
  }, {});

  const notCategorizedForTree = notCategoryNodes.length
    ? {
        'not-categorized': {
          id: 'not-categorized',
          children: ['not-categorized-children'],
          hasChildren: true,
          isCategory: true,
          isOther: true,
          isExpanded: false,
          isChildrenLoading: false,
          data: {
            title: 'دسته‌بندی نشده',
          },
        },
        'not-categorized-children': {
          id: 'not-categorized-children',
          children: [],
          hasChildren: false,
          isCategory: false,
          isExpanded: false,
          isChildrenLoading: false,
          data: {
            templates: notCategoryNodes,
          },
        },
      }
    : {};

  const tree = {
    rootId,
    items: {
      [rootId]: {
        id: rootId,
        children: categoryIds,
        hasChildren: true,
        isCategory: true,
        isExpanded: true,
        isChildrenLoading: false,
        data: {
          title: 'Templates Tree',
        },
      },
      ...categoriesForTree,
      ...notCategorizedForTree,
    },
  };

  return tree;
};

export default provideTree;
