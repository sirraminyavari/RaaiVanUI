import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { sidebarMenuSlice } from 'store/reducers/sidebarMenuReducer';
import * as Styled from '../Sidebar.styles';
import { reorder } from 'helpers';
import SidebarParentMenu from './SidebarParentMenu';
import DiamondIcon from 'components/Icons/DiamondIcon/Diamond';
import BookmarkIcon from 'components/Icons/BookmarkIcon/Bookmark';
import FilterIcon from 'components/Icons/FilterIcon/Filter';

const SidebarMenuContent = () => {
  const dispatch = useDispatch();
  const { setReorderedTree } = sidebarMenuSlice.actions;
  const { tree } = useSelector((state) => state.sidebarItems);

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const newTree = reorder(
      tree,
      result.source.index,
      result.destination.index
    );

    dispatch(setReorderedTree(newTree));
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
        <Droppable droppableId="sidebar-menu-container" type="parentMenu">
          {(provided, snapshot) => (
            <Styled.MenuTreeContainer
              {...provided.droppableProps}
              ref={provided.innerRef}
              isDraggingOver={snapshot.isDraggingOver}>
              {tree.map((item, index) => {
                return (
                  <Draggable
                    key={item.NodeTypeID}
                    draggableId={item.TypeName}
                    index={index}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                        style={{ ...provided.draggableProps.style }}>
                        <SidebarParentMenu
                          item={item}
                          isDragging={snapshot.isDragging}
                          dragProps={provided.dragHandleProps}
                        />
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </Styled.MenuTreeContainer>
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

export default SidebarMenuContent;
