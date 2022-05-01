import useScript from 'hooks/useScript';

const WorkFlows = (props) => {
  useScript(
    'pageLoadScripts/LoadWorkFlows/LoadWorkFlows.js',
    'LoadWorkFlows.js',
    (settings) => {
      window.loadWorkFlows(settings || {});
    },
    props.route
  );
  return (
    <div
      id="workflowsArea"
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

export default WorkFlows;
