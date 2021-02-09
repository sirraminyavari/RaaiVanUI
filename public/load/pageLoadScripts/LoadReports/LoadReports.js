window.loadReports = (params) => {
  var reports = params.Reports || {};
  var container = document.getElementById("reportsArea");

  var modules = (window.RVGlobal || {}).Modules || {};
  modules.KW = modules.KW || modules.DCT;

  var elems = GlobalUtilities.create_nested_elements(
    [
      {
        Type: "div",
        Class: "small-10 medium-8 large-6",
        Name: "serverSelector",
        Style: "margin:0 auto 1rem auto; display:none;",
      },
      {
        Type: "div",
        Class: "small-12 medium-12 large-12 row align-center",
        Name: "reportsContainer",
        Style: "margin:0;",
      },
    ],
    container
  );

  var loadArr = [
    { Root: "Kendo/", Childs: ["kendo.common.css", "kendo.blueopal.css"] },
    { Root: "Kendo/kendo.", Ext: "js", Childs: ["core", "data"] },
    "API/ReportsAPI.js",
    "GridManager/GridManager.js",
    "Reports/ReportsManager.js",
    "RemoteServers/RemoteServerSelector.js",
  ];

  GlobalUtilities.load_files(loadArr, {
    OnLoad: function () {
      var arr = [
        {
          Root: "Kendo/kendo.",
          Ext: "js",
          Childs: [
            "resizable",
            "selectable",
            "reorderable",
            "sortable",
            "pager",
            "userevents",
            "draganddrop",
            "grid",
          ],
        },
      ];

      GlobalUtilities.load_files(arr, {
        OnLoad: function () {
          new RemoteServerSelector(elems["serverSelector"], { AutoHide: true });
          new ReportsManager(elems["reportsContainer"], {
            Reports: reports,
            Modules: modules,
          });
        },
      });
    },
  });
};
