import { useCallback, useState, useEffect, useRef } from 'react';
import * as Styled from './UserCell.styles';
import UsersList from './UsersList';
import PeoplePicker from 'components/PeoplePicker/PeoplePicker';
import AddNewUser from './AddNewUser';
import { useCellProps } from 'components/CustomTable/tableUtils';
// import useWindow from 'hooks/useWindowContext';
import useOnClickOutside from 'hooks/useOnClickOutside';

const UserCell = (props) => {
  // const { RVDic } = useWindow();

  const {
    value,
    onCellChange,
    rowId,
    columnId,
    isNewRow,
    canEdit,
    setSelectedCell,
    isSelectedCell,
  } = useCellProps(props);

  const userRef = useRef();

  useOnClickOutside(userRef, () => isSelectedCell && setSelectedCell(null));

  const { SelectedItems: initialUsers, Info } = value || {};

  const { MultiSelect: isMultiSelect } = Info || {};

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
    let userCell = {
      ...value,
      GuidItems: users,
      SelectedItems: users,
      TextValue: '',
    };

    onCellChange(rowId, columnId, userCell, users);
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
    isSelectedCell && updateUserCell(newUsersArray);
  };

  const handleRemoveUser = useCallback((person) => {
    const newUsersArray = users?.filter(
      (user) => user?.UserID !== person?.UserID
    );
    setUsers(newUsersArray);
    isSelectedCell && updateUserCell(newUsersArray);
  }, []);

  const renderUsers = () => (
    <>
      <UsersList
        users={users}
        onRemoveUser={handleRemoveUser}
        canEdit={canEdit}
      />
      {/* {!users?.length && (
        <Styled.EmptyCellView>انتخاب کنید</Styled.EmptyCellView>
      )} */}
    </>
  );

  if (!canEdit) {
    return (
      <Styled.UsersCellContainer>{renderUsers()}</Styled.UsersCellContainer>
    );
  }

  return (
    <Styled.UsersCellContainer ref={userRef}>
      {renderUsers()}
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
    </Styled.UsersCellContainer>
  );
};

export default UserCell;
