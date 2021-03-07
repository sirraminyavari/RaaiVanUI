import useScript from 'hooks/useScript';

const QuestionsView = () => {
  useScript(
    'pageLoadScripts/LoadQuestions/LoadQuestions.js',
    'LoadQuestions.js',
    () => {
      window.loadQuestions();
    }
  );
  return (
    <div
      id="qaArea"
      className="small-12 medium-12 large-12 row"
      style={{ margin: 0, padding: '0vw 10vw' }}></div>
  );
};

export default QuestionsView;
