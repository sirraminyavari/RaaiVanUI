window.loadPolls = () => {
  GlobalUtilities.load_files(["Polls/PollsManager.js"], {
    OnLoad: function () {
      new PollsManager("pollsArea");
    },
  });
};
