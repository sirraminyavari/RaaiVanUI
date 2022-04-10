import useScript from 'hooks/useScript';
import { isEmpty } from 'helpers/helpers';

const QATagView = (props) => {
  useScript(
    'pageLoadScripts/LoadQATag/LoadQATag.js',
    'LoadQATag.js',
    (qa) => {
      !isEmpty(qa) && window.loadQATag(qa);
    },
    props.route
  );
  return (
    <div
      id="contentArea"
      className="small-12 medium-12 large-12 row align-center"
      style={{ margin: '0rem', padding: '0vw 10vw' }}
    ></div>
  );
};

export default QATagView;
