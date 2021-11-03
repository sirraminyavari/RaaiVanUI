import EditMenuButtons from '../../EditMenuButtons';

const RowEditMenu = (props) => {
  const { cell, isNew, setShowFooter, addRow } = props;
  const { row, setEditingRow, editRow, onEditRowCancel } = cell || {};

  const rowId = row?.original?.id;

  //! Exit edit mode for a row.
  const handleExitEditMode = () => {
    setEditingRow && setEditingRow(null);
  };

  //! Accept edit changes.
  const handleAcceptChanges = () => {
    if (isNew) {
      addRow && addRow();
      setShowFooter(false);
    } else {
      console.log('Changes accepted');
      handleExitEditMode();
      editRow && editRow(rowId);
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
    onEditRowCancel && onEditRowCancel();
  };

  return (
    <EditMenuButtons
      onAccept={handleAcceptChanges}
      onCancel={handleCancelChanges}
    />
  );
};

export default RowEditMenu;
