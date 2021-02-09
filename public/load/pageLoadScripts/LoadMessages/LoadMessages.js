window.loadMessages = () => {
  var _div = document.getElementById("messagesArea");

  GlobalUtilities.loading(_div);

  GlobalUtilities.load_files(["MSG/Messaging.js"], {
    OnLoad: function () {
      new Messaging(_div);
    },
  });
};
