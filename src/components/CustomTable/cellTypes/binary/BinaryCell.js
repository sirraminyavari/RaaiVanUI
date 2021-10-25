import ToggleButton from 'components/Buttons/Toggle/Toggle';
import BinaryButton from 'components/Buttons/binary/BinaryButton';
import * as Styled from './BinaryCell.styles';
import { decodeBase64 } from 'helpers/helpers';

const BinaryCell = (props) => {
  // console.log('Binary cell ', props);
  const {
    value,
    row,
    column,
    onCellChange,
    editable: isTableEditable,
    editingRow,
    isNew,
    header,
    data,
  } = props;

  const rowId = row?.original?.id;
  const columnId = column?.id;
  const headerId = header?.id;

  const isCellEditable = !!header?.options?.editable;
  const isRowEditing = rowId === editingRow;

  //! Get info for new row.
  const columnInfo = data?.[0]?.[columnId]?.Info;

  //! Get info for existing row.
  const { Info, TextValue, BitValue } = value || {};
  const binaryInfo = Info || columnInfo;
  const { Yes, No } = binaryInfo || {};

  const binaryOptions = { yes: decodeBase64(Yes), no: decodeBase64(No) };

  const handleToggle = (toggleValue) => {
    const textValue = toggleValue ? binaryOptions.yes : binaryOptions.no;

    let id = isNew ? null : rowId;
    let binaryCell = isNew
      ? {
          ElementID: headerId,
          BitValue: toggleValue,
          TextValue: textValue,
          Type: header?.dataType,
        }
      : {
          ...value,
          BitValue: toggleValue,
          TextValue: textValue,
        };

    onCellChange(id, columnId, binaryCell, {
      toggleValue,
      textValue,
    });
  };

  if ((!isTableEditable || !isCellEditable || !isRowEditing) && !isNew) {
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
        initialCheck={!!isNew ? null : BitValue}>
        <BinaryButton options={binaryOptions} className="table-binary-cell" />
      </ToggleButton>
    </Styled.BinaryCellWrapper>
  );
};

export default BinaryCell;
