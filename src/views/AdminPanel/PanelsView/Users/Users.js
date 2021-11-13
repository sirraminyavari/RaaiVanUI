import UseUsers from './useUsers';
import * as Styled from './UsersStyle';
import SearchUserInput from './items/SearchUserInput';
import AddUserButton from './items/AddUserButton';
import MultiTenantList from './items/MultiTenantList';
import TeamBasedList from './items/TeamBasedList';
import { useEffect } from 'react';

const Users = (props) => {
  // useScript(
  //   'pageLoadScripts/LoadUsers/LoadUsers.js',
  //   'LoadUsers.js',
  //   (users) => {
  //     !isEmpty(users) && window.loadUsers(users);
  //   },
  //   props.route
  // );
  // return (
  //   <div
  //     id="usersArea"
  //     className="small-12 medium-12 large-12 row align-center"
  //     style={{ marginBottom: '5rem', padding: '0 10vw 0 10vw' }}></div>
  // );

  const { rtl, breadCrumbItems, SAASBasedMultiTenancy } = UseUsers();

  useEffect(() => {
    console.log(SAASBasedMultiTenancy);
  }, []);
  return (
    <Styled.UserManagementContainer rtl={rtl}>
      <Styled.UserManagementContentCard>
        <Styled.BreadCrumbWrapper items={breadCrumbItems} rtl={rtl} />
        <Styled.HeadingWrapper>{'اعضای تیم'}</Styled.HeadingWrapper>

        <Styled.TopBar>
          <SearchUserInput placeholder={'فیلتر براساس نام کاربر'} />
          {!SAASBasedMultiTenancy && (
            <AddUserButton>{'دعوت هم تیمی جدید'}</AddUserButton>
          )}
          {SAASBasedMultiTenancy && (
            <AddUserButton>{'ایجاد کاربر جدید'}</AddUserButton>
          )}
        </Styled.TopBar>

        {SAASBasedMultiTenancy ? (
          <MultiTenantList rtl={rtl} />
        ) : (
          <TeamBasedList rtl={rtl} />
        )}
      </Styled.UserManagementContentCard>
    </Styled.UserManagementContainer>
  );
};

export default Users;
