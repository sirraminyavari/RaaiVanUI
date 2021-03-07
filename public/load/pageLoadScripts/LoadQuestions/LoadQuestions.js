window.loadQuestions = () => {
  GlobalUtilities.loading('qaArea');

  GlobalUtilities.load_files(['QA/QuestionsPanel.js'], {
    OnLoad: function () {
      new QuestionsPanel('qaArea');
    },
  });
};
