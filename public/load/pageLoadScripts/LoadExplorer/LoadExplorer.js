window.loadExplorer = () => {
  GlobalUtilities.loading('explorerContainer');

  GlobalUtilities.load_files(
    [{ Root: 'CN/CNExplorer/', Childs: ['CNExplorer.css', 'CNExplorer.js'] }],
    {
      OnLoad: function () {
        new CNExplorer('explorerContainer');
      },
    }
  );
};
