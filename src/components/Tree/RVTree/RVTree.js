import Tree, { moveItemOnTree, mutateTree } from '@atlaskit/tree';
import React, { useState } from 'react';

const RVTree = ({ tree: _tree, children, onMove, onSort }) => {
  const [tree, setTree] = useState(_tree);
  const onExpand = (id) => {
    setTree(mutateTree(tree, id, { isExpanded: true }));
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

  const renderItem = (props) => React.cloneElement(children, props);

  return (
    <div>
      {tree?.rootId && (
        <Tree
          tree={tree}
          renderItem={renderItem}
          onExpand={onExpand}
          onCollapse={onCollapse}
          onDragEnd={onDragEnd}
          offsetPerLevel={0}
          isDragEnabled={true}
          isNestingEnabled={true}
        />
      )}
    </div>
  );
};
export default RVTree;
