import { useState, useRef } from 'react';
import DragIcon from 'components/Icons/DragIcon/Drag';
import RowActionMenu from './RowActionMenu';
import RowEditMenu from './RowEditMenu';
import * as Styled from 'components/CustomTable/CustomTable.styles';
import useOnClickOutside from 'hooks/useOnClickOutside';

const ActionsCell = (props) => {
  const { cell } = props;
  const { row, tempRowId, editingRowId, dragHandleProps } = cell || {};
  const [showActions, setShowActions] = useState(false);
  const actionRef = useRef();

  const rowId = row?.original?.id;

  useOnClickOutside(actionRef, () => {
    setShowActions(false);
  });

  const handleShowActions = () => {
    setShowActions((showAction) => !showAction);
  };

  let child;

  if (editingRowId === rowId || tempRowId === rowId) {
    //! Show Edit mode menu.
    child = <RowEditMenu cell={cell} />;
  } else {
    //! Show Actions Menu.
    child = (
      <Styled.RowDragHandleWrapper
        ref={actionRef}
        onClick={handleShowActions}
        {...dragHandleProps}>
        <DragIcon />
        {showActions && <RowActionMenu cell={cell} />}
      </Styled.RowDragHandleWrapper>
    );
  }

  return <>{child}</>;
};

export default ActionsCell;
