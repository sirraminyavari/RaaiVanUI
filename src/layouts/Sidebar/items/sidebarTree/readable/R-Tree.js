/**
 * Renders all menu items at once.
 */
import { memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';
import { sidebarMenuSlice } from 'store/reducers/sidebarMenuReducer';
import DragAndDropTree from 'components/Tree/DragAndDropTree/DragAndDropTree';
import ReadableItem from './R-Item';

const selectTree = createSelector(
  (state) => state.sidebarItems,
  (sidebarItems) => sidebarItems.dndTree
);

const ReadableTree = () => {
  const dispatch = useDispatch();
  const tree = useSelector(selectTree);
  const { setSidebarDnDTree } = sidebarMenuSlice.actions;

  //! Mutate tree.
  const handleMutateTree = (tree) => {
    dispatch(setSidebarDnDTree(tree));
  };

  //! Render custom item.
  const handleRenderItem = (itemProps) => {
    return <ReadableItem itemProps={itemProps} />;
  };

  return (
    <DragAndDropTree
      indentPerLevel={0}
      tree={tree}
      onMutateTree={handleMutateTree}
      renderItem={handleRenderItem}
    />
  );
};

export default memo(ReadableTree);
