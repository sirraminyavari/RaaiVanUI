import * as Styled from './ListStyled';
import React, { createContext, useEffect, useMemo, useState } from 'react';
import { getUUID } from 'helpers/helpers';
import TeamBasedUserCard from './cards/TeamBasedUserCard';
import { checkAuthority, getGroupsAll, getUsers } from '../api';

export const GroupsContext = createContext({});

const TeamBasedList = ({ rtl, users, ...props }) => {
  const [showMore, setShowMore] = useState(false);
  const [groups, setGroups] = useState([]);

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
          <TeamBasedUserCard {...x} />
        </Styled.ListRow>
      )),
    [showMore, users]
  );

  return (
    <>
      <Styled.ListContainer top={2.4}>
        <Styled.ListHeader>
          <Styled.ListHeaderRow rtl={rtl}>
            {listHeaderData.map((x) => (
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
          {'مشاهده همه'}
        </Styled.ShowMoreButton>
      )}
    </>
  );
};

const listHeaderData = [
  {
    title: 'نام کاربر',
    width: 25,
  },
  {
    title: 'ایمیل',
    width: 25,
  },
  {
    title: 'آخرین فعالیت',
    width: 17,
  },
  {
    title: 'کاربر مدیر',
    width: 8,
    centralized: true,
  },
  {
    title: 'گروه ها',
    width: 8,
    centralized: true,
  },
  {
    title: '',
    width: 17,
  },
];
export default TeamBasedList;
