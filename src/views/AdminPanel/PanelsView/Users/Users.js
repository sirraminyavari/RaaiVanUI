import * as Styled from './UsersStyle';
import SearchUserInput from './items/SearchUserInput';
import AddUserButton from './items/AddUserButton';
import MultiTenantList from './items/MultiTenantList';
import TeamBasedList from './items/TeamBasedList';
import { useEffect, useState } from 'react';
import useWindowContext from 'hooks/useWindowContext';
import UserInvitation from './UserInvitation';
import InvitedUserList from './items/InvitedUserList';
import { getUsers, getUserInvitations } from './api';
import CreateUser from './CreateUser';
import { useDispatch } from 'react-redux';
import { themeSlice } from 'store/reducers/themeReducer';
import {
  SETT_USERS_CONTENT,
  SETTING_CONTENT,
} from '../../../../constant/constants';

const Users = (props) => {
  const ApplicationID = props?.route?.ApplicationID;
  const { RV_RTL, RVDic, RVGlobal } = useWindowContext();
  const SAASBasedMultiTenancy = RVGlobal?.SAASBasedMultiTenancy;
  const [searchText, setSearchText] = useState('');
  const [users, setUsers] = useState([]);
  const [invitedUsers, setInvitedUsers] = useState([]);
  const [showInvitationForm, setShowInvitationForm] = useState(false);
  const dispatch = useDispatch();

  const { setSidebarContent } = themeSlice.actions;

  useEffect(() => {
    loadUsers(searchText);
  }, [searchText]);

  useEffect(() => {
    loadUsers();
    loadInvitedUsers();

    dispatch(
      setSidebarContent({
        current: SETT_USERS_CONTENT,
        prev: SETTING_CONTENT,
      })
    );

    // return () => {
    //   dispatch(
    //     setSidebarContent({
    //       current: SETTING_CONTENT,
    //       prev: SETT_USERS_CONTENT
    //     })
    //   )
    // }
  }, []);

  /**
   * @description api call function to load users list
   * @param keyword
   */
  const loadUsers = (keyword = '') => {
    getUsers(keyword)
      .then((res) => {
        setUsers(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  /**
   * @description api call function to load invited users
   */
  const loadInvitedUsers = () => {
    getUserInvitations(ApplicationID)
      .then((res) => {
        console.log(res);
        setInvitedUsers(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

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

  return (
    <Styled.UserManagementContainer rtl={RV_RTL}>
      <Styled.UserManagementContentCard>
        {!showInvitationForm && (
          <Styled.ContentWrapper>
            <Styled.BreadCrumbWrapper items={breadCrumbItems} rtl={RV_RTL} />
            <Styled.HeadingWrapper>{'اعضای تیم'}</Styled.HeadingWrapper>

            <Styled.TopBar>
              <SearchUserInput
                defaultValue={searchText}
                placeholder={'فیلتر براساس نام کاربر'}
                onChange={(e) => setSearchText(e)}
                delayTime={1000}
              />

              {SAASBasedMultiTenancy && (
                <AddUserButton onClick={() => setShowInvitationForm(true)}>
                  {'دعوت هم تیمی جدید'}
                </AddUserButton>
              )}
              {!SAASBasedMultiTenancy && (
                <AddUserButton onClick={() => setShowInvitationForm(true)}>
                  {'ایجاد کاربر جدید'}
                </AddUserButton>
              )}
            </Styled.TopBar>

            {!SAASBasedMultiTenancy ? (
              <MultiTenantList
                searchText={searchText}
                rtl={RV_RTL}
                users={users}
              />
            ) : (
              <div>
                <TeamBasedList
                  searchText={searchText}
                  rtl={RV_RTL}
                  users={users}
                />

                {invitedUsers.length !== 0 && (
                  <InvitedUserList users={invitedUsers} />
                )}
              </div>
            )}
          </Styled.ContentWrapper>
        )}

        {showInvitationForm && SAASBasedMultiTenancy && (
          <UserInvitation onClose={() => setShowInvitationForm(false)} />
        )}

        {showInvitationForm && !SAASBasedMultiTenancy && (
          <CreateUser onClose={() => setShowInvitationForm(false)} />
        )}
      </Styled.UserManagementContentCard>
    </Styled.UserManagementContainer>
  );
};

export default Users;
