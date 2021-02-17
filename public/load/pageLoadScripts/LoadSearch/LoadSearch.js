window.loadSearch = (params) => {
  var searchText = Base64.decode((params.SearchText || "").replace(" ", "+"));

  GlobalUtilities.load_files(["SearchManager/SearchManager.js"], {
    OnLoad: function () {
      var sm = new SearchManager("searchArea", {
        Options: { Modules: (window.RVGlobal || {}).Modules },
        SearchInput: null,
        SearchButton: null,
        InitialSearch: searchText,
      });

      GlobalUtilities.onscrollend(document, { Offset: 100 }, function () {
        if (sm) sm.search();
      });
    },
  });
};
