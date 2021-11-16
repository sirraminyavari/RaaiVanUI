import * as Styled from './UsersStyle';
import SearchUserInput from './items/SearchUserInput';
import AddUserButton from './items/AddUserButton';
import MultiTenantList from './items/MultiTenantList';
import TeamBasedList from './items/TeamBasedList';
import { useEffect, useState } from 'react';
import useWindowContext from '../../../../hooks/useWindowContext';
import UserInvitation from './UserInvitation';
import InvitedUserList from './items/InvitedUserList';

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

  const { RV_RTL, RVDic, RVGlobal } = useWindowContext();
  const SAASBasedMultiTenancy = false; //RVGlobal.SAASBasedMultiTenancy,

  const [showInvitationForm, setShowInvitationForm] = useState(false);
  /**
   * @description items array to feed breadcrumbs component
   * @type {[{title: string}, {title: string}]}
   */
  const breadCrumbItems = [
    {
      id: 1,
      title: RVDic?.TeamManagement,
      linkTo: '',
    },
    {
      id: 2,
      title: 'مدیریت کاربران',
      linkTo: '',
    },
    {
      id: 3,
      title: 'اعضای تیم',
      linkTo: '',
    },
  ];

  useEffect(() => {
    console.log(showInvitationForm);
  }, [showInvitationForm]);
  return (
    <Styled.UserManagementContainer rtl={RV_RTL}>
      <Styled.UserManagementContentCard>
        {!showInvitationForm && (
          <Styled.ContentWrapper>
            <Styled.BreadCrumbWrapper items={breadCrumbItems} rtl={RV_RTL} />
            <Styled.HeadingWrapper>{'اعضای تیم'}</Styled.HeadingWrapper>

            <Styled.TopBar>
              <SearchUserInput placeholder={'فیلتر براساس نام کاربر'} />
              {!SAASBasedMultiTenancy && (
                <AddUserButton onClick={() => setShowInvitationForm(true)}>
                  {'دعوت هم تیمی جدید'}
                </AddUserButton>
              )}
              {SAASBasedMultiTenancy && (
                <AddUserButton onClick={() => setShowInvitationForm(true)}>
                  {'ایجاد کاربر جدید'}
                </AddUserButton>
              )}
            </Styled.TopBar>

            {SAASBasedMultiTenancy ? (
              <MultiTenantList rtl={RV_RTL} />
            ) : (
              <div>
                <TeamBasedList rtl={RV_RTL} />

                <InvitedUserList />
              </div>
            )}
          </Styled.ContentWrapper>
        )}

        {showInvitationForm && (
          <UserInvitation onClose={() => setShowInvitationForm(false)} />
        )}
      </Styled.UserManagementContentCard>
    </Styled.UserManagementContainer>
  );
};

export default Users;
