import * as Styled from './UsersListStyled';
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { getUUID } from 'helpers/helpers';
import SaasUsersListRow from './rows/SaasUsersListRow';
import { checkAuthority } from 'apiHelper/ApiHandlers/privacyApi';
import { getGroupsAll } from 'apiHelper/ApiHandlers/CNApi';
import useWindow from 'hooks/useWindowContext';
import { SaasUserListHeaders } from './_constants';

export const GroupsContext = createContext({});

const UsersSaasList = ({ rtl, users, ownerId }) => {
  console.log(users);
  const [showMore, setShowMore] = useState(false);
  const [groups, setGroups] = useState([]);
  const { RVDic } = useWindow();

  useEffect(() => {
    (async () => {
      await checkAuthority();
      await loadAllGroups();
    })();
  }, []);

  const loadAllGroups = async () => {
    const _groups = await getGroupsAll();
    setGroups(_groups);
  };

  const rows = useMemo(
    () =>
      users?.slice(0, showMore ? users.length : 3)?.map((x) => (
        <Styled.ListRow rtl={rtl} key={getUUID()}>
          <SaasUsersListRow {...x} ownerId={ownerId} />
        </Styled.ListRow>
      )),
    [showMore, users]
  );

  return (
    <>
      <Styled.ListContainer top={2.4}>
        <Styled.ListHeader>
          <Styled.ListHeaderRow rtl={rtl}>
            {SaasUserListHeaders(RVDic).map((x) => (
              <Styled.ListHeaderItem
                key={getUUID()}
                width={x.width}
                centralized={x.centralized}
              >
                {x.title}
              </Styled.ListHeaderItem>
            ))}
          </Styled.ListHeaderRow>
        </Styled.ListHeader>

        <GroupsContext.Provider value={{ groups, loadAllGroups }}>
          <Styled.ListBody>{rows}</Styled.ListBody>
        </GroupsContext.Provider>
      </Styled.ListContainer>

      {users.length > 3 && (
        <Styled.ShowMoreButton onClick={() => setShowMore(!showMore)}>
          {showMore ? RVDic?.ShowLess : RVDic?.ShowMore}
        </Styled.ShowMoreButton>
      )}
    </>
  );
};
export default UsersSaasList;
