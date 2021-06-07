/**
 * A component that gathers 'AutoSuggestInput' & 'ItemProducerHandler'
 */
import AutoSuggestInput from 'components/Inputs/AutoSuggestInput/AutoSuggestInput';
import React, { useState } from 'react';
import styled from 'styled-components';
import ItemProducerHandler from './ItemProducerHandler';

/**
 *
 * @param {function} fetchItems - A callback function that will fire on input change and fetch suggestion from server.
 * @param {any} props - other props applied to 'Container'
 * @param {'text'|'autosuggest'} type - type of item producer
 * @param {Callback([{value:String,id:String,...props}])} onItems - returns array of produced items
 * @param {Boolean} isDragDisabled - If true, draggable will disable
 * @param {[{}]} savedData - An array of items that saved in past.
 * @param {number} resetMe - by changing the value, items will reset.

 */
const ItemProducer = ({
  type = 'text',
  onItems,
  fetchItems,
  isDragDisabled,
  savedData,
  resetMe,
  ...props
}) => {
  // selected item with 'AutoSuggestInput' will set here.
  const [selected, setSelected] = useState(false);
  return (
    <Container {...props}>
      {type === 'autosuggest' && (
        <AutoSuggestInput
          fetchItems={fetchItems}
          onItemSelect={(item) => setSelected(item)}
          style={{ width: '100%' }}
          // defaultItems={defaultValues}
        />
      )}
      <ItemProducerHandler
        autoSuggestItem={selected}
        type={type}
        isDragDisabled={isDragDisabled}
        onItems={onItems}
        savedData={savedData}
        resetMe={resetMe}
      />
    </Container>
  );
};
export default ItemProducer;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 50vw;
  padding: 0px 7px 7px 7px;
  background-color: #f4f4f4;
  border-radius: 0px 0px 7px 7px;
  border: 0px solid grey;
`;
