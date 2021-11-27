import * as Styled from './ListStyled';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { teamUsers } from '../_lurem';
import { decodeBase64, getUUID } from 'helpers/helpers';
import TeamBasedUserCard from './cards/TeamBasedUserCard';
import { getUsers } from '../api';

const TeamBasedList = ({ rtl, searchText, ...props }) => {
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(async () => {
    const res = await getUsers(searchText);
    console.log('list of users: (Saas)', res);
    setUsers(res);
  }, [searchText]);

  const userCards = useMemo(
    () =>
      users?.slice(0, showMore ? users.length : 3)?.map((x) => (
        <Styled.ListRow rtl={rtl} key={getUUID()}>
          <TeamBasedUserCard {...x} />
        </Styled.ListRow>
      )),
    [showMore, users]
  );

  console.log(userCards);

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

        <Styled.ListBody>{userCards}</Styled.ListBody>
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
  },
  {
    title: '',
    width: 17,
  },
];
export default TeamBasedList;
