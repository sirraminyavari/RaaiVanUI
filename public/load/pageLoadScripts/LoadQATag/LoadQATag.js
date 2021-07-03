window.loadQATag = (params) => {
  var initialJson = params || {};

  GlobalUtilities.loading('contentArea');

  GlobalUtilities.load_files(['QA/QATagViewer.js'], {
    OnLoad: function () {
      new QATagViewer('contentArea', {
        Tag: { ID: initialJson.TagID, Name: Base64.decode(initialJson.Name) },
      });
    },
  });
};
