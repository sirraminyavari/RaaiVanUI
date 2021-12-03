import { useEffect, useMemo, useState } from 'react';
import { checkAuthority, getGroupsAll, getUsers } from '../api';
import { decodeBase64, getUUID } from 'helpers/helpers';
import * as Styled from './ListStyled';
import ORGUserCard from './cards/ORGUserCard';

const MultiTenantList = ({ rtl, users, ...props }) => {
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
    </>
  );
};
const listHeaderData = [
  {
    title: 'نام کاربر',
    width: 25,
  },
  {
    title: 'نام کاربری',
    width: 25,
  },
  {
    title: 'آخرین فعالیت',
    width: 20,
  },
  {
    title: 'تنظیمات',
    width: 10,
    centralized: true,
  },
  {
    title: 'بازنشانی گذرواژه',
    width: 10,
    centralized: true,
  },
  {
    title: 'فعال/غیرفعال',
    width: 10,
    centralized: true,
  },
];
export default MultiTenantList;
