import useScript from 'hooks/useScript';

const ExplorerView = () => {
  useScript(
    'pageLoadScripts/LoadExplorer/LoadExplorer.js',
    'LoadExplorer.js',
    () => {
      window.loadExplorer();
    }
  );
  return (
    <div
      id="explorerContainer"
      className="small-12 medium-12 large-12"
      style={{ padding: '0vw 6vw', marginBottom: '5rem' }}
    ></div>
  );
};

export default ExplorerView;
