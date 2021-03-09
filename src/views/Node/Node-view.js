import useScript from 'hooks/useScript';
import { isEmpty } from 'helpers/helpers';

const NodeView = (props) => {
  useScript(
    'pageLoadScripts/LoadNode/LoadNode.js',
    'LoadNode.js',
    (node) => {
      !isEmpty(node) && window.loadNode(node);
    },
    props.route
  );
  return (
    <div
      id="nodeView"
      className="small-12 medium-12 large-12"
      style={{ padding: '0vw 10vw', marginbottom: '5rem' }}></div>
  );
};

export default NodeView;
