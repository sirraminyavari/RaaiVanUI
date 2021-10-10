import CheckIcon from 'components/Icons/CheckIcons/Check';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';
import { CV_RED, TCV_WARM } from 'constant/CssVariables';
import * as Styled from './CustomTable.styles';

const EditRowMenu = ({ cell }) => {
  //! Exit edit mode for a row.
  const handleExitEditMode = () => {
    cell?.setEditingRow && cell?.setEditingRow(null);
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
      <div>
        <CheckIcon
          className="table-edit-check-icon"
          size={30}
          color={TCV_WARM}
          onClick={handleAcceptChanges}
        />
        <CloseIcon
          className="table-edit-cancel-icon"
          size={30}
          color={CV_RED}
          onClick={handleCancelChanges}
        />
      </div>
    </Styled.EditRowActionContainer>
  );
};

export default EditRowMenu;
