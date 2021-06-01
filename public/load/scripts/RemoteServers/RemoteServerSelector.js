(function () {
    if (window.RemoteServerSelector) return;

    window.RemoteServerSelector = function (container, params) {
        this.Container = typeof (container) == "object" ? container : document.getElementById(container);
        if (!this.Container) return;
        params = params || {};
        
        this.Options = {
            AutoHide: !!params.AutoHide
        };
        
        var that = this;

        GlobalUtilities.load_files(["API/UsersAPI.js", "RemoteServers/RemoteServerSettings.js"], {
            OnLoad: function () { that._preinit(); }
        });
    };

    RemoteServerSelector.prototype = {
        _preinit: function () {
            var that = this;
            
            UsersAPI.GetRemoteServers({
                ParseResults: true,
                ResponseHandler: function (result) {
                    that.initialize(result.Servers || []);
                }
            });
        },

        initialize: function (servers) {
            var that = this;

            that.Container.innerHTML = "";
            
            if (that.Options.AutoHide && !servers.length) return jQuery(that.Container).remove();
            else jQuery(that.Container).fadeIn(0);

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12 rv-air-button rv-circle", Name: "selectButton",
                    Childs: [{ Type: "text", TextValue: RVDic.SelectN.replace("[n]", RVDic.RemoteServer) }]
                },
                {
                    Type: "div", Name: "selected",
                    Class: "small-12 medium-12 large-12 rv-border-radius-half rv-bg-color-white-softer SoftShadow SoftBorder",
                    Style: "position:relative; border-color:rgb(230,230,230); display:none;" +
                        "padding:0.3rem; padding-" + RV_Float + ":2rem;",
                    Childs: [
                        {
                            Type: "div", Style: "position:absolute; top:0.3rem;" + RV_Float + ":0.3rem;",
                            Childs: [{
                                Type: "i", Class: "fa fa-times fa-lg rv-icon-button", Name: "removeButton",
                                Attributes: [{ Name: "aria-hidden", Value: true }]
                            }]
                        },
                        {Type: "text", Name: "textData"}
                    ]
                },
            ], that.Container);

            var selectButton = elems["selectButton"];
            var selected = elems["selected"];
            var removeButton = elems["removeButton"];
            var textData = elems["textData"];

            removeButton.onclick = function () {
                jQuery(selected).fadeOut(0);
                jQuery(selectButton).fadeIn(0);

                RVRequest.remove_remote_server();
            };

            selectButton.onclick = function () {
                that.select(servers, function (item) {
                    jQuery(selectButton).fadeOut(0);
                    jQuery(selected).fadeIn(0);

                    textData.data = GlobalUtilities.convert_numbers_to_persian(Base64.decode(item.Name));

                    RVRequest.set_remote_server({
                        BaseURL: Base64.decode(item.URL),
                        UserName: Base64.decode(item.UserName),
                        Password: Base64.decode(item.Password)
                    });
                });
            };
        },

        select: function (servers, onSelect) {
            var that = this;

            that.ServerSelectDialog = that.ServerSelectDialog || { Showed: null, Container: null };

            if (that.ServerSelectDialog.Container)
                return (that.ServerSelectDialog.Showed = GlobalUtilities.show(that.ServerSelectDialog.Container));

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-9 large-8 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0 auto; padding:1rem;", Name: "container",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 rv-title",
                            Childs: [{ Type: "text", TextValue: RVDic.RemoteServers }]
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "_div" }
                    ]
                }
            ]);

            that.ServerSelectDialog.Container = elems["container"];

            GlobalUtilities.loading(elems["_div"]);
            that.ServerSelectDialog.Showed = GlobalUtilities.show(that.ServerSelectDialog.Container);

            new RemoteServerSettings(elems["_div"], {
                Servers: servers,
                SelectMode: true,
                OnSelect: function (item) {
                    onSelect(item);
                    that.ServerSelectDialog.Showed.Close();
                }
            });
        }
    };
})();