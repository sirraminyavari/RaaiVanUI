import * as Styled from 'components/CustomTable/CustomTable.styles';
import TrashIcon from 'components/Icons/TrashIcon/Trash';
import DuplicationIcon from 'components/Icons/DuplicationIcon/DuplicationIcon';
import EditIcon from 'components/Icons/EditIcons/Edit';
import { CV_RED } from 'constant/CssVariables';
import useWindow from 'hooks/useWindowContext';
import RowAction from './RowAction';

const RowActionMenu = (props) => {
  const {
    row,
    removeRow,
    setEditingRowId,
    onEditRowStart,
    onDuplicateRow,
    data,
    editable: isTableEditable,
    editByCell,
    setTempRowId,
  } = props?.cell || {};

  const { RVDic } = useWindow();
  const rowId = row?.original?.id;

  const handleDeleteRow = () => {
    removeRow && removeRow(row);
  };

  const handleDuplicateRow = () => {
    onDuplicateRow && onDuplicateRow(row);
  };

  const handleSetEditableRow = () => {
    setTempRowId && setTempRowId(null);
    setEditingRowId && setEditingRowId(rowId);
    onEditRowStart && onEditRowStart(data);
  };

  return (
    <Styled.TableRowActionContainer>
      {isTableEditable && (
        <>
          {!editByCell && (
            <RowAction
              title={RVDic.Edit}
              onActionClick={handleSetEditableRow}
              icon={<EditIcon size={18} />}
            />
          )}
          <RowAction
            title={RVDic.Remove}
            onActionClick={handleDeleteRow}
            icon={<TrashIcon size={15} color={CV_RED} />}
          />
        </>
      )}
      <RowAction
        title={RVDic.Duplicate}
        onActionClick={handleDuplicateRow}
        icon={<DuplicationIcon size={16} />}
      />
    </Styled.TableRowActionContainer>
  );
};

export default RowActionMenu;
