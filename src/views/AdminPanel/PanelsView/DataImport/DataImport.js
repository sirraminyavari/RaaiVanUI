import useScript from 'hooks/useScript';

const DataImport = () => {
  useScript(
    'pageLoadScripts/LoadDataImport/LoadDataImport.js',
    'LoadDataImport.js',
    () => {
      window.loadDataImport();
    }
  );
  return (
    <div
      id="dataimport"
      className="small-12 medium-12 large-12"
      style={{ marginBottom: '5rem', padding: '0vw 6vw', paddingTop: '1rem' }}
    ></div>
  );
};

export default DataImport;
