import { memo, useEffect, useState } from 'react';
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
    editingRow,
    isNew,
    header,
  } = props;

  const { Info, FloatValue } = value || {};

  const rowId = row?.original?.id;
  const columnId = column?.id;
  const headerId = header?.id;

  const isCellEditable = !!header?.options?.editable;
  const isRowEditing = rowId === editingRow;

  const canEdit = isTableEditable && isCellEditable && isRowEditing;

  const [numberValue, setNumberValue] = useState(0);

  //! Keep track of input change.
  const handleInputChange = (e) => {
    setNumberValue(e.target.valueAsNumber);
  };

  useEffect(() => {
    setNumberValue(FloatValue);
  }, []);

  //! We'll only update the external data when the input is blurred.
  const handleInputBlur = () => {
    //! Update parent.
    let numberCell;
    let id = isNew ? null : rowId;

    numberCell = isNew
      ? {
          ElementID: headerId,
          FloatValue: numberValue,
          TextValue: numberValue + '',
          Type: header?.dataType,
        }
      : { ...value, FloatValue: numberValue, TextValue: numberValue + '' };

    onCellChange(id, columnId, numberCell, numberValue);
  };

  //! Check if 'table' or 'cell' are editable; or is row in edit mode.
  if (!canEdit && !isNew) {
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
