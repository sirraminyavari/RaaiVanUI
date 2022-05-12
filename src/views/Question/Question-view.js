import useScript from 'hooks/useScript';
import { isEmpty } from 'helpers/helpers';

const QuestionView = (props) => {
  useScript(
    'pageLoadScripts/LoadQuestion/LoadQuestion.js',
    'LoadQuestion.js',
    (q) => {
      !isEmpty(q) && window.loadQuestion(q);
    },
    props.route
  );
  return (
    <div
      id="qArea"
      className="small-12 medium-12 large-12 row"
      style={{ margin: 0, padding: '1rem 10vw 0 10vw' }}
    ></div>
  );
};

export default QuestionView;
