(function () {
    return;

    var editor = new RVEditor(document.querySelector('#editor'), {
        OwnerID: "6d2466d0-69a3-4c46-a9ab-ddd760b6dd24",
        UploadOwnerType: "Node",
        OnInit: function (obj) { editor = obj; }
    });

    document.getElementById("btnGetHTML").onclick = function () {
        _alert(editor.get_data());
    };
})();