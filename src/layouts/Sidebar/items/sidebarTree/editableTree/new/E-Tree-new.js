/**
 * Renders all menu items at once.
 */
import { memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';
import { sidebarMenuSlice } from 'store/reducers/sidebarMenuReducer';
import DragAndDropTree from 'components/Tree/DragAndDropTree/DragAndDropTree';
import EditableItem from './E-Branch.new';

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
      paddingPerLevel={0}
      tree={tree}
      onMutateTree={handleMutateTree}
      renderItem={handleRenderItem}
    />
  );
};

export default memo(EditableTree);
