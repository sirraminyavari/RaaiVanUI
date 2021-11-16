import { useMemo, useState } from 'react';
import { invitedUsers, teamUsers } from '../_lurem';
import * as Styled from './ListStyled';
import { getUUID } from 'helpers/helpers';
import useWindowContext from 'hooks/useWindowContext';
import InvitedUserCard from './cards/InvitedUserCard';

const InvitedUserList = ({ ...props }) => {
  const { RV_RTL } = useWindowContext();
  const users = useMemo(() => invitedUsers, []);
  const [showMore, setShowMore] = useState(false);

  const userCards = users?.slice(0, showMore ? users.length : 2)?.map((x) => (
    <Styled.ListRow rtl={RV_RTL} key={getUUID()}>
      <InvitedUserCard {...x} />
    </Styled.ListRow>
  ));
  return (
    <>
      <Styled.ListContainer top={5.5}>
        <Styled.ListHeader>
          <Styled.ListHeaderRow rtl={RV_RTL}>
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

      <Styled.ShowMoreButton onClick={() => setShowMore(!showMore)}>
        {'مشاهده همه'}
      </Styled.ShowMoreButton>
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
    title: 'تاریخ دعوت',
    width: 33,
  },
  {
    title: '',
    width: 17,
  },
];
export default InvitedUserList;
