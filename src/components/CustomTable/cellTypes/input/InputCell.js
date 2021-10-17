import { memo, useEffect, useState } from 'react';
import Input from 'components/Inputs/Input';
import NumberIcon from 'components/Icons/NymberIcon';
import * as Styled from './InputCell.styles';
import { CV_DISTANT } from 'constant/CssVariables';
import { decodeBase64, toJSON } from 'helpers/helpers';

const InputCell = (props) => {
  // console.log('inputCell', props);
  const {
    value,
    row,
    column,
    onCellChange,
    editable: isTableEditable,
    editingRow,
    isNew,
    header,
    isNumber,
  } = props;

  const { Info, TextValue, FloatValue } = value || {};
  const inputInfo = toJSON(decodeBase64(Info));

  const rowId = row?.original?.id;
  const columnId = column?.id;

  const isCellEditable = !!header?.options?.editable;
  const isRowEditing = rowId === editingRow;

  const [inputValue, setInputValue] = useState('');

  //! Keep track of input change.
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  //! We'll only update the external data when the input is blurred.
  const handleInputBlur = () => {
    //! Update parent.
    let inputCell;
    if (!!isNumber) {
      inputCell = { ...value, FloatValue: inputValue };
    } else {
      inputCell = { ...value, TextValue: inputValue };
    }

    onCellChange(rowId, columnId, inputCell, inputValue);
  };

  // //! If the initialValue has changed externally, sync it up with our state.
  useEffect(() => {
    const value = !!isNumber ? FloatValue : decodeBase64(TextValue);
    setInputValue(value);
  }, [TextValue, FloatValue, isNumber]);

  //! Check if 'table' or 'cell' are editable; or is row in edit mode.
  if ((!isTableEditable || !isCellEditable || !isRowEditing) && !isNew) {
    return !!inputValue ? (
      <Styled.CellView>{inputValue}</Styled.CellView>
    ) : (
      <Styled.EmptyCellView>انتخاب کنید</Styled.EmptyCellView>
    );
  }

  return (
    <Styled.InputCellWrapper>
      {!!isNumber && <NumberIcon size={25} color={CV_DISTANT} />}
      <Input
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        className="table-number-input"
        type={!!isNumber ? 'number' : 'text'}
        value={inputValue}
        placeholder="وارد کنید"
      />
    </Styled.InputCellWrapper>
  );
};

export default memo(InputCell);
