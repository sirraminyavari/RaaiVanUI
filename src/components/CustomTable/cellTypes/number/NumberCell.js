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
    cell,
  } = useCellProps(props);

  const numberRef = useRef();

  useOnClickOutside(numberRef, () => setSelectedCell(null));

  const { FloatValue } = value || {};

  const [numberValue, setNumberValue] = useState(FloatValue || '');
  const originalValueRef = useRef(FloatValue);

  //! Keep track of input change.
  const handleInputChange = (e) => {
    setNumberValue(e.target.valueAsNumber);
  };

  //! We'll only update the external data when the input is blurred.
  const handleInputBlur = () => {
    if (originalValueRef.current === numberValue) return;

    let numberCell = {
      ...value,
      FloatValue: numberValue,
      TextValue: numberValue + '',
    };

    onCellChange(rowId, columnId, numberCell, numberValue);
  };

  //! Check if 'table' or 'cell' are editable; or is row in edit mode.
  if (!canEdit) {
    return (
      <div onClick={() => setSelectedCell(cell)}>
        {!!numberValue ? (
          <Styled.CellView type="h4">{numberValue}</Styled.CellView>
        ) : (
          <Styled.EmptyCellView>انتخاب کنید</Styled.EmptyCellView>
        )}
      </div>
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
        value={numberValue}
        placeholder="وارد کنید"
      />
    </Styled.InputCellWrapper>
  );
};

export default memo(NumberCell);
