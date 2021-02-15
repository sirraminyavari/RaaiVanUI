import useScript from 'hooks/useScript';

const WorkFlows = () => {
  useScript(
    'pageLoadScripts/LoadWorkFlows/LoadWorkFlows.js',
    'LoadWorkFlows.js',
    () => {
      window.loadWorkFlows();
    }
  );
  return (
    <div
      id="workflowsArea"
      className="small-12 medium-12 large-12 row align-center"
      style={{
        margin: '0rem',
        marginBottom: '5rem',
        padding: '0vw 6vw',
      }}></div>
  );
};

export default WorkFlows;
