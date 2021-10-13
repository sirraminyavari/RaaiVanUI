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
  } = props;

  const rowId = row?.original?.id;
  const columnId = column?.id;

  const isCellEditable = !!header?.options?.editable;
  const isRowEditing = rowId === editingRow;

  const { Info, TextValue, BitValue } = value || {};
  const binaryInfo = toJSON(decodeBase64(Info));
  const binaryValue = decodeBase64(TextValue);
  const { Yes, No } = binaryInfo || {};

  const binaryOptions = [decodeBase64(Yes), decodeBase64(No)];

  const handleToggle = (toggleValue) => {
    // console.log(toggleValue);
    if (!isNew) {
      const textValue = toggleValue ? binaryOptions[0] : binaryOptions[1];
      const binaryCell = {
        ...value,
        BitValue: toggleValue,
      };
      //   onCellChange(rowId, columnId, binaryCell, {
      //     value: toggleValue,
      //     label: textValue,
      //   });
    }
  };

  if (isNew) {
    return <div>New row</div>;
  }

  if (!isTableEditable || !isCellEditable || !isRowEditing) {
    return (
      <Heading style={{ color: CV_GRAY_DARK }} type="h5">
        {binaryValue}
      </Heading>
    );
  }

  return (
    <Styled.BinaryCellWrapper>
      <ToggleButton onToggle={handleToggle} initialCheck={BitValue}>
        <BinaryButton
          isChecked={BitValue}
          options={binaryOptions}
          className="table-binary-cell"
        />
      </ToggleButton>
    </Styled.BinaryCellWrapper>
  );
};

export default BinaryCell;
