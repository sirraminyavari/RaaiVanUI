import useScript from 'hooks/useScript';

const ChangePassword = (props) => {
  useScript(
    'pageLoadScripts/LoadChangePass/LoadChangePass.js',
    'LoadChangePass.js',
    () => {
      window.loadChangePass(props.route);
    }
  );
  return (
    <div
      id="contentArea"
      className="small-10 medium-8 large-6 rv-border-radius-1 SoftBackgroundColor"
      style={{ padding: '1rem', margin: '5rem auto' }}
    ></div>
  );
};

export default ChangePassword;
