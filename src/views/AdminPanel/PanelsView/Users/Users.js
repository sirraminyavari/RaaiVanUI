import * as Styled from './UsersStyle';
import SearchUserInput from './items/SearchUserInput';
import AddUserButton from './items/AddUserButton';
import MultiTenantList from './items/MultiTenantList';
import TeamBasedList from './items/TeamBasedList';
import { useEffect, useState } from 'react';
import useWindowContext from '../../../../hooks/useWindowContext';
import UserInvitation from './UserInvitation';
import InvitedUserList from './items/InvitedUserList';
import AutoSuggestInput from '../../../../components/Inputs/AutoSuggestInput/AutoSuggestInput';
import Input from '../../../../components/Inputs/Input';

const Users = (props) => {
  const { RV_RTL, RVDic, RVGlobal } = useWindowContext();
  const SAASBasedMultiTenancy = RVGlobal?.SAASBasedMultiTenancy;
  const [searchText, setSearchText] = useState('');

  console.log('RVGlobal: ', SAASBasedMultiTenancy);

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

  useEffect(() => {
    console.log(searchText);
  }, [searchText]);
  return (
    <Styled.UserManagementContainer rtl={RV_RTL}>
      <Styled.UserManagementContentCard>
        {!showInvitationForm && (
          <Styled.ContentWrapper>
            <Styled.BreadCrumbWrapper items={breadCrumbItems} rtl={RV_RTL} />
            <Styled.HeadingWrapper>{'اعضای تیم'}</Styled.HeadingWrapper>

            <Styled.TopBar>
              <SearchUserInput
                changeOrEnterListener={(e) => setSearchText(e.target.value)}
                placeholder={'فیلتر براساس نام کاربر'}
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
              <MultiTenantList searchText={searchText} rtl={RV_RTL} />
            ) : (
              <div>
                <TeamBasedList searchText={searchText} rtl={RV_RTL} />

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
