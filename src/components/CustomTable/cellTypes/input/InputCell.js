import { memo, useEffect, useState } from 'react';
import Input from 'components/Inputs/Input';
import * as Styled from './InputCell.styles';

const InputCell = (props) => {
  // console.log('inputCell', props);
  const {
    value: initialValue,
    row,
    column,
    onCellChange, //! This is a custom function that we supplied to our table instance.
    editable,
    editingRow,
    isNew,
    header,
  } = props;

  const rowId = row?.original?.id;
  const columnId = column?.id;

  const isCellEditable = !!header?.options?.editable;
  const isRowEditing = rowId === editingRow;

  const [inputValue, setInputValue] = useState(initialValue);

  const getInputType = () => {
    switch (header?.dataType) {
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
    //! Update parent.
    // onCellChange(rowId, columnId, inputValue, inputValue?.text);
  };

  //! If the initialValue has changed externally, sync it up with our state.
  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);

  if (!!isNew) {
    return (
      <Input
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={() => {}}
        style={{
          width: '100%',
          backgroundColor: 'inherit',
          color: 'inherit',
        }}
        type={getInputType()}
        value={inputValue?.text}
        autoFocus
        placeholder="وارد کنید"
      />
    );
  }

  //! Check if 'table' or 'cell' are editable.
  if (!editable || !isCellEditable) {
    return <Styled.CellView>{initialValue?.text}</Styled.CellView>;
  }

  if (isRowEditing) {
    return (
      <Input
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        style={{
          width: '100%',
          backgroundColor: 'inherit',
          color: 'inherit',
        }}
        type={getInputType()}
        value={inputValue?.text}
        autoFocus
        placeholder="وارد کنید"
      />
    );
  } else {
    return !!inputValue?.text ? (
      <Styled.CellView>{inputValue?.text}</Styled.CellView>
    ) : (
      <Styled.EmptyCellView>انتخاب کنید</Styled.EmptyCellView>
    );
  }
};

export default memo(InputCell);
