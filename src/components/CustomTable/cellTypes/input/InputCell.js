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

  const [inputValue, setInputValue] = useState(initialValue);

  const getInputType = () => {
    switch (props?.header?.dataType) {
      case 'Numeric':
        return 'number';

      default:
        return 'text';
    }
  };

  //! Keep track of input change.
  const handleInputChange = (e) => {
    // console.log(e.target.value);
    setInputValue((oldValue) => ({ ...oldValue, text: e.target.value }));
  };

  //! We'll only update the external data when the input is blurred.
  const handleInputBlur = () => {
    //! API call to server.
    updateCellData(row?.index, id, inputValue);
    setSelectedCell(null);
  };

  //! If the initialValue has changed externally, sync it up with our state.
  useEffect(() => {
    setInputValue(initialValue);
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
        type={getInputType()}
        value=""
        autoFocus
        placeholder="وارد نمایید"
      />
    );
  }

  //! Check if 'table' is editable in general or not.
  if (!editable) {
    return `${initialValue?.text}`;
  }

  //! Check if 'column' is editable or not.
  if (!props?.header?.options?.editable) {
    return props?.value?.text;
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
        type={getInputType()}
        value={inputValue?.text}
        autoFocus
        placeholder="وارد نمایید"
      />
    );
  } else {
    return !!initialValue?.text ? (
      <Styled.CellView>{initialValue?.text}</Styled.CellView>
    ) : (
      <Styled.EmptyCellView>وارد نمایید</Styled.EmptyCellView>
    );
  }
};

export default memo(InputCell);
