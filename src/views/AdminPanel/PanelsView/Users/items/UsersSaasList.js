import * as Styled from './UsersListStyled';
import React, { createContext, useEffect, useMemo, useState } from 'react';
import { getUUID } from 'helpers/helpers';
import SaasUsersListRow from './rows/SaasUsersListRow';
import { checkAuthority } from 'apiHelper/ApiHandlers/privacyApi';
import { getGroupsAll } from 'apiHelper/ApiHandlers/CNApi';
import useWindow from 'hooks/useWindowContext';
import { SaasUserListHeaders } from './_constants';

export const GroupsContext = createContext({});

const UsersSaasList = ({ rtl, users, ...props }) => {
  const [showMore, setShowMore] = useState(false);
  const [groups, setGroups] = useState([]);
  const { RVDic } = useWindow();

  useEffect(() => {
    loadAllGroups();
    checkAuthority()
      .then((res) => {
        console.log(res);
      })
      .catch((res) => {
        console.log(res);
      });
  }, []);

  const loadAllGroups = () => {
    getGroupsAll()
      .then((res) => {
        setGroups(res);
      })
      .catch((res) => {
        console.log(res);
      });
  };

  const userCards = useMemo(
    () =>
      users?.slice(0, showMore ? users.length : 3)?.map((x) => (
        <Styled.ListRow rtl={rtl} key={getUUID()}>
          <SaasUsersListRow {...x} />
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
                centralized={x.centralized}>
                {x.title}
              </Styled.ListHeaderItem>
            ))}
          </Styled.ListHeaderRow>
        </Styled.ListHeader>

        <GroupsContext.Provider value={{ groups, loadAllGroups }}>
          <Styled.ListBody>{userCards}</Styled.ListBody>
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
