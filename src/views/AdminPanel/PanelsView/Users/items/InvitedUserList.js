import { useMemo, useState } from 'react';
import { invitedUsers, teamUsers } from '../_lurem';
import * as Styled from './ListStyled';
import { getUUID } from '../../../../../helpers/helpers';
import useWindowContext from '../../../../../hooks/useWindowContext';

const InvitedUserList = ({ ...props }) => {
  const { RV_RTL } = useWindowContext();
  const users = useMemo(() => invitedUsers, []);
  const [showMore, setShowMore] = useState(false);

  const userCards = users
    ?.slice(0, showMore ? users.length : 2)
    ?.map((x) => (
      <Styled.ListRow rtl={RV_RTL} key={getUUID()}></Styled.ListRow>
    ));
  return <></>;
};
export default InvitedUserList;
