(function () {
    window.RVCheadget = window.RVCheadget || {};
    if (RVCheadget.instaprofile) return;

    var instaprofile = function () {
        this.ContainerDiv = document.createElement("div");

        var that = this;

        var _show_image = function () {
            var btn = this;

            if (that._Processing) return;

            var username = GlobalUtilities.trim(elems["usernameInput"].value);
            if (!username) return;

            that._Processing = true;

            elems["imageContainer"].innerHTML = "";

            GlobalUtilities.loading(elems["imageContainer"]);

            var _show = function (url) {
                that._Processing = false;

                url = url || GlobalUtilities.js("Cheadget/instaprofile/images/Gesi-Cartoon.png");

                elems["imageContainer"].innerHTML = "";

                GlobalUtilities.create_nested_elements([
                    {
                        Type: "img", Class: "rv-border-radius-1", Style: "cursor:pointer; width:100%;",
                        Attributes: [{ Name: "alt", Value: username }, { Name: "src", Value: url }],
                        Properties: [{ Name: "onclick", Value: function () { window.open(url); } }]
                    }
                ], elems["imageContainer"]);
            };

            jQuery.get("https://www.instagram.com/" + username + "/?__a=1", function (d) {
                var userId = (((d || {}).graphql || {}).user || {}).id;

                if (!userId) return _show();

                jQuery.get("https://i.instagram.com/api/v1/users/" + userId + "/info/", function (x) {
                    _show((((x || {}).user || {}).hd_profile_pic_url_info || {}).url || ((x || {}).user || {}).profile_pic_url);
                });
            });
        };

        var elems = GlobalUtilities.create_nested_elements([
            {
                Type: "div", Class: "small-10 medium-8 large-6 row rv-border-radius-1 SoftBackgroundColor",
                Style: "margin:0rem auto; padding:1rem;", Name: "_div",
                Childs: [
                    {
                        Type: "div", Class: "small-8 medium-8 large-8",
                        Childs: [
                            {
                                Type: "input", Class: "rv-input", Name: "usernameInput", InnerTitle: "Instagram Username...",
                                Style: "width:100%; direction:ltr; text-align:center;"
                            }
                        ]
                    },
                    { Type: "div", Class: "small-1 medium-1 large-1" },
                    {
                        Type: "div", Class: "small-3 medium-3 large-3 rv-air-button rv-circle",
                        Properties: [{ Name: "onclick", Value: _show_image }],
                        Childs: [{ Type: "text", TextValue: RVDic.Go }]
                    },
                    {
                        Type: "div", Class: "small-12 medium-12 large-12", Name: "imageContainer",
                        Style: "margin-top:1rem; text-align:center;"
                    }
                ]
            }
        ]);

        GlobalUtilities.set_onenter(elems["usernameInput"], _show_image);

        that.UsernameInput = elems["usernameInput"];
        that.ContainerDiv = elems["_div"];

        that.show();
    }

    instaprofile.prototype = {
        show: function () {
            var that = this;

            GlobalUtilities.show(that.ContainerDiv, {
                OnShow: function () { jQuery(that.UsernameInput).focus(); }
            });
        }
    }

    RVCheadget.instaprofile = new instaprofile();
})();