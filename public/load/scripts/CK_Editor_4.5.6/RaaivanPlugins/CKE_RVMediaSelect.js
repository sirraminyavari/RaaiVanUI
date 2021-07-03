(function () {
    if (window.CKE_RVMediaSelect) return;

    window.CKE_RVMediaSelect = function (containerDiv, params) {
        this.Container = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.Container) return;
        params = params || {};

        this.Objects = { Editor: params.Editor || "" };

        this.Options = {
            GetMedia: params.GetMedia
        };

        var that = this;

        that._init(params);
    }

    CKE_RVMediaSelect.prototype = {
        _init: function (params) {
            var that = this;

            var mediaButton = null;
            
            jQuery(that.Container).on('click', '.cke_button__rvmediaselect', function (event) {
                if (!mediaButton) mediaButton = this;

                var _div = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-10 medium-10 large-8 row rv-border-radius-1 SoftBackgroundColor",
                        Style: "margin:0rem auto; padding:1rem;", Name: "_div"
                    }
                ])["_div"];

                GlobalUtilities.loading(_div);
                var showed = GlobalUtilities.show(_div);

                var _add_media = function (name, path) {
                    GlobalUtilities.create_nested_elements([
                        {
                            Type: "div", Class: "small-6 medium-4 large-3", Style: "padding:0.5rem;",
                            Childs: [
                                {
                                    Type: "middle",
                                    Childs: [
                                        {
                                            Type: "div", Class: "small-12 medium-12 large-12",
                                            Childs: [
                                                {
                                                    Type: "img", Class: "rv-border-radius-half",
                                                    Style: "max-width:100%; cursor:pointer;",
                                                    Attributes: [{ Name: "src", Value: path }],
                                                    Properties: [
                                                        {
                                                            Name: "onclick",
                                                            Value: function () {
                                                                //that.Objects.Editor.insertHtml('<img style="width:100px; height:100px;" src="' + path + '" />');
                                                                that.Objects.Editor.insertHtml('<img src="' + path + '" />');
                                                                showed.Close();
                                                            }
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            Type: "div", Class: "small-12 medium-12 large-12",
                                            Style: "text-align:center; margin-top:0.5rem;",
                                            Childs: [{Type: "text", TextValue: name}]
                                        }
                                    ]
                                }
                            ]
                        }
                    ], _div);
                };

                if (that.Options.GetMedia) that.Options.GetMedia(function (arr) {
                    _div.innerHTML = "";

                    for (var i = 0, lnt = arr.length; i < lnt; ++i)
                        _add_media(arr[i].Name, arr[i].URL);
                });
            });
        }
    }
})();