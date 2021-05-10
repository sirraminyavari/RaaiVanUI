/**
 * Renders all menu items at once.
 */
import { memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';
import { sidebarMenuSlice } from 'store/reducers/sidebarMenuReducer';
import DragAndDropTree from 'components/Tree/DragAndDropTree/DragAndDropTree';
import EditableItem from './E-Item';

const selectTree = createSelector(
  (state) => state.sidebarItems,
  (sidebarItems) => sidebarItems.dndTree
);

const EditableTree = () => {
  const dispatch = useDispatch();
  const tree = useSelector(selectTree);
  const { setSidebarDnDTree } = sidebarMenuSlice.actions;

  //! Mutate tree.
  const handleMutateTree = (tree) => {
    dispatch(setSidebarDnDTree(tree));
  };

  //! Render custom item.
  const handleRenderItem = (itemProps) => {
    return <EditableItem itemProps={itemProps} />;
  };

  return (
    <DragAndDropTree
      indentPerLevel={0}
      tree={tree}
      onMutateTree={handleMutateTree}
      renderItem={handleRenderItem}
      dragable
      nestable
    />
  );
};

export default memo(EditableTree);
