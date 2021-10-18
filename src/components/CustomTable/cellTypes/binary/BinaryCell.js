import ToggleButton from 'components/Buttons/Toggle/Toggle';
import BinaryButton from 'components/Buttons/binary/BinaryButton';
import * as Styled from './BinaryCell.styles';
import { decodeBase64, toJSON } from 'helpers/helpers';
import Heading from 'components/Heading/Heading';
import { CV_GRAY_DARK } from 'constant/CssVariables';

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

  const isCellEditable = !!header?.options?.editable;
  const isRowEditing = rowId === editingRow;

  //! Get info for new row.
  const columnInfo = data?.[0]?.[columnId]?.Info;

  //! Get info for existing row.
  const { Info, TextValue, BitValue } = value || {};
  const binaryInfo = Info || columnInfo;
  const { Yes, No } = binaryInfo || {};

  const binaryOptions = [decodeBase64(Yes), decodeBase64(No)];

  const handleToggle = (toggleValue) => {
    // console.log(toggleValue);
    const textValue = toggleValue ? binaryOptions[0] : binaryOptions[1];
    const binaryCell = {
      ...value,
      BitValue: toggleValue,
    };
    onCellChange(rowId, columnId, binaryCell, {
      value: toggleValue,
      label: textValue,
    });
  };

  if ((!isTableEditable || !isCellEditable || !isRowEditing) && !isNew) {
    return (
      <Heading style={{ color: CV_GRAY_DARK }} type="h5">
        {TextValue}
      </Heading>
    );
  }

  return (
    <Styled.BinaryCellWrapper>
      <ToggleButton
        onToggle={handleToggle}
        initialCheck={isNew ? false : BitValue}>
        <BinaryButton
          isChecked={isNew ? false : BitValue}
          options={binaryOptions}
          className="table-binary-cell"
        />
      </ToggleButton>
    </Styled.BinaryCellWrapper>
  );
};

export default BinaryCell;
