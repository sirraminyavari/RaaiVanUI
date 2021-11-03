import EditIcon from 'components/Icons/EditIcons/Edit';
import { TCV_DEFAULT } from 'constant/CssVariables';
import * as Styled from './CustomTable.styles';
import EditMenuButtons from './EditMenuButtons';

const CellEdit = (props) => {
  const {
    setSelectedCell,
    cell,
    selectedCell,
    onEditStart,
    onEditCancel,
    onEdit,
  } = props;
  const isEditMode =
    cell?.row?.original?.id === selectedCell?.row?.original?.id &&
    cell?.column?.id === selectedCell?.column?.id;

  const handleStartEditCell = () => {
    setSelectedCell && setSelectedCell(cell);
    onEditStart && onEditStart();
  };

  const handleAcceptChange = () => {
    setSelectedCell && setSelectedCell(null);
    onEdit && onEdit(cell?.row?.original?.id);
  };

  const handleCancelChange = () => {
    setSelectedCell && setSelectedCell(null);
    onEditCancel && onEditCancel();
  };

  return (
    <>
      {isEditMode ? (
        <Styled.EditButtonsWrapper>
          <EditMenuButtons
            onAccept={handleAcceptChange}
            onCancel={handleCancelChange}
            containerClass="table-edit-buttons-container"
            iconSize={25}
          />
        </Styled.EditButtonsWrapper>
      ) : (
        <Styled.EditIconWrapper
          isShown={cell?.column?.editable}
          onClick={handleStartEditCell}>
          <EditIcon size={18} color={TCV_DEFAULT} />
        </Styled.EditIconWrapper>
      )}
    </>
  );
};

export default CellEdit;
