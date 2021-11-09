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
    cell,
  } = useCellProps(props);

  const textRef = useRef();

  useOnClickOutside(textRef, () => setSelectedCell(null));

  const { TextValue } = value || {};

  const [textValue, setTextValue] = useState(TextValue);
  const originalValueRef = useRef(TextValue);

  //! Keep track of input change.
  const handleInputChange = (e) => {
    setTextValue(e.target.value);
  };

  //! We'll only update the external data when the input is blurred.
  const handleInputBlur = () => {
    if (originalValueRef.current === textValue?.trim()) return;

    let textCell = { ...value, TextValue: textValue };

    onCellChange(rowId, columnId, textCell, textValue);
  };

  //! Check if 'table' or 'cell' are editable; or is row in edit mode.
  if (!canEdit) {
    return (
      <div onClick={() => setSelectedCell(cell)}>
        {!!textValue ? (
          <Styled.CellView type="h4">{textValue}</Styled.CellView>
        ) : (
          <Styled.EmptyCellView>انتخاب کنید</Styled.EmptyCellView>
        )}
      </div>
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
