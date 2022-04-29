import DragIcon from 'components/Icons/DragIcon/Drag';
import RowActionMenu from './RowActionMenu';
import RowEditMenu from './RowEditMenu';
import * as Styled from 'components/CustomTable/CustomTable.styles';
import PopupMenu from 'components/PopupMenu/PopupMenu';
import useWindow from 'hooks/useWindowContext';

const ActionsCell = (props) => {
  const { RV_Float } = useWindow();
  const { cell } = props;
  const { row, tempRowId, editingRowId, dragHandleProps } = cell || {};

  const rowId = row?.original?.id;

  const isNewRow = tempRowId === rowId;
  const isEditingRow = editingRowId === rowId;

  let child;

  if (isEditingRow) {
    //! Show Edit mode menu.
    child = <RowEditMenu cell={cell} />;
  } else {
    //! Show Actions Menu.
    child = (
      <Styled.RowDragHandleWrapper {...dragHandleProps}>
        {isNewRow ? (
          <DragIcon />
        ) : (
          <PopupMenu
            trigger="click"
            align={RV_Float}
            menuClass="table-action-menu"
          >
            <div>
              <DragIcon />
            </div>
            <RowActionMenu cell={cell} />
          </PopupMenu>
        )}
      </Styled.RowDragHandleWrapper>
    );
  }

  return <>{child}</>;
};

export default ActionsCell;
