import { useRef, useState } from 'react';
import ToggleButton from 'components/Buttons/Toggle/Toggle';
import BinaryButton from 'components/Buttons/binary/BinaryButton';
import * as Styled from './BinaryCell.styles';
import { decodeBase64 } from 'helpers/helpers';
import { useCellProps } from 'components/CustomTable/tableUtils';
import useOnClickOutside from 'hooks/useOnClickOutside';

const BinaryCell = (props) => {
  const {
    value,
    onCellChange,
    rowId,
    columnId,
    isNewRow,
    canEdit,
    setSelectedCell,
    isSelectedCell,
    editByCell,
  } = useCellProps(props);

  const toggleRef = useRef();

  const { Info, TextValue, BitValue } = value || {};
  const { Yes, No } = Info || {};

  const binaryOptions = { yes: decodeBase64(Yes), no: decodeBase64(No) };

  const [toggleValue, setToggleValue] = useState(
    isNewRow && !TextValue ? null : BitValue
  );

  //! Handle click outside event.
  const handleClickOutside = () => {
    if (isSelectedCell) {
      setSelectedCell(null);
      updateCell(toggleValue);
    }
  };

  //! A hook that fires a callback when the user clicks outside of the current cell.
  useOnClickOutside(toggleRef, handleClickOutside);

  const handleToggle = (toggleValue) => {
    setToggleValue(toggleValue);
    !editByCell && updateCell(toggleValue);
  };

  //! Update cell value.
  const updateCell = (toggle) => {
    if (toggle === null) return; //! If toggle value is null, do nothing and return early.
    const textValue = toggle ? binaryOptions.yes : binaryOptions.no;

    let binaryCell = {
      ...value,
      BitValue: toggle,
      TextValue: textValue,
    };

    onCellChange(rowId, columnId, binaryCell, value);
  };

  //! UI for none editing cell.
  if (!canEdit) {
    return (
      <Styled.CellViewContainer>
        {TextValue ? (
          <Styled.CellView type="h4">{TextValue}</Styled.CellView>
        ) : (
          <Styled.EmptyCellView></Styled.EmptyCellView>
        )}
      </Styled.CellViewContainer>
    );
  }

  //! UI for editing cell.
  return (
    <Styled.BinaryCellWrapper ref={toggleRef}>
      <ToggleButton onToggle={handleToggle} value={toggleValue}>
        <BinaryButton options={binaryOptions} className="table-binary-cell" />
      </ToggleButton>
    </Styled.BinaryCellWrapper>
  );
};

export default BinaryCell;
