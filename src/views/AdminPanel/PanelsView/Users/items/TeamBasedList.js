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
        <Styled.ListHeaderItem grow={1.3}>{'نام کاربر'}</Styled.ListHeaderItem>
        <Styled.ListHeaderItem grow={1.5}>{'ایمیل'}</Styled.ListHeaderItem>
        <Styled.ListHeaderItem grow={1.2}>
          {'آخرین فعالیت'}
        </Styled.ListHeaderItem>
        <Styled.ListHeaderItem>{'کاربر مدیر'}</Styled.ListHeaderItem>
        <Styled.ListHeaderItem>{'گروه ها'}</Styled.ListHeaderItem>
        <Styled.ListHeaderItem grow={1.5}></Styled.ListHeaderItem>
      </Styled.ListHeader>

      <Styled.ListBody>{userCards}</Styled.ListBody>

      <div>
        <button onClick={() => setShowMore(!showMore)}>{'مشاهده همه'}</button>
      </div>
    </Styled.ListContainer>
  );
};
export default TeamBasedList;
