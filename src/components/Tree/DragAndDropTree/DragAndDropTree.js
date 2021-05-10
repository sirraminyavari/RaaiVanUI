import PropTypes from 'prop-types';
import Tree, { mutateTree, moveItemOnTree } from '@atlaskit/tree';

/**
 * @typedef PropType
 * @property {object} tree - Tree data needed for component.
 * @property {number} [indentPerLevel] -The indentation for each level of tree.
 * @property {function} onMutateTree -A callback function that fires on every tree mutation.
 * @property {function} renderItem -A callback function that renders a custom item for tree.
 * @property {array} excludeDrag -An array of items that are NOT draggable.
 * @property {array} excludeDrop -An array of items that are NOT dropable.
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
    renderItem,
    draggable,
    nestable,
  } = props;

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
  onMutateData: PropTypes.func,
  excludeDrop: PropTypes.array,
  excludeDrag: PropTypes.array,
  renderItem: PropTypes.func,
  draggable: PropTypes.bool,
  nestable: PropTypes.bool,
};

DragAndDropTree.defaultProps = {
  paddingPerLevel: 16,
};

DragAndDropTree.displayName = 'DragAndDropTreeComponent';

export default DragAndDropTree;
