import ToggleButton from 'components/Buttons/Toggle/Toggle';
import BinaryButton from 'components/Buttons/binary/BinaryButton';
import * as Styled from './BinaryCell.styles';
import { decodeBase64 } from 'helpers/helpers';
import { useCellProps } from '../../tableUtils';

const BinaryCell = (props) => {
  // console.log('Binary cell ', props);
  const {
    value,
    onCellChange,
    data,
    rowId,
    columnId,
    isNewRow,
    canEdit,
    tempRowId,
  } = useCellProps(props);

  //! Get info for new row.
  const columnInfo = data?.[0]?.[columnId]?.Info;

  //! Get info for existing row.
  const { Info, TextValue, BitValue } = value || {};
  const binaryInfo = Info || columnInfo;
  const { Yes, No } = binaryInfo || {};

  const binaryOptions = { yes: decodeBase64(Yes), no: decodeBase64(No) };

  const handleToggle = (toggleValue) => {
    const textValue = toggleValue ? binaryOptions.yes : binaryOptions.no;

    let id = isNewRow ? tempRowId : rowId;

    let binaryCell = {
      ...value,
      BitValue: toggleValue,
      TextValue: textValue,
      Filled: true,
    };

    onCellChange(id, columnId, binaryCell, {
      toggleValue,
      textValue,
    });
  };

  if (!canEdit) {
    return (
      <>
        {TextValue ? (
          <Styled.CellView type="h4">{TextValue}</Styled.CellView>
        ) : (
          <Styled.EmptyCellView>انتخاب کنید</Styled.EmptyCellView>
        )}
      </>
    );
  }

  return (
    <Styled.BinaryCellWrapper>
      <ToggleButton
        onToggle={handleToggle}
        initialCheck={isNewRow && !TextValue ? null : BitValue}>
        <BinaryButton options={binaryOptions} className="table-binary-cell" />
      </ToggleButton>
    </Styled.BinaryCellWrapper>
  );
};

export default BinaryCell;
