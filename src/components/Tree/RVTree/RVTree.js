import Tree, { moveItemOnTree, mutateTree } from '@atlaskit/tree';
import React, { useEffect, useState } from 'react';

const RVTree = ({
  data,
  children,
  onMove,
  onSort,
  isDragEnabled,
  isNestingEnabled,
  offsetPerLevel,
}) => {
  const [tree, setTree] = useState(data);

  useEffect(() => {
    setTree(data);
  }, [data]);

  const onExpand = (id, item = {}) => {
    setTree(mutateTree(tree, id, { ...item, isExpanded: true }));
  };

  const onCollapse = (id) => {
    setTree(mutateTree(tree, id, { isExpanded: false }));
  };

  const onDragEnd = (src, dest) => {
    if (!dest) {
      return;
    }

    if (dest?.parentId === src?.parentId) {
      // sort action
      const newTree = moveItemOnTree(tree, src, dest);
      handleSortNodes(newTree?.items[`${src?.parentId}`]?.children);
      setTree(newTree);
    } else {
      // move action
      const id = tree?.items[`${src?.parentId}`]?.children[src?.index];
      handleMoveItem(id, dest?.parentId);
      const newTree = moveItemOnTree(tree, src, dest);
      setTree(newTree);
    }
  };

  const handleMoveItem = (id, parentId) => {
    onMove && onMove(id, parentId);
  };

  const handleSortNodes = (ids) => {
    onSort && onSort(ids);
  };

  //! pass props to tree item as a child
  const renderItem = (props) => {
    return typeof children === 'function'
      ? children({ ...props, loadChildrenAndExpand })
      : React.cloneElement(React.Children.only(children), {
          ...props,
          loadChildrenAndExpand,
        });
  };

  const loadChildrenAndExpand = ({ id, children, childrenObjects }) => {
    const _tree = {
      rootId: tree?.rootId,
      items: {
        ...tree?.items,
        ...childrenObjects,
      },
    };

    setTree(
      mutateTree(_tree, id, {
        children,
        isExpanded: true,
        isChildrenLoading: false,
      })
    );
  };

  return (
    <div>
      {tree?.rootId && (
        <Tree
          tree={tree}
          renderItem={renderItem}
          onExpand={onExpand}
          onCollapse={onCollapse}
          onDragEnd={onDragEnd}
          offsetPerLevel={offsetPerLevel}
          isDragEnabled={isDragEnabled}
          isNestingEnabled={isNestingEnabled}
        />
      )}
    </div>
  );
};
export default RVTree;
