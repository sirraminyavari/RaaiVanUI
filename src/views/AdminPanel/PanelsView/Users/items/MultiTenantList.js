import { useEffect, useMemo, useState } from 'react';
import { getUsers } from '../api';
import { decodeBase64, getUUID } from 'helpers/helpers';
import * as Styled from './ListStyled';
import ORGUserCard from './cards/ORGUserCard';

const MultiTenantList = ({ rtl, searchText, ...props }) => {
  const [users, setUsers] = useState([]);

  useEffect(async () => {
    const res = await getUsers(searchText);
    setUsers(res);
  }, [searchText]);

  const userCards = useMemo(
    () =>
      users?.map((x) => (
        <Styled.ListRow rtl={rtl} key={getUUID()}>
          <ORGUserCard {...x} />
        </Styled.ListRow>
      )),
    [users]
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
  },
  {
    title: 'فعال/غیرفعال',
    width: 10,
  },
];
export default MultiTenantList;
