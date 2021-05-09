import PropTypes from 'prop-types';
import Tree, { mutateTree, moveItemOnTree } from '@atlaskit/tree';

const DragAndDropTree = (props) => {
  const {
    tree,
    paddingPerLevel,
    onMutateTree,
    excludeDrag,
    excludeDrop,
    renderItem,
  } = props;

  // const handleOnDelete = (item) => {
  //   alert(`${item.data.title} has been deleted`);

  //   const itemParent = Object.values(tree.items).find(
  //     (i) => i.id === item.parent
  //   );

  //   const treeDeletedOnItem = mutateTree(tree, item.id, { isDeleted: true });
  //   const treeRemovedOnParent = mutateTree(treeDeletedOnItem, item.parent, {
  //     children: itemParent.children.filter((child) => child !== item.id),
  //   });

  //   setTree(treeRemovedOnParent);
  // };

  const handleOnExpand = (itemId) => {
    onMutateTree(mutateTree(tree, itemId, { isExpanded: true }));
  };

  const handleOnCollapse = (itemId) => {
    onMutateTree(mutateTree(tree, itemId, { isExpanded: false }));
  };

  const handleOnDragEnd = (source, destination) => {
    if (!destination) return;
    if (excludeDrop && excludeDrop.includes(destination.parentId)) return;

    const draggingId = tree.items[source.parentId].children[source.index];

    if (excludeDrag && excludeDrag.includes(draggingId)) return;

    console.log(source, 'source');
    console.log(destination, 'destination');

    const newTree = moveItemOnTree(tree, source, destination);
    onMutateTree(newTree);
  };

  // //! Filter deleted items out.
  // const filterTree = (tree) => {
  //   const itemsList = Object.values(tree.items).filter((item) => {
  //     return !item.isDeleted;
  //   });

  //   const newItems = itemsList.reduce((items, value) => {
  //     return Object.assign({}, items, { [value.id]: value });
  //   }, {});

  //   const filteredTree = { ...tree, items: newItems };

  //   return filteredTree;
  // };

  return (
    <Tree
      tree={tree}
      renderItem={renderItem}
      onExpand={handleOnExpand}
      onCollapse={handleOnCollapse}
      onDragEnd={handleOnDragEnd}
      offsetPerLevel={paddingPerLevel}
      isDragEnabled
      isNestingEnabled
    />
  );
};

DragAndDropTree.propTypes = {
  paddingPerLevel: PropTypes.number,
  data: PropTypes.object,
  onMutateData: PropTypes.func,
  excludeDrop: PropTypes.array,
  excludeDrag: PropTypes.array,
  renderItem: PropTypes.func,
};

DragAndDropTree.defaultProps = {
  paddingPerLevel: 16,
};

DragAndDropTree.displayName = 'DragAndDropTreeComponent';

export default DragAndDropTree;
