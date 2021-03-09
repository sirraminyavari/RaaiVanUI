import useScript from 'hooks/useScript';

const NetworkView = () => {
  useScript(
    'pageLoadScripts/LoadNetwork/LoadNetwork.js',
    'LoadNetwork.js',
    () => {
      window.loadNetwork();
    }
  );
  return (
    <div
      id="pageContainer"
      className="small-12 medium-12 large-12"
      style={{ padding: '0vw 6vw', marginBottom: '5rem' }}></div>
  );
};

export default NetworkView;
