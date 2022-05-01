import useScript from 'hooks/useScript';

const DocumentTrees = () => {
  useScript(
    'pageLoadScripts/LoadDocuments/LoadDocuments.js',
    'LoadDocuments.js',
    () => {
      window.loadDocuments();
    }
  );
  return (
    <div
      id="treesArea"
      className="small-12 medium-12 large-12 row align-center"
      style={{
        margin: '0rem',
        marginBottom: '5rem',
        padding: '0vw 6vw',
        paddingTop: '1rem'
      }}
    ></div>
  );
};

export default DocumentTrees;
