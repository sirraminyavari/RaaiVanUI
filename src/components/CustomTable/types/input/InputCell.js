import { memo, useEffect, useState } from 'react';
import Input from 'components/Inputs/Input';

const InputCell = (props) => {
  // console.log('inputCell', props);
  const {
    value: initialValue,
    row: { index },
    column: { id },
    updateCellData, //! This is a custom function that we supplied to our table instance.
    editable,
    selectedCell, //! This is what we select for inline edit in cell.
    setSelectedCell, //!
  } = props;

  const [value, setValue] = useState(initialValue);

  //! Keep track of input change.
  const handleInputChange = (value) => {
    setValue(value);
  };

  //! We'll only update the external data when the input is blurred.
  const handleInputBlur = () => {
    //! API call to server.
    updateCellData(index, id, value);
    setSelectedCell(null);
  };

  //! If the initialValue has changed externally, sync it up with our state.
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  //! Check if 'table' is editable in general or not.
  if (!editable) {
    return `${initialValue}`;
  }

  //! Check if 'column' is editable or not.
  if (!props?.header?.options?.editable) {
    return props?.value;
  }

  if (
    !!selectedCell &&
    index === selectedCell.row.index &&
    id === selectedCell.column.id
  ) {
    return (
      <Input
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        style={{
          textAlign: 'center',
          width: '100%',
          backgroundColor: 'inherit',
          color: 'inherit',
        }}
        type={props.header.dataType}
        value={props?.value}
        autoFocus
      />
    );
  } else {
    return `${initialValue}`;
  }
};

export default memo(InputCell);
