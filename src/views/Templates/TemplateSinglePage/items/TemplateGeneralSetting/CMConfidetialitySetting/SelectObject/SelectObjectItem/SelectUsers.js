import { usePrivacyProvider } from '../../PrivacyContext';
import ScrollBarProvider from 'components/ScrollBarProvider/ScrollBarProvider';
import {
  ObjectItemContainer,
  ObjectListWrapper,
} from './SelectObjectItemStyle';
import UserSelectionCheckbox from 'components/Inputs/RVCheckbox/UserSelectionCheckbox';
import { useMemo } from 'react';

const SelectUsers = ({ type, searchText }) => {
  const { RVDic } = window;
  const { users, selectedUsers, handleUserSelect } = usePrivacyProvider();
  const _users = [...selectedUsers].find((x) => x.type === type)?.items;

  const items = useMemo(
    () =>
      [...users]
        .map((x) => ({
          id: x?.UserID,
          src: x?.ProfileImageURL,
          title: x?.FullName,
        }))
        .filter((x) => x?.title?.includes(searchText))
        .map((x) => (
          <ObjectItemContainer key={x?.id}>
            <UserSelectionCheckbox
              value={x?.id}
              checked={[..._users].includes(x?.id)}
              onChange={(e) => {
                const { value, checked } = e?.target;
                handleUserSelect(value, checked, type);
              }}
            >
              <UserSelectionCheckbox.Label {...x} />
            </UserSelectionCheckbox>
          </ObjectItemContainer>
        )),
    [users, _users, searchText]
  );
  return (
    <ScrollBarProvider>
      <ObjectListWrapper>{items}</ObjectListWrapper>
    </ScrollBarProvider>
  );
};
export default SelectUsers;
