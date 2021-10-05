import CheckIcon from 'components/Icons/CheckIcons/Check';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';
import { CV_RED, TCV_WARM } from 'constant/CssVariables';
import * as Styled from './CustomTable.styles';

const EditRowMenu = ({ cell }) => {
  //! Exit edit mode for a row.
  const handleExitEditMode = () => {
    cell?.setEditableRowIndex && cell?.setEditableRowIndex(null);
  };

  //! Accept edit changes.
  const handleAcceptChanges = () => {
    console.log('Changes accepted');
    handleExitEditMode();
  };

  //! Decline edit changes.
  const handleCancelChanges = () => {
    console.log('Changes rejected');
    handleExitEditMode();
  };

  return (
    <Styled.EditRowActionContainer {...cell.dragHandleProps}>
      <CheckIcon
        style={{ cursor: 'pointer' }}
        size={28}
        color={TCV_WARM}
        onClick={handleAcceptChanges}
      />
      <CloseIcon
        style={{ cursor: 'pointer' }}
        size={16}
        color={CV_RED}
        onClick={handleCancelChanges}
      />
    </Styled.EditRowActionContainer>
  );
};

export default EditRowMenu;
