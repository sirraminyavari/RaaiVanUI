import { useRef } from 'react';
import useScript from 'hooks/useScript';
import { isEmpty } from 'helpers/helpers';

const Home = (props) => {
  const node = useRef();

  useScript(
    'pageLoadScripts/LoadHome/LoadHome.js',
    'LoadHome.js',
    (home) => {
      !isEmpty(home) && !node?.current?.firstChild && window.loadHome(home);
    },
    props.route
  );

  return (
    <div
      ref={node}
      id="homeArea"
      className="small-12 medium-12 large-12 row align-center"
      style={{ margin: '0rem' }}
    ></div>
  );
};

export default Home;
