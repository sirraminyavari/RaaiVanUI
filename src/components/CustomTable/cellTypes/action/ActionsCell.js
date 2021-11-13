import { useState, useRef } from 'react';
import DragIcon from 'components/Icons/DragIcon/Drag';
import RowActionMenu from './RowActionMenu';
import RowEditMenu from './RowEditMenu';
import * as Styled from 'components/CustomTable/CustomTable.styles';
import useOnClickOutside from 'hooks/useOnClickOutside';

const ActionsCell = ({ cell }) => {
  const [showActions, setShowActions] = useState(false);
  const actionRef = useRef();

  useOnClickOutside(actionRef, () => {
    setShowActions(false);
  });

  const handleShowActions = () => {
    setShowActions((showAction) => !showAction);
  };

  let child;

  if (cell?.editingRow === cell?.row?.original?.id) {
    //! Show Edit mode menu.
    child = <RowEditMenu cell={cell} />;
  } else {
    //! Show Actions Menu.
    child = (
      <Styled.RowDragHandleWrapper
        ref={actionRef}
        onClick={handleShowActions}
        {...cell.dragHandleProps}>
        <DragIcon />
        {showActions && <RowActionMenu cell={cell} />}
      </Styled.RowDragHandleWrapper>
    );
  }

  return <>{child}</>;
};

export default ActionsCell;
