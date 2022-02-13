import { useMemo, useState } from 'react';
import * as Styled from './UsersListStyled';
import { getUUID } from 'helpers/helpers';
import useWindowContext from 'hooks/useWindowContext';
import InvitedUserCard from './rows/InvitedUserCard';
import { SaasInvitedUsersList } from './_constants';

const InvitedUserList = ({ users }) => {
  const { RV_RTL, RVDic } = useWindowContext();
  const [showMore, setShowMore] = useState(false);

  const userCards = useMemo(
    () =>
      users?.slice(0, showMore ? users.length : 2)?.map((x) => (
        <Styled.ListRow rtl={RV_RTL} key={getUUID()}>
          <InvitedUserCard {...x} />
        </Styled.ListRow>
      )),
    [users, showMore]
  );

  console.log();
  return (
    <>
      <Styled.ListContainer top={5.5}>
        <Styled.ListHeader>
          <Styled.ListHeaderRow rtl={RV_RTL}>
            {SaasInvitedUsersList(RVDic).map((x) => (
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

      {users.length > 2 && (
        <Styled.ShowMoreButton onClick={() => setShowMore(!showMore)}>
          {showMore ? RVDic?.ShowLess : RVDic?.ShowMore}
        </Styled.ShowMoreButton>
      )}
    </>
  );
};
export default InvitedUserList;
