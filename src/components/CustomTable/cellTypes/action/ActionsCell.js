import DragIcon from 'components/Icons/DragIcon/Drag';
import RowActionMenu from './RowActionMenu';
import RowEditMenu from './RowEditMenu';
import * as Styled from 'components/CustomTable/CustomTable.styles';
import Popover from '@mui/base/PopperUnstyled';
// import PopupMenu from 'components/PopupMenu/PopupMenu';
import useWindow from 'hooks/useWindowContext';
import { useState } from 'react';
import OnClickAway from 'components/OnClickAway/OnClickAway';

//TODO extract popover !
const ActionsCell = (props) => {
  const { RV_Float } = useWindow();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(false);
  const id = open ? 'simple-popover' : undefined;
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
          <>
            <div>
              <DragIcon
                aria-describedby={id}
                onClick={(event) => {
                  setAnchorEl(event.currentTarget);
                  setOpen((prev) => !prev);
                }}
              />
            </div>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              popperOptions={{ placement: RV_Float }}
              placement="auto"
            >
              <OnClickAway
                style={{}}
                onAway={() => {
                  setOpen(false);
                }}
                onClick={() => {}}
              >
                <RowActionMenu cell={cell} />
              </OnClickAway>
            </Popover>
          </>
        )}
      </Styled.RowDragHandleWrapper>
    );
  }

  return <>{child}</>;
};

export default ActionsCell;
