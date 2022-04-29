import useScript from 'hooks/useScript';
import { isEmpty } from 'helpers/helpers';

const HelpMeView = (props) => {
  useScript('pageLoadScripts/LoadHelpMe/LoadHelpMe.js', 'LoadHelpMe.js', () => {
    !isEmpty(props.route) && window.loadHelpMe();
  });

  return (
    <div
      id="helpArea"
      className="small-12 medium-12 large-12 row"
      style={{ margin: '0rem', padding: '1rem 4vw' }}
    ></div>
  );
};

export default HelpMeView;
