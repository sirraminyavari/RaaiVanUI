import { memo, useEffect, useState } from 'react';
import Input from 'components/Inputs/Input';
import NumberIcon from 'components/Icons/NymberIcon';
import * as Styled from './InputCell.styles';
import { CV_DISTANT } from 'constant/CssVariables';

const InputCell = (props) => {
  // console.log('inputCell', props);
  const {
    value: initialValue,
    row,
    column,
    onCellChange,
    editable: isTableEditable,
    editingRow,
    isNew,
    header,
  } = props;

  const rowId = row?.original?.id;
  const columnId = column?.id;

  const isCellEditable = !!header?.options?.editable;
  const isRowEditing = rowId === editingRow;

  const [inputValue, setInputValue] = useState(initialValue);

  const isNumberType = header?.dataType === 'Numeric';

  //! Keep track of input change.
  const handleInputChange = (e) => {
    // console.log(e.target.value);
    setInputValue((oldValue) => ({ ...oldValue, text: e.target.value }));
  };

  //! We'll only update the external data when the input is blurred.
  const handleInputBlur = () => {
    //! Update parent.
    onCellChange(rowId, columnId, inputValue, inputValue.text);
  };

  //! If the initialValue has changed externally, sync it up with our state.
  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);

  if (!!isNew) {
    return (
      <Styled.InputCellWrapper>
        {isNumberType && <NumberIcon size={25} color={CV_DISTANT} />}
        <Input
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={() => {}}
          className="table-number-input"
          type={`${isNumberType ? 'number' : 'text'}`}
          value={inputValue?.text}
          placeholder="وارد کنید"
        />
      </Styled.InputCellWrapper>
    );
  }

  //! Check if 'table' or 'cell' are editable; or is row in edit mode.
  if (!isTableEditable || !isCellEditable || !isRowEditing) {
    return !!inputValue?.text ? (
      <Styled.CellView>{inputValue?.text}</Styled.CellView>
    ) : (
      <Styled.EmptyCellView>انتخاب کنید</Styled.EmptyCellView>
    );
  }

  return (
    <Styled.InputCellWrapper>
      {isNumberType && <NumberIcon size={25} color={CV_DISTANT} />}
      <Input
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        className="table-number-input"
        type={`${isNumberType ? 'number' : 'text'}`}
        value={inputValue?.text}
        placeholder="وارد کنید"
      />
    </Styled.InputCellWrapper>
  );
};

export default memo(InputCell);
