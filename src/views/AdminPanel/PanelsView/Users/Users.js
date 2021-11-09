import useScript from 'hooks/useScript';
import { isEmpty } from 'helpers/helpers';
import UseUsers from './useUsers';
import * as Styled from './UsersStyle';

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

  const { rtl } = UseUsers();
  return (
    <Styled.UserManagementContainer rtl={rtl}>
      <div>users...</div>
    </Styled.UserManagementContainer>
  );
};

export default Users;
