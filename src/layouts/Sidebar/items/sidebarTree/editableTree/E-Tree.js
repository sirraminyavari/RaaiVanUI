/**
 * Renders all menu items at once.
 */
import { memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import EditableBranch from './E-Branch';
import { createSelector } from 'reselect';
import DnDProvider from 'components/DnDProvider/DnDProvider';
import { reorder } from 'helpers/helpers';
import { sidebarMenuSlice } from 'store/reducers/sidebarMenuReducer';

const selectTree = createSelector(
  (state) => state.sidebarItems,
  (sidebarItems) => sidebarItems.editingTree
);

const EditableTree = () => {
  const dispatch = useDispatch();
  const tree = useSelector(selectTree);
  const { setReorderedTree } = sidebarMenuSlice.actions;

  const extendedTree = tree.map((t) => {
    const exNode = Object.assign({}, t, { id: t.NodeTypeID });
    return exNode;
  });

  //! Calls whenever item dragging is ended and reorders the tree list.
  const handleOnDragEnd = (result) => {
    const { source, destination } = result;

    console.log({ source, destination });

    if (!destination) return;

    const newTree = reorder(tree, source.index, destination.index);

    dispatch(setReorderedTree(newTree));
  };

  return (
    <DnDProvider
      list={extendedTree}
      droppableId="editable-menu"
      onDragEnd={handleOnDragEnd}>
      {({ isDragging, dragHandleProps, item }) => {
        return (
          <EditableBranch
            item={item}
            isDragging={isDragging}
            dragHandleProps={dragHandleProps}
          />
        );
      }}
    </DnDProvider>
  );
};

export default memo(EditableTree);
