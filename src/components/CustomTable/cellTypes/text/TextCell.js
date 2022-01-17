import { memo, useRef, useState } from 'react';
import Input from 'components/Inputs/Input';
import * as Styled from './TextCell.styles';
import { useCellProps } from 'components/CustomTable/tableUtils';
import useOnClickOutside from 'hooks/useOnClickOutside';

const TextCell = (props) => {
  const {
    value,
    onCellChange,
    rowId,
    columnId,
    canEdit,
    setSelectedCell,
    isSelectedCell,
    editByCell,
  } = useCellProps(props);

  const textRef = useRef();

  const handleClickOutside = () => {
    if (isSelectedCell) {
      updateCell();
      setSelectedCell(null);
    }
  };

  useOnClickOutside(textRef, handleClickOutside);

  const { TextValue } = value || {};

  const [textValue, setTextValue] = useState(TextValue);
  const originalValueRef = useRef(TextValue);

  //! Keep track of input change.
  const handleInputChange = (e) => {
    setTextValue(e.target.value);
  };

  //! We'll only update the external data when the input is blurred.
  const updateCell = () => {
    if (originalValueRef.current === textValue?.trim()) return;

    let textCell = { ...value, TextValue: textValue };

    onCellChange(rowId, columnId, textCell, textValue);
  };

  //! Only in row edition mode.
  const handleInputBlur = () => {
    !editByCell && updateCell();
  };

  //! Check if 'table' or 'cell' are editable; or is row in edit mode.
  if (!canEdit) {
    return (
      <Styled.CellViewContainer>
        {!!textValue ? (
          <Styled.CellView className="table-text-view" type="h6">
            {textValue}
          </Styled.CellView>
        ) : (
          <Styled.EmptyCellView></Styled.EmptyCellView>
        )}
      </Styled.CellViewContainer>
    );
  }

  return (
    <Styled.InputCellWrapper ref={textRef}>
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
