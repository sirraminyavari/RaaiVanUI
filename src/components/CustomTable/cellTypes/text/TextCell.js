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
  } = useCellProps(props);

  const textRef = useRef();

  const handleClickOutside = () => {
    if (isSelectedCell) {
      handleInputBlur();
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
  const handleInputBlur = () => {
    if (originalValueRef.current === textValue?.trim()) return;

    let textCell = { ...value, TextValue: textValue };

    onCellChange(rowId, columnId, textCell, textValue);
  };

  //! Check if 'table' or 'cell' are editable; or is row in edit mode.
  if (!canEdit) {
    return (
      <div>
        {!!textValue ? (
          <Styled.CellView type="h4">{textValue}</Styled.CellView>
        ) : (
          <Styled.EmptyCellView></Styled.EmptyCellView>
        )}
      </div>
    );
  }

  return (
    <Styled.InputCellWrapper ref={textRef}>
      <Input
        onChange={handleInputChange}
        // onBlur={() => console.log('blur')} //! Not working due to  input ref clear before it catches the blur event.
        className="table-number-input"
        type="text"
        value={textValue}
        placeholder="وارد کنید"
      />
    </Styled.InputCellWrapper>
  );
};

export default memo(TextCell);
