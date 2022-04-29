import useScript from 'hooks/useScript';

const NewQuestionView = () => {
  useScript(
    'pageLoadScripts/LoadNewQuestion/LoadNewQuestion.js',
    'LoadNewQuestion.js',
    () => {
      window.loadNewQuestion();
    }
  );
  return (
    <div
      id="questionArea"
      className="small-12 medium-12 large-12 row align-center"
      style={{ margin: 0, marginBottom: '5rem', padding: '0vw 10vw' }}
    ></div>
  );
};

export default NewQuestionView;
