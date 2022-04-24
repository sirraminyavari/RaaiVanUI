import useScript from 'hooks/useScript';
import { isEmpty } from 'helpers/helpers';

const SystemSettings = (props) => {
  useScript(
    'pageLoadScripts/LoadSystemSettings/LoadSystemSettings.js',
    'LoadSystemSettings.js',
    (settings) => {
      !isEmpty(settings) && window.loadSystemSettings(settings);
    },
    props.route
  );
  return (
    <div
      id="settingsArea"
      className="small-12 medium-12 large-12 row align-center rv-form"
    ></div>
  );
};

export default SystemSettings;
