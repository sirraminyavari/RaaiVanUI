(function () {
    window.RVCheadget = window.RVCheadget || {};
    if (RVCheadget.gesi) return;

    var gesi = function () {
        this.ContainerDiv = document.createElement("div");

        var that = this;

        var elems = GlobalUtilities.create_nested_elements([
            { Type: "div", Name: "_div",
                Style: "position: fixed; z-index: " + GlobalUtilities.zindex.dialog() + "; padding: 0px; margin: 0px; font-family: tahoma; " +
                    "min-width: 500px; max-width:500px; width:500px; top: 0px; left: 395.5px;" +
                    "border: 5px solid rgb(153, 153, 153); border-radius: 5px; background-color:white;",
                Childs: [{ Type: "img", Style: "width:500px; height:500px;", Name: "_img"}]
            }
        ], document.body);

        that.ContainerDiv = elems["_div"];
        that.ImageElement = elems["_img"];

        that.show();
    }

    gesi.prototype = {
        show: function () {
            var that = this;

            that.Images = that.Images ||
                [GlobalUtilities.js("Cheadget/gesi/images/Gesi.jpg"), GlobalUtilities.js("Cheadget/gesi/images/Gesi-Cartoon.png")];
            that.Random = that.Random || (new Date().getTime());
            that.ImageElement.setAttribute("src", that.Images[that.Random++ % 2]);

            that.ContainerDiv.style.top = (($(window).height() / 2) - ($(that.ContainerDiv).outerHeight() / 2)) + "px";
            that.ContainerDiv.style.left = (($(window).width() / 2) - ($(that.ContainerDiv).outerWidth() / 2)) + "px";

            that.ContainerDiv.style.display = "block";
            that.ContainerDiv.zIndex = GlobalUtilities.zindex.dialog();

            GlobalUtilities.add_to_escape_queue(that.ContainerDiv, function () { that.ContainerDiv.style.display = "none"; });
        }
    }

    RVCheadget.gesi = new gesi();
})();