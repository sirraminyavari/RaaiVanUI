import { useContext } from 'react';
import * as Styled from 'components/CustomTable/CustomTable.styles';
import TrashIcon from 'components/Icons/TrashIcon/Trash';
import DuplicationIcon from 'components/Icons/DuplicationIcon/DuplicationIcon';
import EditIcon from 'components/Icons/EditIcons/Edit';
import { CV_RED } from 'constant/CssVariables';
import { WindowContext } from 'context/WindowProvider';

const RowAction = ({ cell }) => {
  const { RVDic } = useContext(WindowContext);
  const rowId = cell?.row?.original?.id;

  const handleDeleteRow = () => {
    cell?.removeRow && cell.removeRow(cell?.row);
  };

  const handleDuplicateRow = () => {
    console.log('Duplicate row');
  };

  const handleSetEditableRow = () => {
    cell?.setEditingRow && cell?.setEditingRow(rowId);
    cell?.onEditRowStart && cell?.onEditRowStart(cell?.data);
    cell?.setShowFooter(false);
  };

  return (
    <Styled.TableRowActionContainer>
      {cell?.editable && (
        <>
          <Styled.TableActionWrapper onClick={handleSetEditableRow}>
            <EditIcon size={18} />
            <span>{RVDic.Edit}</span>
          </Styled.TableActionWrapper>
          <Styled.TableActionWrapper onClick={handleDeleteRow}>
            <TrashIcon color={CV_RED} />
            <span>{RVDic.Remove}</span>
          </Styled.TableActionWrapper>
        </>
      )}
      <Styled.TableActionWrapper onClick={handleDuplicateRow}>
        <DuplicationIcon size={18} />
        <span>{RVDic.Duplicate}</span>
      </Styled.TableActionWrapper>
    </Styled.TableRowActionContainer>
  );
};

export default RowAction;
