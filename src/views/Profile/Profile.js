import { useRef } from 'react';
import useScript from 'hooks/useScript';
import { isEmpty } from 'helpers/helpers';

const Profile = (props) => {
  const node = useRef();

  useScript(
    'pageLoadScripts/LoadProfile/LoadProfile.js',
    'LoadProfile.js',
    (user) => {
      !isEmpty(user) && !node.current.firstChild && window.loadProfile(user);
    },
    props.route
  );
  return (
    <>
      <div
        id="coverContainer"
        className="small-12 medium-12 large-12"
        style={styles.coverContainer}></div>

      <div
        ref={node}
        id="profileArea"
        className="small-12 medium-12 large-12"
        style={{ padding: '0vw 6vw', marginBottom: '8rem' }}></div>
    </>
  );
};

const styles = {
  coverContainer: {
    position: 'relative',
    marginTop: '-2.2rem',
    marginBottom: '1rem',
    height: '18rem',
  },
};

export default Profile;
