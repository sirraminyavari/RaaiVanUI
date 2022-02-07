import * as Styled from './UsersStyle';
import SearchInput from 'components/Inputs/SearchInput';
import AddUserButton from './items/AddUserButton';
import UsersNoneSaasList from './items/UsersNoneSaasList';
import UsersSaasList from './items/UsersSaasList';
import { useEffect, useState } from 'react';
import useWindowContext from 'hooks/useWindowContext';
import UsersInvitation from './UsersInvitation';
import InvitedUserList from './items/InvitedUserList';
import UsersCreate from './UsersCreate';
import { getUserInvitations, getUsers } from 'apiHelper/ApiHandlers/usersApi';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';

const Users = (props) => {
  const ApplicationID = props?.route?.ApplicationID;
  const { RV_RTL, RVDic, RVGlobal } = useWindowContext();
  const SAASBasedMultiTenancy = RVGlobal?.SAASBasedMultiTenancy;
  const [searchText, setSearchText] = useState('');
  const [users, setUsers] = useState([]);
  const [invitedUsers, setInvitedUsers] = useState([]);
  const [showInvitationForm, setShowInvitationForm] = useState(false);
  const [dataIsFetching, setDataIsFetching] = useState(true);

  /**
   * @description reload user on search
   */
  useEffect(() => {
    loadUsers(searchText).catch((err) => console.log(err));
  }, [searchText]);

  useEffect(() => {
    loadData().catch((err) => console.log(err));
  }, []);

  /**
   * @description api call function to load users list
   * @param keyword
   */
  const loadUsers = async (keyword = '') => {
    const _users = SAASBasedMultiTenancy
      ? await getUsers(keyword, true)
      : await getUsers(keyword, null);

    setUsers(_users);
  };

  /**
   * @description load list of users and invited users
   * @returns {Promise<void>}
   */
  const loadData = async () => {
    const _users = await getUsers();
    const _invitedUsers = await getUserInvitations(ApplicationID);
    setUsers(_users);
    setInvitedUsers(_invitedUsers);
    setDataIsFetching(false);
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
      title: RVDic?.UserManagement,
      linkTo: 'users',
    },
    {
      id: 3,
      title: SAASBasedMultiTenancy ? RVDic?.TeamMembers : RVDic?.Users,
      linkTo: 'users',
    },
  ];

  return (
    <Styled.UserManagementContainer rtl={RV_RTL}>
      <Styled.UserManagementContentCard>
        {!showInvitationForm && (
          <Styled.ContentWrapper>
            <Styled.BreadCrumbWrapper items={breadCrumbItems} rtl={RV_RTL} />
            <Styled.HeadingWrapper>
              {SAASBasedMultiTenancy ? RVDic?.TeamMembers : RVDic?.Users}
            </Styled.HeadingWrapper>

            <Styled.TopBar>
              <SearchInput
                defaultValue={searchText}
                placeholder={RVDic?.Search}
                onChange={(e) => setSearchText(e)}
                delayTime={1000}
              />

              {SAASBasedMultiTenancy && (
                <AddUserButton onClick={() => setShowInvitationForm(true)}>
                  {RVDic?.InviteNewTeamMate}
                </AddUserButton>
              )}
              {!SAASBasedMultiTenancy && (
                <AddUserButton onClick={() => setShowInvitationForm(true)}>
                  {RVDic?.CreateNewN?.replace(`[n]`, RVDic.User)}
                </AddUserButton>
              )}
            </Styled.TopBar>

            {!dataIsFetching ? (
              <>
                {!SAASBasedMultiTenancy ? (
                  <UsersNoneSaasList
                    searchText={searchText}
                    rtl={RV_RTL}
                    users={users}
                  />
                ) : (
                  <div>
                    <UsersSaasList
                      searchText={searchText}
                      rtl={RV_RTL}
                      users={users}
                    />

                    {invitedUsers.length !== 0 && (
                      <InvitedUserList users={invitedUsers} />
                    )}
                  </div>
                )}
              </>
            ) : (
              <LogoLoader />
            )}
          </Styled.ContentWrapper>
        )}

        {showInvitationForm && SAASBasedMultiTenancy && (
          <UsersInvitation onClose={() => setShowInvitationForm(false)} />
        )}

        {showInvitationForm && !SAASBasedMultiTenancy && (
          <UsersCreate onClose={() => setShowInvitationForm(false)} />
        )}
      </Styled.UserManagementContentCard>
    </Styled.UserManagementContainer>
  );
};
export default Users;
