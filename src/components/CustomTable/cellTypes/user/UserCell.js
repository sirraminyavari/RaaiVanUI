import { useCallback } from 'react';
import * as Styled from './UserCell.styles';
import UsersList from './UsersList';
import PeoplePicker from 'components/PeoplePicker/PeoplePicker';
import AddNewUser from './AddNewUser';

const UserCell = (props) => {
  const {
    isNew,
    row,
    editingRow,
    onCellChange,
    column,
    value,
    editable: isTableEditable,
    header,
  } = props;

  const { SelectedItems: users, Info } = value || {};

  const rowId = row?.original?.id;
  const columnId = column?.id;
  const isCellEditable = !!header?.options?.editable;
  const isRowEditing = rowId === editingRow;

  const canEdit = isTableEditable && isCellEditable && isRowEditing;

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
    const userCell = {
      ...value,
      GuidItems: users,
      SelectedItems: users,
    };

    //! Update cell.
    onCellChange(rowId, columnId, userCell, users);
  };

  const handleAddNewPerson = useCallback((person) => {
    const { avatarUrl: IconURL, id: ID, name: FullName } = person;
    let newUser = { ID, UserID: ID, FullName, IconURL };

    let userAlreadyExists = users.some((user) => user?.ID === ID);

    //! Prepare new users list;
    const newUsersArray = Info?.MultiSelect
      ? userAlreadyExists
        ? users
        : [...users, newUser]
      : [newUser];

    updateUserCell(newUsersArray);
  }, []);

  const handleRemoveUser = useCallback((person) => {
    const newUsersArray = users?.filter(
      (user) => user?.UserID !== person?.UserID
    );
    updateUserCell(newUsersArray);
  }, []);

  return (
    <Styled.UsersCellWrapper>
      <UsersList
        users={users}
        onRemoveUser={handleRemoveUser}
        canEdit={canEdit}
      />
      {!users?.length && !canEdit && !isNew && (
        <Styled.EmptyCellView>انتخاب کنید</Styled.EmptyCellView>
      )}
      {(canEdit || isNew) && (
        <PeoplePicker
          onByMe={() => {}}
          onBlur={() => {}}
          onByPeople={handleAddNewPerson}
          isByMe={false}
          pickedPeople={isNew ? normalizeSelectedUsers : []}
          onVisible={() => {}}
          multi={Info?.MultiSelect}
          buttonComponent={<AddNewUser />}
        />
      )}
    </Styled.UsersCellWrapper>
  );
};

export default UserCell;
