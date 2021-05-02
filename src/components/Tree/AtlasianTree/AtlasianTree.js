import { createRef, useState, useEffect } from 'react';
import * as Styled from './AtlasianTree.styles';
import Tree, { mutateTree, moveItemOnTree } from '@atlaskit/tree';
import data from './data';
import CaretIcon from '../../Icons/CaretIcons/Caret';
import DragIcon from '../../Icons/DragIcon/Drag';
import TrashIcon from '../../Icons/TrashIcon/Trash';
import InlineEdit from '../../InlineEdit/InlineEdit';

const PADDING_PER_LEVEL = 16;

const getIcon = (item, onExpand, onCollapse) => {
  if (item.children && item.children.length > 0) {
    return item.isExpanded ? (
      <CaretIcon size={20} onClick={() => onCollapse(item.id)} dir="down" />
    ) : (
      <CaretIcon size={20} onClick={() => onExpand(item.id)} dir="left" />
    );
  }
  return null;
};

const DragAndDropTree = () => {
  const [tree, setTree] = useState(data);
  const treeRef = createRef();

  //! Swap padding for rtl support.
  useEffect(() => {
    const treeElements = treeRef.current.getElementsByTagName('div');
    Array.from(treeElements).forEach((el) => {
      let padding = el.style.paddingLeft;
      el.style.paddingRight = padding;
    });
  }, [treeRef]);

  const handleOnDelete = (item) => {
    alert(`${item.data.title} has been deleted`);

    const itemParent = Object.values(tree.items).find(
      (i) => i.id === item.parent
    );

    const treeDeletedOnItem = mutateTree(tree, item.id, { isDeleted: true });
    const treeRemovedOnParent = mutateTree(treeDeletedOnItem, item.parent, {
      children: itemParent.children.filter((child) => child !== item.id),
    });

    setTree(treeRemovedOnParent);
  };

  //! Render custom item.
  const handleRenderItem = ({
    item,
    onExpand,
    onCollapse,
    provided,
    depth,
    snapshot,
  }) => {
    const isDragging = snapshot.isDragging;
    const hasChildren = item.hasChildren;
    const isEditable = item.isEditable;
    return (
      <div ref={provided.innerRef} {...provided.draggableProps}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            margin: '0.7rem 0',
            backgroundColor: '#bbb',
            padding: '0.5rem 1rem',
            borderRadius: 5,
          }}>
          <div {...provided.dragHandleProps}>
            <DragIcon />
          </div>
          <div>
            <TrashIcon
              style={{ cursor: 'pointer' }}
              color="red"
              onClick={() => handleOnDelete(item)}
            />
          </div>

          {!isDragging && <span>{getIcon(item, onExpand, onCollapse)}</span>}
          <div>
            {isEditable ? (
              <InlineEdit
                text={item.data ? item.data.title : ''}
                onSetText={(text) => console.log(text)}
              />
            ) : (
              <span
                style={{
                  margin: hasChildren ? '0 0.3rem' : '0 0.7rem',
                }}>
                {item.data ? item.data.title : ''}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  const handleOnExpand = (itemId) => {
    setTree(mutateTree(tree, itemId, { isExpanded: true }));
  };

  const handleOnCollapse = (itemId) => {
    setTree(mutateTree(tree, itemId, { isExpanded: false }));
  };

  const handleOnDragEnd = (source, destination) => {
    if (!destination) {
      return;
    }
    console.log(source, destination);

    const newTree = moveItemOnTree(tree, source, destination);
    setTree(newTree);
  };

  //! Filter deleted items out.
  const filterTree = (tree) => {
    const itemsList = Object.values(tree.items).filter((item) => {
      return !item.isDeleted;
    });

    const newItems = itemsList.reduce((items, value) => {
      return Object.assign({}, items, { [value.id]: value });
    }, {});

    const filteredTree = { ...tree, items: newItems };

    return filteredTree;
  };

  return (
    <Styled.TreeContainer ref={treeRef}>
      <Tree
        tree={filterTree(tree)}
        renderItem={handleRenderItem}
        onExpand={handleOnExpand}
        onCollapse={handleOnCollapse}
        onDragEnd={handleOnDragEnd}
        offsetPerLevel={PADDING_PER_LEVEL}
        isDragEnabled
        isNestingEnabled
      />
    </Styled.TreeContainer>
  );
};

export default DragAndDropTree;
