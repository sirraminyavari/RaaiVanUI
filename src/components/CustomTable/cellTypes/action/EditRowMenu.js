import CheckIcon from 'components/Icons/CheckIcons/Check';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';
import { CV_RED, TCV_WARM } from 'constant/CssVariables';
import * as Styled from 'components/CustomTable/CustomTable.styles';

const EditRowMenu = (props) => {
  const { cell, isNew, setShowFooter } = props;

  const rowId = cell?.row?.original?.id;

  //! Exit edit mode for a row.
  const handleExitEditMode = () => {
    cell?.setEditingRow && cell?.setEditingRow(null);
  };

  //! Accept edit changes.
  const handleAcceptChanges = () => {
    if (isNew) {
      setShowFooter(false);
    } else {
      console.log('Changes accepted');
      handleExitEditMode();
      cell?.saveRow(rowId);
    }
  };

  //! Decline edit changes.
  const handleCancelChanges = () => {
    if (isNew) {
      setShowFooter(false);
    } else {
      console.log('Changes rejected');
      handleExitEditMode();
    }
  };

  return (
    <Styled.EditRowActionContainer>
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
