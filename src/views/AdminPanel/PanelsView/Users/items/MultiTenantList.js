import { useEffect, useState } from 'react';
import { getUsers } from '../api';
import { decodeBase64, getUUID } from 'helpers/helpers';
import * as Styled from './ListStyled';
import ORGUserCard from './cards/ORGUserCard';

const MultiTenantList = (rtl, ...props) => {
  const [users, setUsers] = useState([]);
  useEffect(async () => {
    const response = await getUsers('');

    const listOfUsers = response?.Users?.map((x) => ({
      ...x,
      FirstName: decodeBase64(x?.FirstName),
      LastName: decodeBase64(x?.LastName),
      FullName: decodeBase64(x?.FullName),
      JobTitle: decodeBase64(x?.JobTitle),
      UserName: decodeBase64(x?.UserName),
    }));
    console.log(listOfUsers);
    setUsers(listOfUsers);
  }, []);

  const userCards = users?.map((x) => (
    <Styled.ListRow rtl={rtl} key={getUUID()}>
      <ORGUserCard {...x} />
    </Styled.ListRow>
  ));

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
