import PropTypes from 'prop-types';
import Tree, { mutateTree, moveItemOnTree } from '@atlaskit/tree';

/**
 * @typedef PropType
 * @property {object} tree - Tree data needed for component.
 * @property {number} [indentPerLevel] -The indentation for each level of tree.
 * @property {function} onMutateTree -A callback function that fires on every tree mutation.
 * @property {function} renderItem -A callback function that renders a custom item for tree.
 * @property {array} excludeDrag -An array of items that are NOT draggable at all.
 * @property {array} excludeDrop -An array of items that are NOT dropable at all.
 * @property {Object} excludeDragDrop -Dropable and dragable items that are in conflict with each other.
 * @property {boolean} draggable -If true, Tree items are draggable.
 * @property {boolean} nestable -If true, Tree items can be nested.
 */

/**
 *  @description Renders a DnD tree.
 * @component
 * @param {PropType} props
 */
const DragAndDropTree = (props) => {
  const {
    tree,
    indentPerLevel,
    onMutateTree,
    excludeDrag,
    excludeDrop,
    excludeDragDrop,
    renderItem,
    draggable,
    nestable,
  } = props;

  //! Expand tree.
  const handleOnExpand = (itemId) => {
    onMutateTree(mutateTree(tree, itemId, { isExpanded: true }));
  };

  //! Collapse tree.
  const handleOnCollapse = (itemId) => {
    onMutateTree(mutateTree(tree, itemId, { isExpanded: false }));
  };

  //! Controles drag and drop event.
  const handleOnDragEnd = (source, destination) => {
    //! Item is out of dropable range.
    if (!destination) return;

    //! Make an area non-dropable.
    if (excludeDrop && excludeDrop.includes(destination.parentId)) return;

    //! Make an item non-draggable.
    const draggingId = tree.items[source.parentId].children[source.index];
    if (excludeDrag && excludeDrag.includes(draggingId)) return;

    //! Forbidden from one list of items to other.
    if (
      excludeDragDrop &&
      excludeDragDrop.from.includes(draggingId) &&
      excludeDragDrop.to.includes(destination.parentId)
    )
      return;

    const newTree = moveItemOnTree(tree, source, destination);
    onMutateTree(newTree);
  };

  return (
    <Tree
      tree={tree}
      renderItem={renderItem}
      onExpand={handleOnExpand}
      onCollapse={handleOnCollapse}
      onDragEnd={handleOnDragEnd}
      offsetPerLevel={indentPerLevel}
      isDragEnabled={!!draggable}
      isNestingEnabled={!!nestable}
    />
  );
};

DragAndDropTree.propTypes = {
  indentPerLevel: PropTypes.number,
  tree: PropTypes.object,
  onMutateTree: PropTypes.func,
  excludeDrop: PropTypes.array,
  excludeDrag: PropTypes.array,
  excludeDragDrop: PropTypes.object,
  renderItem: PropTypes.func,
  draggable: PropTypes.bool,
  nestable: PropTypes.bool,
};

DragAndDropTree.defaultProps = {
  indentPerLevel: 16,
};

DragAndDropTree.displayName = 'DragAndDropTreeComponent';

export default DragAndDropTree;
