window.loadError = (params) => {
  var initialJson = params;

  GlobalUtilities.create_nested_elements(
    [
      {
        Type: "div",
        Style: "text-align:center; margin-bottom:1rem;",
        Childs: [
          {
            Type: "img",
            Style: "max-width:20rem;",
            Link: RVAPI.HomePageURL(),
            Attributes: [
              { Name: "src", Value: GlobalUtilities.icon("RaaiVanLogo.png") },
            ],
          },
        ],
      },
      {
        Type: "div",
        Style: "font-size:2rem; margin-bottom:1rem;",
        Childs: [{ Type: "text", TextValue: RVDic.AnErrorOccurred }],
      },
      {
        Type: "div",
        Style:
          "font-size:2rem; color:blue;" +
          (initialJson.Code ? "" : "display:none;"),
        Childs: [
          {
            Type: "text",
            TextValue: RVDic.ErrorCode + ": " + initialJson.Code,
          },
        ],
      },
    ],
    document.getElementById("errorArea")
  );
};
