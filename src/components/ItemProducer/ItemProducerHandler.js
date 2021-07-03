/**
 * A component for producing items by inputting or with help of autosuggest component
 */
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';
import DragIcon from 'components/Icons/DragIcon';
import Input from 'components/Inputs/Input';
import React, { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import {
  AutoSuggest,
  Container,
  Maintainer,
  Parent,
  View,
} from './ItemProducerHandler.style';
/**
 *
 * @param {{value:String,id:String,...props}} autoSuggestItem - An item that passed here by the 'autosuggest' component .
 * @param {'text'|'autosuggest'} type - type of item producer
 * @param {Callback([{value:String,id:String,...props}])} onItems - returns array of produced items
 * @param {Boolean} isDragDisabled - If true, draggable will disable
 * @param {[{}]} savedData - An array of items that saved in past.
 * @param {number} resetMe - By changing the value, items will reset.
 */
const ItemProducerHandler = ({
  autoSuggestItem,
  type,
  onItems,
  isDragDisabled,
  savedData,
  resetMe,
}) => {
  // Defines the index of item should be removed (is usefull for disappearing animation ).
  const [removeIndex, setRemoveIndex] = useState(-1);
  // Defines the index of the new item(we detect to animate the correct item when it is being produced).
  const [newIndex, setNewIndex] = useState(-1);
  // array of produced items
  const [items, setItems] = useState(savedData?.length > 0 ? savedData : []);
  // if True, animation of resetting the list will be shown.
  const [resetDone, setResetDone] = useState(false);

  // when the component will mount, if passed 'type'='text' produces an empty item.
  useEffect(() => {
    if (type === 'text') {
      setItems([
        {
          id: '',
          value: '',
        },
      ]);
    }
  }, []);
  // Listens to 'resetMe' value. by it changes, makes 'resetDone' true for 500ms.
  useEffect(() => {
    if (resetMe !== 0) {
      setResetDone(true);
      setTimeout(() => {
        setResetDone(false);

        setItems([]);
      }, 500);
    }
  }, [resetMe]);
  //
  useEffect(() => {
    // Checks type of component and autoSuggestItem is not null
    if (type === 'autosuggest' && autoSuggestItem) {
      let tempItems = [...items];
      // Checks that new autoSuggestItem is duplicate or not.
      const checkDuplicate = tempItems.filter(
        (x) => x.id === autoSuggestItem.id
      );
      // If new autoSuggestItem was not in the 'items' will push it to items
      if (checkDuplicate.length === 0) {
        tempItems.push({
          value: autoSuggestItem.value,
          id: autoSuggestItem.id,
          ...autoSuggestItem,
        });
        setItems(tempItems);
        setNewIndex(tempItems.length - 1);
      }
    }
  }, [autoSuggestItem]);

  useEffect(() => {
    // Filters empty items
    const isAnyEmpty = items.filter((x) => x.id === '');
    // Checks if the type of component is 'text' and there is not an empty item, will push a new empty item.
    // in the 'text' mode, always an empty item should be available.
    if (isAnyEmpty.length === 0 && type === 'text') {
      let tempItems = [...items];
      tempItems.push({
        id: '',
        value: '',
      });

      setItems(tempItems);
      setNewIndex(tempItems.length - 1);
    }
    // after every change in items, returns items that are not empty to the parent.
    onItems(items.filter((x) => x.id !== ''));
  }, [items]);

  useEffect(() => {
    setTimeout(() => {
      setNewIndex(-1);
    }, 500);
  }, [newIndex]);
  /**
   * Updates value of items in 'text' mode.
   * @param {Input event} event - user input
   * @param {Number} index - index of the item that user is inputting
   */
  const onChange = (event, index) => {
    let tempItems = [...items];
    tempItems[index].id = event.target.value;
    tempItems[index].value = event.target.value;
    setItems(tempItems);
  };
  /**
   * Removes the selected item
   * @param {Number} index - index of item that should be removed.
   */
  const onRemove = (index) => {
    let tempItems = [...items];
    //Check if component is in 'text', avoids removing final empty item
    if (
      type === 'text' &&
      tempItems[index].id === '' &&
      tempItems.filter((x) => x.id === '').length === 1
    ) {
      return;
    } else {
      setRemoveIndex(index);
      // Waits until disappearing animation being complete.
      setTimeout(() => {
        setRemoveIndex(-1);
        tempItems.splice(index, 1);
        setItems(tempItems);
      }, 490);
    }
  };

  /**
   * Reorders the changes to the items applied by 'Draggable'.
   * @param {[{id:String,value:String,...props}]} list
   * @param {Number} startIndex - index of the item on the start of dragging
   * @param {Number} endIndex - index of the item on the end of dragging
   * @returns reorderd items
   */
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };
  /**
   * If the user is dragging, changes the style of the list
   */
  const getListStyle = (isDraggingOver) => ({
    background: isDraggingOver ? 'white' : 'white',
    padding: '7px 0px 0px 0px',
    width: '100%',
  });
  /**
   * will be called if the user finishes dragging any item.
   * @param {*} result - a param from  'DragDropContext' component
   */
  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const reOrdered = reorder(
      items,
      result.source.index,
      result.destination.index
    );
    setItems(reOrdered);
  };

  return (
    <View>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={'droppable'}>
          {(provided, snapshot) => (
            <Parent
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}>
              {items.map((x, index) => {
                return (
                  <Draggable
                    isDragDisabled={isDragDisabled}
                    draggableId={index.toString()}
                    index={index}
                    key={index.toString()}>
                    {(provided, snapshot) => (
                      <Maintainer
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        isDragging={snapshot.isDragging}
                        items={items}
                        // By checking the condition of the list that is increasing or decreasing,
                        // and checking the index of the item that is removed or added
                        // decides to passes 'addMe' or 'removeMe' class to the 'Maintaner'
                        className={
                          index === removeIndex
                            ? 'removeMe'
                            : index === newIndex
                            ? 'addMe'
                            : resetDone && 'resetMe'
                        }
                        ref={provided.innerRef}>
                        {isDragDisabled && <DragIcon color={'grey'} />}
                        <Container>
                          {type === 'text' ? (
                            <Input
                              onChange={(event) => onChange(event, index)}
                              value={x.value}
                              style={{ width: '100%' }}
                              placeholder={'گزینه جدید'}
                              children={
                                <CloseIcon
                                  onClick={() => {
                                    onRemove(index);
                                  }}
                                  size={'1rem'}
                                  color={'red'}
                                />
                              }
                            />
                          ) : (
                            <AutoSuggest>
                              <text>{x.value}</text>
                              <CloseIcon
                                onClick={() => {
                                  onRemove(index);
                                }}
                                size={'1rem'}
                                color={'red'}
                              />
                            </AutoSuggest>
                          )}
                        </Container>
                      </Maintainer>
                    )}
                  </Draggable>
                );
              })}

              {provided.placeholder}
            </Parent>
          )}
        </Droppable>
      </DragDropContext>
    </View>
  );
};
export default ItemProducerHandler;
