import { memo, useState, useRef } from 'react';
import Input from 'components/Inputs/Input';
import NumberIcon from 'components/Icons/NymberIcon';
import * as Styled from './NumberCell.styles';
import { CV_DISTANT } from 'constant/CssVariables';

const NumberCell = (props) => {
  const {
    value,
    row,
    column,
    onCellChange,
    editable: isTableEditable,
    editingRowId,
    header,
    selectedCell,
    tempRowId,
  } = props;

  const { Info, FloatValue } = value || {};

  const rowId = row?.original?.id;
  const selectedRowId = selectedCell?.row?.original?.id;
  const selectedColumnId = selectedCell?.column?.id;
  const columnId = column?.id;
  const isCellEditable = !!header?.options?.editable;
  const isRowEditing = rowId === editingRowId;
  const isCellEditing =
    rowId === selectedRowId && columnId === selectedColumnId;
  const isNewRow = tempRowId === rowId;

  const canEdit =
    (isTableEditable && isCellEditable && (isRowEditing || isCellEditing)) ||
    isNewRow;

  const [numberValue, setNumberValue] = useState(FloatValue || '');
  const originalValueRef = useRef(FloatValue);

  //! Keep track of input change.
  const handleInputChange = (e) => {
    setNumberValue(e.target.valueAsNumber);
  };

  //! We'll only update the external data when the input is blurred.
  const handleInputBlur = () => {
    if (originalValueRef.current === numberValue) return;

    //! Update parent.
    let id = isNewRow ? tempRowId : rowId;

    let numberCell = {
      ...value,
      FloatValue: numberValue,
      TextValue: numberValue + '',
    };

    onCellChange(id, columnId, numberCell, numberValue);
  };

  //! Check if 'table' or 'cell' are editable; or is row in edit mode.
  if (!canEdit) {
    return !!numberValue ? (
      <Styled.CellView type="h4">{numberValue}</Styled.CellView>
    ) : (
      <Styled.EmptyCellView>انتخاب کنید</Styled.EmptyCellView>
    );
  }

  return (
    <Styled.InputCellWrapper>
      <NumberIcon size={25} color={CV_DISTANT} />
      <Input
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        className="table-number-input"
        type="number"
        value={numberValue}
        placeholder="وارد کنید"
      />
    </Styled.InputCellWrapper>
  );
};

export default memo(NumberCell);
