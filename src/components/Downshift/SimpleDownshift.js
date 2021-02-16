import { useState } from 'react';
import Downshift from 'downshift';

const SimpleDownshift = (props) => {
  const [items, setItems] = useState([]);

  const fetchItems = (inputValue) => {
    fetch(`http://localhost:3004/names?name_like=${inputValue}`)
      .then((response) => response.json())
      .then((data) => {
        setItems(data.map((item) => ({ value: item.name })));
      });
  };
  return (
    <Downshift
      stateReducer={(state, changes) => {
        if (!state.isOpen && state.selectedItem) {
          state.selectedItem.value = '';
        }
        return changes;
      }}
      onInputValueChange={fetchItems}
      onChange={(selection) =>
        props.onChange
          ? props.onChange(selection.value)
          : alert(`You selected ${selection.value}`)
      }
      itemToString={(item) => (item ? item.value : '')}>
      {({
        getInputProps,
        getItemProps,
        getLabelProps,
        getMenuProps,
        isOpen,
        inputValue,
        highlightedIndex,
        selectedItem,
      }) => (
        <div>
          <label {...getLabelProps()}>Enter a name</label>
          <input {...getInputProps()} />
          <ul {...getMenuProps()}>
            {isOpen && inputValue
              ? items.map((item, index) => (
                  <li
                    {...getItemProps({
                      key: item.value,
                      index,
                      item,
                      style: {
                        backgroundColor:
                          highlightedIndex === index ? 'lightgray' : 'white',
                        fontWeight: selectedItem === item ? 'bold' : 'normal',
                      },
                    })}>
                    {item.value}
                  </li>
                ))
              : null}
          </ul>
        </div>
      )}
    </Downshift>
  );
};

export default SimpleDownshift;
