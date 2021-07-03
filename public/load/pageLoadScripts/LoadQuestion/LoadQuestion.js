window.loadQuestion = (params) => {
  var initialJson = params || {};

  GlobalUtilities.loading('qArea');

  GlobalUtilities.load_files(['QA/QuestionView.js'], {
    OnLoad: function () {
      new QuestionView('qArea', { QuestionID: initialJson.QuestionID });
    },
  });
};
