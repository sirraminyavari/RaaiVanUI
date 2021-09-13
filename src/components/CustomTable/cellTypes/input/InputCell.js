import { memo, useEffect, useState } from 'react';
import Input from 'components/Inputs/Input';
import * as Styled from './InputCell.styles';

const InputCell = (props) => {
  // console.log('inputCell', props);
  const {
    value: initialValue,
    row,
    column: { id },
    updateCellData, //! This is a custom function that we supplied to our table instance.
    editable,
    selectedCell, //! This is what we select for inline edit in cell.
    setSelectedCell,
    isNew,
  } = props;

  const [value, setValue] = useState(initialValue);

  //! Keep track of input change.
  const handleInputChange = (e) => {
    console.log(e.target.value);
    setValue(e.target.value);
  };

  //! We'll only update the external data when the input is blurred.
  const handleInputBlur = () => {
    //! API call to server.
    updateCellData(row?.index, id, value);
    setSelectedCell(null);
  };

  //! If the initialValue has changed externally, sync it up with our state.
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  if (!!isNew) {
    return (
      <Input
        onChange={() => {}}
        onBlur={() => {}}
        style={{
          textAlign: 'center',
          width: '100%',
          backgroundColor: 'inherit',
          color: 'inherit',
        }}
        type={props.header.dataType}
        value=""
        autoFocus
        placeholder="وارد نمایید"
      />
    );
  }

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
    row?.index === selectedCell.row.index &&
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
        value={value}
        autoFocus
        placeholder="وارد نمایید"
      />
    );
  } else {
    return !!initialValue ? (
      <span style={{ cursor: 'pointer' }}>{initialValue}</span>
    ) : (
      <Styled.EmptyCellShow>وارد نمایید</Styled.EmptyCellShow>
    );
  }
};

export default memo(InputCell);
