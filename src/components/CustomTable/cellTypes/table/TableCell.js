import TableIcon from 'components/Icons/TableIcon/TableIcon';
import { CV_GRAY } from 'constant/CssVariables';
import { decodeBase64 } from 'helpers/helpers';
import * as Styled from './TableCell.styles';
import { modalTypes } from '../../tableUtils';
import TableCellModal from '../table/TableCellModal';
import { useCellProps } from 'components/CustomTable/tableUtils';
import AddNewTableButton from 'components/CustomTable/AddNewButton';
import useWindow from 'hooks/useWindowContext';

const TableCell = (props) => {
  const {
    value,
    onCellChange,
    rowId,
    columnId,
    // canEdit,
    // setSelectedCell,
    // isSelectedCell,
    isNewRow,
  } = useCellProps(props);
  const { RVDic } = useWindow();

  const { Info } = value || {};
  // console.log(value, 'table cell');

  const handleOnTableClick = () => {
    props?.setModal({
      show: true,
      title: decodeBase64(Info?.FormName),
      type: modalTypes.table,
      content: () => <TableCellModal {...props} />,
    });
  };

  const handleAddNewTable = () => {
    let dummyText = '(~_~)';
    let textCell = { ...value, TextValue: dummyText };

    onCellChange(rowId, columnId, textCell, dummyText);
  };

  if (isNewRow) {
    return (
      <AddNewTableButton
        onClick={handleAddNewTable}
        title={RVDic.AddN.replace('[n]', RVDic.Table)}
        icon={<TableIcon size={18} />}
      />
    );
  }

  return (
    <Styled.TableCellContainer>
      <TableIcon onClick={handleOnTableClick} size={22} color={CV_GRAY} />
    </Styled.TableCellContainer>
  );
};

export default TableCell;
