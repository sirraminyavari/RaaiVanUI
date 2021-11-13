import TableIcon from 'components/Icons/TableIcon/TableIcon';
import { CV_GRAY } from 'constant/CssVariables';
import { decodeBase64 } from 'helpers/helpers';
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
  // console.log(value, props, 'table cell');

  const handleOnTableClick = () => {
    props?.setModal({
      show: true,
      title: decodeBase64(Info?.FormName),
      type: modalTypes.table,
      content: () => <TableCellModal {...props} />,
    });
  };

  return (
    <Styled.TableCellContainer>
      <TableIcon onClick={handleOnTableClick} size={22} color={CV_GRAY} />
    </Styled.TableCellContainer>
  );
};

export default TableCell;
