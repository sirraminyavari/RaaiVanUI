window.loadNewQuestion = () => {
  GlobalUtilities.load_files(['QA/NewQuestion.js'], {
    OnLoad: function () {
      new NewQuestion('questionArea');
    },
  });
};
