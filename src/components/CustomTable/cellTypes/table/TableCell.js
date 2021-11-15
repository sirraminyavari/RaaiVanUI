import TableIcon from 'components/Icons/TableIcon/TableIcon';
import { CV_GRAY } from 'constant/CssVariables';
import { decodeBase64 } from 'helpers/helpers';
import * as Styled from './TableCell.styles';
import { modalTypes } from '../../tableUtils';
import TableCellModal from '../table/TableCellModal';
import { useCellProps } from 'components/CustomTable/tableUtils';
import AddNewTableButton from 'components/CustomTable/AddNewButton';
import useWindow from 'hooks/useWindowContext';
import useOnClickOutside from 'hooks/useOnClickOutside';
import { useRef } from 'react';

const TableCell = (props) => {
  const {
    value,
    onCellChange,
    rowId,
    columnId,
    canEdit,
    setSelectedCell,
    isSelectedCell,
    isNewRow,
    setModal,
  } = useCellProps(props);

  const { Info } = value || {};

  const { RVDic } = useWindow();
  const tableRef = useRef();

  const tableOwnerId = value?.RefElementID ? value?.ElementID : null;

  const handleClickOutside = () => {
    if (isSelectedCell) {
      setSelectedCell(null);
    }
  };

  useOnClickOutside(tableRef, handleClickOutside);

  const handleOnTableClick = () => {
    setModal({
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

  if (!canEdit) {
    return (
      <Styled.TableCellContainer>
        {tableOwnerId && (
          <TableIcon onClick={handleOnTableClick} size={22} color={CV_GRAY} />
        )}
      </Styled.TableCellContainer>
    );
  }

  return (
    <>
      {isNewRow || !tableOwnerId ? (
        <AddNewTableButton
          ref={tableRef}
          onClick={handleAddNewTable}
          title={RVDic.AddN.replace('[n]', RVDic.Table)}
          icon={<TableIcon size={18} />}
        />
      ) : (
        <Styled.TableCellContainer ref={tableRef}>
          <TableIcon onClick={handleOnTableClick} size={22} color={CV_GRAY} />
        </Styled.TableCellContainer>
      )}
    </>
  );
};

export default TableCell;
