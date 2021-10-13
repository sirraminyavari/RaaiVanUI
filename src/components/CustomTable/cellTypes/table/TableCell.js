import TableIcon from 'components/Icons/TableIcon/TableIcon';
import { CV_GRAY } from 'constant/CssVariables';
import { decodeBase64, toJSON } from 'helpers/helpers';
import * as Styled from './TableCell.styles';
import { modalTypes } from '../../tableUtils';
import TableCellModal from '../table/TableCellModal';

const TableCell = (props) => {
  const {
    isNew,
    row,
    editingRow,
    onCellChange,
    column,
    value,
    editable: isTableEditable,
    header,
  } = props;

  const { Info } = value || {};
  const tableInfo = toJSON(decodeBase64(Info));
  // console.log(tableInfo, props, 'table');

  const handleOnTableClick = () => {
    props?.setModal({
      show: true,
      title: decodeBase64(tableInfo?.FormName),
      type: modalTypes.table,
      content: (props) => (
        <TableCellModal
          tableId={tableInfo?.FormID}
          tableOwnerId={value?.ElementID || value?.RefElementID}
          {...props}
        />
      ),
    });
  };

  return (
    <Styled.TableCellContainer>
      <TableIcon onClick={handleOnTableClick} size={22} color={CV_GRAY} />
    </Styled.TableCellContainer>
  );
};

export default TableCell;
