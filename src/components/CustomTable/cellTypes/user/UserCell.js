import { useState, useEffect, useRef, useMemo } from 'react';
import * as Styled from './UserCell.styles';
import UsersList from './UsersList';
import PeoplePicker from 'components/PeoplePicker/PeoplePicker';
import { useCellProps } from 'components/CustomTable/tableUtils';
import useWindow from 'hooks/useWindowContext';
import useOnClickOutside from 'hooks/useOnClickOutside';
import AddNewUserButton from 'components/CustomTable/AddNewButton';
import UserIcon from 'components/Icons/UserIconIo';

const UserCell = (props) => {
  const { RVDic, RVGlobal } = useWindow();

  const {
    value,
    onCellChange,
    rowId,
    columnId,
    isNewRow,
    canEdit,
    setSelectedCell,
    isSelectedCell,
    editByCell,
  } = useCellProps(props);

  const userRef = useRef();

  const { SelectedItems: initialUsers, Info } = value || {};

  const { MultiSelect: isMultiSelect } = Info || {};

  const [users, setUsers] = useState(isNewRow ? [] : initialUsers);
  const beforeChangeUsersRef = useRef(null);

  const handleClickOutside = () => {
    if (isSelectedCell) {
      setSelectedCell(null);
      updateCell(users);
    }
  };

  useOnClickOutside(userRef, handleClickOutside);

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

  const normalizeSelectedUsers = useMemo(() => {
    return users?.length > 0
      ? users?.map((user) => {
          const temp = {
            id: user.ID,
          };
          return temp;
        })
      : [];
  }, [users]);

  const updateCell = (users) => {
    let userCell = {
      ...value,
      GuidItems: users,
      SelectedItems: users,
      TextValue: '',
    };

    onCellChange(rowId, columnId, userCell, users);
  };

  const handleAddNewPerson = (person) => {
    if (!person) return setUsers([]);
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

    !editByCell && updateCell(newUsersArray);
  };

  const handleRemoveUser = (person) => {
    const newUsersArray = users?.filter(
      (user) => user?.UserID !== person?.UserID
    );
    setUsers(newUsersArray);
    !editByCell && updateCell(newUsersArray);
  };

  const renderUsers = () => (
    <>
      <UsersList
        users={users}
        onRemoveUser={handleRemoveUser}
        canEdit={canEdit}
      />
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
          onByMe={(state) => {
            const currentUser = {
              ...RVGlobal.CurrentUser,
              id: RVGlobal.CurrentUser.UserID,
              avatarUrl: RVGlobal.CurrentUser.ProfileImageURL,
              name: RVGlobal.CurrentUser.FullName,
            };
            console.log({ state, currentUser });
            if (!state) handleRemoveUser(currentUser);
            else handleAddNewPerson(currentUser);
          }}
          onBlur={() => {}}
          onByPeople={(e) => {
            console.log({ e });
            handleAddNewPerson(e);
          }}
          isByMe={normalizeSelectedUsers?.find(
            (y) => y.id === RVGlobal.CurrentUser.UserID
          )}
          pickedPeople={normalizeSelectedUsers}
          onVisible={() => {}}
          multi={isMultiSelect}
          fixedPositioning
          buttonComponent={
            <AddNewUserButton
              title={
                isMultiSelect
                  ? RVDic?.SelectN?.replace('[n]', RVDic?.User)
                  : 'تغییر کاربر'
              }
              icon={<UserIcon size={23} />}
              noBorder
            />
          }
        />
      </Styled.PeoplePickerWrapper>
    </Styled.UsersCellContainer>
  );
};

export default UserCell;
