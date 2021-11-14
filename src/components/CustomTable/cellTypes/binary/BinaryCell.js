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
  } = useCellProps(props);

  const toggleRef = useRef();

  const handleClickOutside = () => {
    if (isSelectedCell) {
      setSelectedCell(null);
      updateCell();
    }
  };

  useOnClickOutside(toggleRef, handleClickOutside);

  const { Info, TextValue, BitValue } = value || {};
  const binaryInfo = Info || {};
  const { Yes, No } = binaryInfo || {};

  const binaryOptions = { yes: decodeBase64(Yes), no: decodeBase64(No) };

  const [toggleValue, setToggleValue] = useState(
    isNewRow && !TextValue ? null : BitValue
  );

  const handleToggle = (toggleValue) => {
    setToggleValue(toggleValue);
  };

  const updateCell = () => {
    if (toggleValue === null) return;
    const textValue = toggleValue ? binaryOptions.yes : binaryOptions.no;

    let binaryCell = {
      ...value,
      BitValue: toggleValue,
      TextValue: textValue,
    };

    onCellChange(rowId, columnId, binaryCell, value);
  };

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

  return (
    <Styled.BinaryCellWrapper ref={toggleRef}>
      <ToggleButton onToggle={handleToggle} value={toggleValue}>
        <BinaryButton options={binaryOptions} className="table-binary-cell" />
      </ToggleButton>
    </Styled.BinaryCellWrapper>
  );
};

export default BinaryCell;
