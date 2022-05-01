import useScript from 'hooks/useScript';

const RemoteServers = () => {
  useScript(
    'pageLoadScripts/LoadRemoteServers/LoadRemoteServers.js',
    'LoadRemoteServers.js',
    () => {
      window.loadRemoteServers();
    }
  );
  return (
    <div
      id="remoteServers"
      className="small-12 medium-12 large-12"
      style={{
        margin: '0',
        marginBottom: '5rem',
        padding: '0 6vw',
        paddingTop: '1rem',
      }}
    ></div>
  );
};

export default RemoteServers;
