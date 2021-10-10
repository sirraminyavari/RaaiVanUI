import { useContext } from 'react';
import { toast } from 'react-toastify';
import * as Styled from './CustomTable.styles';
import TrashIcon from 'components/Icons/TrashIcon/Trash';
import DuplicationIcon from 'components/Icons/DuplicationIcon/DuplicationIcon';
import EditIcon from 'components/Icons/EditIcons/Edit';
import { CV_RED } from 'constant/CssVariables';
import { WindowContext } from 'context/WindowProvider';
import UndoToast from 'components/toasts/undo-toast/UndoToast';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';

const RowAction = ({ cell }) => {
  const { RVDic } = useContext(WindowContext);
  const rowId = cell?.row?.original?.id;

  const canDelete = cell?.editable && cell?.removeRow;

  const undoRowDelete = (rowId) => {};

  //! Close undo toast when user clicks on "X" button.
  const closeUndoToast = (toastId) => {
    toast.dismiss(toastId);
  };

  const handleDeleteRow = () => {
    console.log('Delete row');
    cell?.removeRow && cell.removeRow(cell?.row?.index);

    const deleteMSG = 'ردیف حذف خواهد شد';
    UndoToast({
      autoClose: 7000,
      message: deleteMSG,
      onUndo: () => undoRowDelete(rowId),
      toastId: `delete-${rowId}`,
      closeButton: (
        <CloseIcon
          onClick={() => closeUndoToast(`delete-${rowId}`)}
          color={CV_RED}
        />
      ),
    });
  };

  const handleDuplicateRow = () => {
    console.log('Duplicate row');
  };

  const handleSetEditableRow = () => {
    cell?.setEditingRow && cell?.setEditingRow(rowId);
  };

  return (
    <Styled.TableRowActionContainer>
      {canDelete && (
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
