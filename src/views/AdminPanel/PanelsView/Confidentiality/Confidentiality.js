import useScript from 'hooks/useScript';

const Confidentiality = () => {
  useScript(
    'pageLoadScripts/LoadConfidentiality/LoadConfidentiality.js',
    'LoadConfidentiality.js',
    () => {
      window.loadConfidentiality();
    }
  );
  return (
    <div
      id="confidentialityLevels"
      className="small-12 medium-12 large-12 row align-center"
      style={{
        margin: '0rem',
        marginBottom: '5rem',
        padding: '0vw 6vw',
      }}
    ></div>
  );
};

export default Confidentiality;
