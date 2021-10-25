import { useCallback, useState } from 'react';
import * as Styled from './UserCell.styles';
import UsersList from './UsersList';
import PeoplePicker from 'components/PeoplePicker/PeoplePicker';
import AddNewUser from './AddNewUser';
import Button from 'components/Buttons/Button';
import useWindow from 'hooks/useWindowContext';
import { CV_DISTANT, TCV_DEFAULT } from 'constant/CssVariables';

const UserCell = (props) => {
  const { RVDic } = useWindow();

  const {
    isNew,
    row,
    editingRow,
    onCellChange,
    column,
    value,
    editable: isTableEditable,
    header,
    data,
  } = props;

  const rowId = row?.original?.id;
  const columnId = column?.id;
  const headerId = header?.id;
  const isCellEditable = !!header?.options?.editable;
  const isRowEditing = rowId === editingRow;

  //! Get info for new row.
  const columnInfo = data?.[0]?.[columnId]?.Info;
  const { SelectedItems: initialUsers, Info } = value || {};

  const { MultiSelect: isMultiSelect } = Info || columnInfo || {};

  const [users, setUsers] = useState(isNew ? [] : initialUsers);

  const canEdit = (isTableEditable && isCellEditable && isRowEditing) || isNew;

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
    let id = isNew ? null : rowId;
    let userCell = isNew
      ? {
          ElementID: headerId,
          GuidItems: users,
          SelectedItems: users,
          Type: header?.dataType,
        }
      : {
          ...value,
          GuidItems: users,
          SelectedItems: users,
        };

    //! Update cell.
    onCellChange(id, columnId, userCell, users);
  };

  const handleAddNewPerson = useCallback((person) => {
    const { avatarUrl: IconURL, id: ID, name: FullName } = person;
    let newUser = { ID, UserID: ID, FullName, IconURL };

    setUsers((oldUserList) => {
      let userAlreadyExists = oldUserList?.some((user) => user?.ID === ID);

      //! Prepare new users list;
      const newUsersArray = isMultiSelect
        ? userAlreadyExists
          ? oldUserList
          : [...oldUserList, newUser]
        : [newUser];

      return newUsersArray;
    });
  }, []);

  const handleRemoveUser = useCallback((person) => {
    const newUsersArray = users?.filter(
      (user) => user?.UserID !== person?.UserID
    );
    updateUserCell(newUsersArray);
  }, []);

  const handleSaveUsers = () => {
    updateUserCell(users);
  };

  return (
    <Styled.UsersCellContainer>
      <Styled.UsersWrapper>
        <Styled.UserListWrapper isEditMode={canEdit}>
          <UsersList
            users={users}
            onRemoveUser={handleRemoveUser}
            canEdit={canEdit}
          />
          {!users?.length && (
            <Styled.EmptyCellView>انتخاب کنید</Styled.EmptyCellView>
          )}
        </Styled.UserListWrapper>
        {canEdit && (
          <Button
            disable={false}
            classes="table-user-cell-save-button"
            style={{ color: false ? CV_DISTANT : TCV_DEFAULT }}
            onClick={handleSaveUsers}>
            <Styled.SaveButtonHeading type="h4">
              {RVDic.Save}
            </Styled.SaveButtonHeading>
          </Button>
        )}
      </Styled.UsersWrapper>
      {canEdit && (
        <PeoplePicker
          onByMe={() => {}}
          onBlur={() => {}}
          onByPeople={handleAddNewPerson}
          isByMe={false}
          pickedPeople={isNew ? normalizeSelectedUsers : []}
          onVisible={() => {}}
          multi={isMultiSelect}
          buttonComponent={<AddNewUser />}
        />
      )}
    </Styled.UsersCellContainer>
  );
};

export default UserCell;
