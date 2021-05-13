/**
 * Renders all menu items at once.
 */
import { memo, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';
import { sidebarMenuSlice } from 'store/reducers/sidebarMenuReducer';
import DragAndDropTree from 'components/Tree/DragAndDropTree/DragAndDropTree';
import EditableItem from './E-Item';
import { WindowContext } from 'context/WindowProvider';
import {
  moveSidebarNode,
  reorderSidebarNode,
} from 'store/actions/sidebar/sidebarMenuAction';

const selectTree = createSelector(
  (state) => state.sidebarItems,
  (sidebarItems) => sidebarItems.dndTree
);

const EditableTree = () => {
  const dispatch = useDispatch();
  const tree = useSelector(selectTree);

  const { setSidebarDnDTree } = sidebarMenuSlice.actions;
  const { RVGlobal } = useContext(WindowContext);

  const isSaaS = RVGlobal.SAASBasedMultiTenancy;

  //! Mutate tree.
  const handleOnMutateTree = (newTree) => {
    dispatch(setSidebarDnDTree(newTree));
  };

  const handleOnMoveItem = (newTree, source, destination) => {
    if (source.parentId === destination.parentId) {
      dispatch(reorderSidebarNode(newTree, source, destination));
    } else {
      dispatch(moveSidebarNode(newTree, source, destination));
    }
    dispatch(setSidebarDnDTree(newTree));
  };

  //TODO: fix style.
  //! Render custom item.
  const handleRenderItem = (itemProps) => {
    return <EditableItem itemProps={itemProps} />;
  };

  const excludDropIds = Object.values(tree.items)
    .filter((item) => !item.isCategory)
    .map((item) => item.id);

  const categories = Object.values(tree.items)
    .filter((item) => item.isCategory && item.parent !== 'root')
    .map((item) => item.id);

  return (
    <DragAndDropTree
      indentPerLevel={0}
      tree={tree}
      onMutateTree={handleOnMutateTree}
      onMoveItem={handleOnMoveItem}
      renderItem={handleRenderItem}
      excludeDrop={isSaaS ? excludDropIds : []}
      excludeDragDrop={isSaaS && { from: categories, to: categories }}
      draggable
      nestable
    />
  );
};

export default memo(EditableTree);
