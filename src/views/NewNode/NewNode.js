import useScript from 'hooks/useScript';

const NewNode = (props) => {
  useScript(
    'pageLoadScripts/LoadNewNode/LoadNewNode.js',
    'LoadNewNode.js',
    () => {
      window.loadNewNode(props.route);
    }
  );
  return (
    <div
      id="nodeArea"
      className="small-12 medium-12 large-12"
      style={{ padding: '0vw 6vw', paddingBottom: '8rem' }}></div>
  );
};

export default NewNode;
