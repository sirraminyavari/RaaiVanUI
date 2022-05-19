import { useEffect, useMemo } from 'react';
import { getUUID } from 'helpers/helpers';
import * as Styled from './UsersListStyled';
import ORGUserCard from './rows/ORGUserCard';
import { getGroupsAll } from 'apiHelper/ApiHandlers/CNAPI';
import { checkAuthority } from 'apiHelper/ApiHandlers/privacyApi';
import useWindowContext from 'hooks/useWindowContext';
import { NoneSaasUserListHeaders } from './_constants';

const UsersNoneSaasList = ({ rtl, users, ...props }) => {
  const { RVDic } = useWindowContext();
  const userCards = useMemo(
    () =>
      users?.map((x) => (
        <Styled.ListRow rtl={rtl} key={getUUID()}>
          <ORGUserCard {...x} />
        </Styled.ListRow>
      )),
    [users]
  );

  useEffect(() => {
    getGroupsAll()
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });

    checkAuthority()
      .then((res) => {
        console.log(res);
      })
      .catch((res) => {
        console.log(res);
      });
  }, []);

  return (
    <>
      <Styled.ListContainer top={2.4}>
        <Styled.ListHeader>
          <Styled.ListHeaderRow rtl={rtl}>
            {NoneSaasUserListHeaders(RVDic).map((x) => (
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

        <Styled.ListBody>{userCards}</Styled.ListBody>
      </Styled.ListContainer>
    </>
  );
};
export default UsersNoneSaasList;
