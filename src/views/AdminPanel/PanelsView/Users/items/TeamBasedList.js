import * as Styled from './ListStyled';
import { useCallback, useEffect, useState } from 'react';
import { teamUsers } from '../_lurem';
import { getUUID } from 'helpers/helpers';
import TeamBasedUserCard from './cards/TeamBasedUserCard';

const TeamBasedList = ({ rtl, ...props }) => {
  const [users, setUsers] = useState(teamUsers);
  const [showMore, setShowMore] = useState(false);

  const userCards = users?.slice(0, !showMore ? users.length : 3)?.map((x) => (
    <Styled.ListRow rtl={rtl} key={getUUID()}>
      <TeamBasedUserCard {...x} />
    </Styled.ListRow>
  ));

  return (
    <Styled.ListContainer top={2.4}>
      <Styled.ListHeader rtl={rtl}>
        {listHeaderData.map((x) => (
          <Styled.ListHeaderItem
            key={getUUID()}
            width={x.width}
            centralized={x.centralized}>
            {x.title}
          </Styled.ListHeaderItem>
        ))}
      </Styled.ListHeader>

      {userCards}

      <div>
        <button onClick={() => setShowMore(!showMore)}>{'مشاهده همه'}</button>
      </div>
    </Styled.ListContainer>
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
