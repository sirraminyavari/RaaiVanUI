import EditMenuButtons from '../../EditMenuButtons';

const RowEditMenu = (props) => {
  const { cell, addRow } = props;
  const {
    row,
    setEditingRowId,
    editRow,
    onEditRowCancel,
    dragHandleProps,
    tempRowId,
    setTempRowId,
  } = cell || {};

  const rowId = row?.original?.id;

  //! Exit edit mode for a row.
  const handleExitEditMode = () => {
    setEditingRowId && setEditingRowId(null);
  };

  //! Accept edit changes.
  const handleAcceptChanges = () => {
    if (!!tempRowId) {
      console.log('new row');
      addRow && addRow();
    } else {
      console.log('Changes accepted');
      handleExitEditMode();
      editRow && editRow(rowId);
    }
  };

  //! Decline edit changes.
  const handleCancelChanges = () => {
    if (!!tempRowId) {
      onEditRowCancel && onEditRowCancel(tempRowId);
      setTempRowId(null);
    } else {
      console.log('Changes rejected');
      handleExitEditMode();
      onEditRowCancel && onEditRowCancel();
    }
  };

  return (
    <EditMenuButtons
      {...dragHandleProps}
      onAccept={handleAcceptChanges}
      onCancel={handleCancelChanges}
    />
  );
};

export default RowEditMenu;
