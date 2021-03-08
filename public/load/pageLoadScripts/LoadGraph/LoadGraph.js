window.loadGraph = () => {
  document.title = Base64.decode((window.RVGlobal || {}).SystemTitle);

  var filesArr = [
    {
      Root: 'JIT/',
      Childs: [
        'base.css',
        GlobalUtilities.browser_version().Name == 'msie' ? 'excanvas.js' : null,
        'jit.js',
      ].filter((f) => !!f),
    },
    'GraphViewer/GraphViewer.js',
  ];

  GlobalUtilities.load_files(filesArr, {
    OnLoad: function () {
      new GraphViewer('graphContainer');
    },
  });
};
