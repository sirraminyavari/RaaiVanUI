import useScript from 'hooks/useScript';

const UserGroups = () => {
  useScript(
    'pageLoadScripts/LoadUserGroups/LoadUserGroups.js',
    'LoadUserGroups.js',
    () => {
      window.loadUserGroups();
    }
  );
  return (
    <div
      id="userGroupsArea"
      className="small-12 medium-12 large-12 row align-center"
      style={{
        margin: '0rem',
        marginBottom: '5rem',
        padding: '0vw 6vw',
      }}></div>
  );
};

export default UserGroups;
