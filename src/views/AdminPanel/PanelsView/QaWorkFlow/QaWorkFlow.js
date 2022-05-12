import useScript from 'hooks/useScript';

const QaWorkFlow = () => {
  useScript(
    'pageLoadScripts/LoadQaWorkFlow/LoadQaWorkFlow.js',
    'LoadQaWorkFlow.js',
    () => {
      window.loadQaWorkFlow();
    }
  );
  return (
    <div
      className="small-12 medium-12 large-12 row align-center"
      style={{ margin: '0rem', padding: '0vw 4vw', paddingTop: '1rem' }}
    >
      <div
        id="tabs"
        className="small-12 medium-12 large-12"
        style={{ marginBottom: '1rem' }}
      ></div>
      <div
        id="wfArea"
        className="small-12 medium-12 large-12 row"
        style={{ margin: '0rem' }}
      ></div>
      <div
        id="faqArea"
        className="small-12 medium-12 large-12 row"
        style={{ margin: '0rem' }}
      ></div>
    </div>
  );
};

export default QaWorkFlow;
