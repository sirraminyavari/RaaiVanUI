import { memo, useState } from 'react';
import Input from 'components/Inputs/Input';
import * as Styled from './TextCell.styles';

const TextCell = (props) => {
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

  const { Info, TextValue } = value || {};

  const rowId = row?.original?.id;
  const columnId = column?.id;
  const headerId = header?.id;

  const isCellEditable = !!header?.options?.editable;
  const isRowEditing = rowId === editingRow;

  const canEdit = isTableEditable && isCellEditable && isRowEditing;

  const [textValue, setTextValue] = useState(TextValue);

  //! Keep track of input change.
  const handleInputChange = (e) => {
    setTextValue(e.target.value);
  };

  //! We'll only update the external data when the input is blurred.
  const handleInputBlur = () => {
    //! Update parent.
    let textCell;
    let id = isNew ? null : rowId;

    textCell = isNew
      ? {
          ElementID: headerId,
          TextValue: textValue,
          Type: header?.dataType,
        }
      : { ...value, TextValue: textValue };

    onCellChange(id, columnId, textCell, textValue);
  };

  //! Check if 'table' or 'cell' are editable; or is row in edit mode.
  if (!canEdit && !isNew) {
    return !!textValue ? (
      <Styled.CellView type="h4">{textValue}</Styled.CellView>
    ) : (
      <Styled.EmptyCellView>انتخاب کنید</Styled.EmptyCellView>
    );
  }

  return (
    <Styled.InputCellWrapper>
      <Input
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        className="table-number-input"
        type="text"
        value={textValue}
        placeholder="وارد کنید"
      />
    </Styled.InputCellWrapper>
  );
};

export default memo(TextCell);