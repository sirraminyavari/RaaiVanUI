import { useCallback, useState, useEffect, useRef } from 'react';
import * as Styled from './UserCell.styles';
import UsersList from './UsersList';
import PeoplePicker from 'components/PeoplePicker/PeoplePicker';
import AddNewUser from './AddNewUser';
// import useWindow from 'hooks/useWindowContext';

const UserCell = (props) => {
  // const { RVDic } = useWindow();

  const {
    row,
    editingRowId,
    onCellChange,
    column,
    value,
    editable: isTableEditable,
    header,
    data,
    selectedCell,
    tempRowId,
  } = props;

  const rowId = row?.original?.id;
  const columnId = column?.id;
  const selectedRowId = selectedCell?.row?.original?.id;
  const selectedColumnId = selectedCell?.column?.id;
  const isCellEditable = !!header?.options?.editable;
  const isRowEditing = rowId === editingRowId;
  const isCellEditing =
    rowId === selectedRowId && columnId === selectedColumnId;
  const isNewRow = tempRowId === rowId;

  const canEdit =
    (isTableEditable && isCellEditable && (isRowEditing || isCellEditing)) ||
    isNewRow;

  //! Get info for new row.
  const columnInfo = data?.[0]?.[columnId]?.Info;
  const { SelectedItems: initialUsers, Info } = value || {};

  const { MultiSelect: isMultiSelect } = Info || columnInfo || {};

  const [users, setUsers] = useState(isNewRow ? [] : initialUsers);
  const beforeChangeUsersRef = useRef(null);

  useEffect(() => {
    if (isNewRow) {
      beforeChangeUsersRef.current = [];
    } else {
      beforeChangeUsersRef.current = initialUsers;
    }

    return () => {
      beforeChangeUsersRef.current = null;
    };
  }, [canEdit, initialUsers, isNewRow]);

  const normalizeSelectedUsers =
    users?.length > 0
      ? users?.map((user) => {
          const temp = {
            id: user.ID,
          };
          return temp;
        })
      : [];

  /**
   * @param {Object[]} users -Users List to update.
   */
  const updateUserCell = (users) => {
    let id = isNewRow ? tempRowId : rowId;

    let userCell = {
      ...value,
      GuidItems: users,
      SelectedItems: users,
      TextValue: '',
    };

    //! Update cell.
    onCellChange(id, columnId, userCell, users);
  };

  const handleAddNewPerson = (person) => {
    const { avatarUrl: IconURL, id: ID, name } = person;
    let newUser = { ID, UserID: ID, FullName: name, IconURL };

    let userAlreadyExists = users?.some((user) => user?.ID === ID);

    //! Prepare new users list;
    const newUsersArray = isMultiSelect
      ? userAlreadyExists
        ? users
        : [...users, newUser]
      : [newUser];

    setUsers(newUsersArray);
    updateUserCell(newUsersArray);
  };

  const handleRemoveUser = useCallback((person) => {
    const newUsersArray = users?.filter(
      (user) => user?.UserID !== person?.UserID
    );
    setUsers(newUsersArray);
    updateUserCell(newUsersArray);
  }, []);

  return (
    <Styled.UsersCellContainer>
      <UsersList
        users={users}
        onRemoveUser={handleRemoveUser}
        canEdit={canEdit}
      />
      {!users?.length && (
        <Styled.EmptyCellView>انتخاب کنید</Styled.EmptyCellView>
      )}
      {canEdit && (
        <Styled.PeoplePickerWrapper>
          <PeoplePicker
            onByMe={() => {}}
            onBlur={() => {}}
            onByPeople={handleAddNewPerson}
            isByMe={false}
            pickedPeople={isNewRow ? normalizeSelectedUsers : []}
            onVisible={() => {}}
            multi={isMultiSelect}
            buttonComponent={<AddNewUser />}
          />
        </Styled.PeoplePickerWrapper>
      )}
    </Styled.UsersCellContainer>
  );
};

export default UserCell;
