import useScript from 'hooks/useScript';
import { isEmpty } from 'helpers/helpers';
import UseUsers from './useUsers';
import * as Styled from './UsersStyle';
import Breadcrumb from '../../../../components/Breadcrumb/Breadcrumb';
import { BreadCrumbWrapper } from './UsersStyle';
import SearchUserInput from './items/SearchUserInput';
import InvitationButton from './items/InvitationButton';

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

  const { rtl, breadCrumbItems } = UseUsers();
  return (
    <Styled.UserManagementContainer rtl={rtl}>
      <Styled.UserManagementContentCard>
        <Styled.BreadCrumbWrapper items={breadCrumbItems} rtl={rtl} />
        <Styled.HeadingWrapper>{'اعضای تیم'}</Styled.HeadingWrapper>

        <Styled.TopBar>
          <SearchUserInput placeholder={'فیلتر براساس نام کاربر'} />
          <InvitationButton>{'دعوت هم تیمی جدید'}</InvitationButton>
        </Styled.TopBar>
      </Styled.UserManagementContentCard>
    </Styled.UserManagementContainer>
  );
};

export default Users;
