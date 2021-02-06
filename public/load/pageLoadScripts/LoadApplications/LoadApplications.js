window.loadApplications = () => {
  GlobalUtilities.loading("appsArea");

  GlobalUtilities.load_files(["USR/ApplicationsManager.js"], {
    OnLoad: function () {
      new ApplicationsManager("appsArea");
    },
  });

  /////////////////////////--> editor test - to be removed <--/////////////////////////
  return;

  GlobalUtilities.load_files(
    [
      "CKEditor5/ckeditor.js",
      "CKEditor5/translations/fa.js",
      "RVEditor/RVEditor.js",
    ],
    {
      OnLoad: function () {
        var elems = GlobalUtilities.create_nested_elements(
          [
            {
              Type: "div",
              Style: "padding:0 4vw;",
              Childs: [
                {
                  Type: "div",
                  Name: "editor",
                  Childs: [{ Type: "text", TextValue: "Ramin Yavari" }],
                },
              ],
            },
            {
              Type: "div",
              Style:
                "margin:2rem; display:flex; flex-flow:row; justify-content:center;",
              Childs: [
                {
                  Type: "div",
                  Class: "rv-air-button rv-circle",
                  Name: "get",
                  Style: "flex:0 0 auto; padding:0.3rem 2rem;",
                  Childs: [{ Type: "text", TextValue: "Get HTML" }],
                },
              ],
            },
          ],
          document.getElementById("appsArea").parentNode
        );

        var editor = new RVEditor(elems["editor"], {
          OwnerID: "6d2466d0-69a3-4c46-a9ab-ddd760b6dd24",
          UploadOwnerType: "Node",
          OnInit: function (obj) {
            editor = obj;
          },
        });

        elems["get"].onclick = function () {
          _alert(editor.get_data());
        };
      },
    }
  );
  /////////////////////////--> end of editor test - to be removed <--/////////////////////////
};
