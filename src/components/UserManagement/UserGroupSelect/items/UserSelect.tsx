import UserSelectionCheckbox from 'components/Inputs/RVCheckbox/UserSelectionCheckbox';
import ScrollBarProvider from 'components/ScrollBarProvider/ScrollBarProvider';
import { useContext, useEffect, useMemo, useState } from 'react';
import { UserGroupSelectContext } from '../UserGroupSelect';
import * as Styles from '../UserGroupSelectStyles';

const UserSelect = () => {
  const { RVDic } = window;
  const { users, onUserSearchTextChange, handleUserCheck, selectedUsers } =
    useContext(UserGroupSelectContext);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    onUserSearchTextChange && onUserSearchTextChange(searchText);
  }, [searchText]);

  const list = useMemo(() => {
    return users
      ?.map((x) => ({
        id: x?.UserID,
        src: x?.ProfileImageURL,
        title: x?.FullName,
      }))
      .map((u) => {
        const { id } = u;
        return (
          <Styles.ObjectItemContainer key={id}>
            <UserSelectionCheckbox
              value={id}
              checked={selectedUsers?.includes(id)}
              onChange={(e) => {
                const { checked, value } = e?.target;
                console.log(checked, value);
                handleUserCheck && handleUserCheck(u, checked);
              }}
            >
              <UserSelectionCheckbox.Label src={u?.src} title={u?.title} />
            </UserSelectionCheckbox>
          </Styles.ObjectItemContainer>
        );
      });
  }, [users, selectedUsers]);

  return (
    <>
      <Styles.InputContainer>
        <Styles.Input
          placeholder={RVDic?.Search}
          delayTime={1000}
          value={searchText}
          onChange={(e) => setSearchText(e?.target?.value)}
        />
      </Styles.InputContainer>

      <ScrollBarProvider>{list}</ScrollBarProvider>
    </>
  );
};
export default UserSelect;
