import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { sidebarMenuSlice } from 'store/reducers/sidebarMenuReducer';
import * as Styled from './Sidebar.styles';
import SidebarMenu from './SidebarMenu';
import DiamondIcon from 'components/Icons/DiamondIcon/Diamond';
import BookmarkIcon from 'components/Icons/BookmarkIcon/Bookmark';
import FilterIcon from 'components/Icons/FilterIcon/Filter';

const MenuContent = () => {
  const dispatch = useDispatch();
  const { reorderTree } = sidebarMenuSlice.actions;
  const { tree } = useSelector((state) => state.sidebarItems);

  const handleOnDragEnd = (value) => {
    if (!value.destination) return;
    const items = Array.from(tree);
    const [reorderedItem] = items.splice(value.source.index, 1);
    items.splice(value.destination.index, 0, reorderedItem);

    dispatch(reorderTree(items));
  };

  return (
    <>
      <Styled.SearchWrapper>
        <Styled.SearchInput
          type="search"
          placeholder="جستجو در دسته و کلاس ها"
        />
        <FilterIcon />
      </Styled.SearchWrapper>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="sidebar-menu-container">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {tree.map((item, index) => {
                return (
                  <Draggable
                    key={item.NodeTypeID}
                    draggableId={item.TypeName}
                    index={index}>
                    {(provided) => (
                      <div
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}>
                        <SidebarMenu item={item} />
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <hr />
      <div style={{ paddingBottom: '50px' }}>
        <Styled.BookmarkWrapper>
          <Styled.CenterIcon>
            <BookmarkIcon />
            <span style={{ marginRight: '10px' }}>موضوعات نشان شده</span>
          </Styled.CenterIcon>
          <Styled.BadgeWrapper>55</Styled.BadgeWrapper>
        </Styled.BookmarkWrapper>
        <Styled.CenterIcon>
          <DiamondIcon />
          <span style={{ marginRight: '10px' }}>گالری تمپلیت ها</span>
        </Styled.CenterIcon>
      </div>
    </>
  );
};

export default MenuContent;
