import * as Styled from '../TemplateFormSettingsStyles';
import FormElementList from './FromElementList';
import FormBuilder from './FormBuilder';
import { DragDropContext } from 'react-beautiful-dnd';
import { useTemplateFormContext } from '../TemplateFormContext';
import { useState } from 'react';
import { FORM_BUILDER_ID } from '../TemplateFormContext';
import { flatFormElements } from './FormElements';

const DndHandler = () => {
  const { copyItem, moveItem } = useTemplateFormContext();
  const [placeholderProps, setPlaceholderProps] = useState(null);

  const handleDrag = (e) => {
    setPlaceholderProps(null);

    const { destination, source } = e;

    if (destination?.droppableId !== FORM_BUILDER_ID || !destination) return;

    if (destination?.droppableId !== source?.droppableId) {
      // copy item
      copyItem(e);
    }

    if (destination?.droppableId === source?.droppableId) {
      moveItem(e);
    }
  };

  const handleDragStart = (e) => {
    const { destination, source } = e;

    if (destination?.droppableId !== source?.droppableId) {
      //copy
    }

    if (destination?.droppableId === source?.droppableId) {
      // move
      const { draggableId, destination } = e;
      const domQuery = `[data-rbd-draggable-id='${draggableId}']`;
      const draggedDOM = document.querySelector(domQuery);

      if (!draggedDOM) {
        return;
      }

      const { clientHeight, clientWidth } = draggedDOM;
      const sourceIndex = e.source.index;
      var clientY =
        parseFloat(window.getComputedStyle(draggedDOM.parentNode).paddingTop) +
        [...draggedDOM.parentNode.children]
          .slice(0, sourceIndex)
          .reduce((total, curr) => {
            const style = curr.currentStyle || window.getComputedStyle(curr);
            const marginBottom = parseFloat(style.marginBottom);
            return total + curr.clientHeight + marginBottom;
          }, 0);

      setPlaceholderProps({
        clientHeight,
        clientWidth,
        clientY,
        clientX: parseFloat(
          window.getComputedStyle(draggedDOM.parentNode).paddingLeft
        ),
      });
    }
  };

  const handleDragUpdate = (e) => {
    const { destination, source, draggableId } = e;

    const splitId = draggableId?.split('-');
    const type = splitId[splitId?.length - 1];
    const items = flatFormElements();

    if (!destination) return;
    if (destination?.droppableId !== source?.droppableId) {
      const parentDomQuery = `[data-rbd-droppable-id='${FORM_BUILDER_ID}']`;
      const parentDom = document.querySelector(parentDomQuery);

      const destinationIndex = e.destination.index;

      const childrenArray = [...parentDom.children];

      const { clientWidth, ...firstChild } = childrenArray[0];

      let clientY =
        8 +
        childrenArray.slice(0, destinationIndex).reduce((total, curr) => {
          const style = curr.currentStyle || window.getComputedStyle(curr);
          const marginBottom = parseFloat(style.marginBottom);
          return total + curr.clientHeight + marginBottom;
        }, 0);

      setPlaceholderProps({
        clientHeight: 56,
        clientWidth,
        clientY,
        clientX: parseFloat(firstChild.paddingLeft),
        icon: items.find((x) => x?.type === type)?.icon,
      });
    }

    if (destination?.droppableId === source?.droppableId) {
      const { draggableId, destination } = e;
      const domQuery = `[data-rbd-draggable-id='${draggableId}']`;
      const draggedDOM = document.querySelector(domQuery);

      if (!draggedDOM) return;

      const { clientHeight, clientWidth } = draggedDOM;
      const destinationIndex = e.destination.index;
      const sourceIndex = e.source.index;

      const parentDomQuery = `[data-rbd-droppable-id='${FORM_BUILDER_ID}']`;
      const parentDom = document.querySelector(parentDomQuery);

      const childrenArray = [...parentDom.children];
      const movedItem = childrenArray[sourceIndex];
      childrenArray.splice(sourceIndex, 1);

      const updatedArray = [
        ...childrenArray.slice(0, destinationIndex),
        movedItem,
        ...childrenArray.slice(destinationIndex + 1),
      ];

      let clientY =
        parseFloat(window.getComputedStyle(draggedDOM.parentNode).paddingTop) +
        updatedArray.slice(0, destinationIndex).reduce((total, curr) => {
          const style = curr.currentStyle || window.getComputedStyle(curr);
          const marginBottom = parseFloat(style.marginBottom);
          return total + curr.clientHeight + marginBottom;
        }, 0);

      setPlaceholderProps({
        clientHeight,
        clientWidth,
        clientY,
        clientX: parseFloat(
          window.getComputedStyle(childrenArray[0]).paddingLeft
        ),
      });
    }
  };

  return (
    <DragDropContext
      onDragEnd={handleDrag}
      onDragStart={handleDragStart}
      onDragUpdate={handleDragUpdate}
    >
      <Styled.FormElementListPanel>
        <FormElementList />
      </Styled.FormElementListPanel>
      <Styled.FormPanel>
        <FormBuilder placeholderProps={placeholderProps} />
      </Styled.FormPanel>
    </DragDropContext>
  );
};
export default DndHandler;
