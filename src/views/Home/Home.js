import useScript from 'hooks/useScript';
import { isEmpty } from 'helpers/helpers';

const Home = (props) => {
  useScript(
    'pageLoadScripts/LoadHome/LoadHome.js',
    'LoadHome.js',
    (home) => {
      !isEmpty(home) && window.loadHome(home);
    },
    props.route
  );

  return (
    <div
      id="homeArea"
      className="small-12 medium-12 large-12 row align-center"
      style={{ margin: '0rem' }}></div>
  );
};

export default Home;
