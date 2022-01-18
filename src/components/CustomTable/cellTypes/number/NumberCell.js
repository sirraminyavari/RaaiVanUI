import { memo, useState, useRef } from 'react';
import Input from 'components/Inputs/Input';
import NumberIcon from 'components/Icons/NymberIcon';
import * as Styled from './NumberCell.styles';
import { CV_DISTANT } from 'constant/CssVariables';
import { useCellProps } from 'components/CustomTable/tableUtils';
import useOnClickOutside from 'hooks/useOnClickOutside';

const NumberCell = (props) => {
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

  const numberRef = useRef();

  const handleClickOutside = () => {
    if (isSelectedCell) {
      updateCell();
      setSelectedCell(null);
    }
  };

  useOnClickOutside(numberRef, handleClickOutside);

  const { FloatValue } = value || {};

  const [numberValue, setNumberValue] = useState(FloatValue || null);
  const originalValueRef = useRef(FloatValue);

  //! Keep track of input change.
  const handleInputChange = (e) => {
    setNumberValue(e.target.valueAsNumber || null);
  };

  //! We'll only update the external data when the input is blurred.
  const updateCell = () => {
    if (originalValueRef.current === numberValue) return;

    let numberCell = {
      ...value,
      FloatValue: numberValue,
      TextValue: numberValue + '',
    };

    onCellChange(rowId, columnId, numberCell, numberValue);
  };

  //! Only in row edition mode.
  const handleInputBlur = () => {
    !editByCell && updateCell();
  };

  //! Check if 'table' or 'cell' are editable; or is row in edit mode.
  if (!canEdit) {
    return (
      <Styled.CellViewContainer>
        {!!numberValue ? (
          <Styled.CellView className="table-number-view" type="h6">
            {numberValue}
          </Styled.CellView>
        ) : (
          <Styled.EmptyCellView></Styled.EmptyCellView>
        )}
      </Styled.CellViewContainer>
    );
  }

  return (
    <Styled.InputCellWrapper ref={numberRef}>
      <NumberIcon size={25} color={CV_DISTANT} />
      <Input
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        className="table-number-input"
        type="number"
        value={numberValue === 0 ? null : numberValue}
        placeholder="وارد کنید"
      />
    </Styled.InputCellWrapper>
  );
};

export default memo(NumberCell);
