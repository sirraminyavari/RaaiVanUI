(function () {
    if (window.RSSViewer) return;

    window.RSSViewer = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;
        params = params || {};

        this.Options = {
            StoreAsNodeTypeID: params.StoreAsNodeTypeID,
            URLs: params.URLs,
            URLsDic: {},
            Count: params.Count || 10
        }

        for (var i = 0, lnt = (this.Options.URLs || []).length; i < lnt; ++i)
            this.Options.URLsDic[this.Options.URLs[i].ID] = this.Options.URLs[i];

        this._initialize();
    }

    RSSViewer.prototype = {
        _initialize: function () {
            var that = this;

            var strUrls = "";
            for (var i = 0, lnt = (that.Options.URLs || []).length; i < lnt; ++i)
                strUrls += (strUrls == "" ? "" : "|") + that.Options.URLs[i].URL + "," + that.Options.URLs[i].ID;

            RVAPI.RSS({ URLs: strUrls, Count: that.Options.Count, StoreAsNodeTypeID: that.Options.StoreAsNodeTypeID, ParseResults: true,
                ResponseHandler: function (result) {
                    var items = result.Items || [];

                    that.ContainerDiv.innerHTML = "";

                    for (var i = 0, lnt = items.length; i < lnt; ++i) {
                        items[i].Title = Base64.decode(items[i].Title);
                        items[i].Summary = Base64.decode(items[i].Summary);
                        items[i].Description = Base64.decode(items[i].Description);
                        items[i].Link = Base64.decode(items[i].Link);

                        if (i > 0) {
                            GlobalUtilities.create_nested_elements([
                                { Type: "hr", Class: "SoftShadow", Style: "margin:4px 40px 4px 40px; color:rgb(240,240,240);" }
                            ], that.ContainerDiv);
                        }

                        that._add_item(items[i]);
                    }
                }
            });
        },

        _add_item: function (itm) {
            var that = this;

            var trimmed = GlobalUtilities.trim2pix(itm.Title, 500, { Postfix: "..." });

            GlobalUtilities.create_nested_elements([
                { Type: "div", Class: "NormalPadding", Style: "cursor:pointer;",
                    Tooltip: trimmed == itm.Title ? null : itm.Title,
                    Link: itm.Link ? itm.Link : null, Params: { Open: true },
                    Properties: [
                        { Name: "onmouseover", Value: function () { this.classList.add("SoftBackgroundColor"); } },
                        { Name: "onmouseout", Value: function () { this.classList.remove("SoftBackgroundColor"); } }
                    ],
                    Childs: [
                        { Type: "div", Class: "Float TextAlign", Style: "width:38px; height:38px;",
                            Childs: [
                                { Type: "img", Style: "width:30px; height:30px;",
                                    Attributes: [{ Name: "src", Value: that.Options.URLsDic[itm.ID].IconURL}]
                                }
                            ]
                        },
                        { Type: "div", Style: "text-align:justify; font-size:x-small;", Childs: [{ Type: "text", TextValue: trimmed}] },
                        { Type: "div", Style: "clear:both;" },
                        { Type: "div", Class: "Float", Style: "color:gray; font-size:x-small;",
                            Childs: [{ Type: "text", TextValue: that.Options.URLsDic[itm.ID].Name}]
                        },
                        { Type: "div", Class: "RevFloat", Style: "color:green; font-size:x-small; font-family:BKoodak;",
                            Childs: [{ Type: "text", TextValue: itm.PublicationDate}]
                        },
                        { Type: "div", Style: "clear:both;" }
                    ]
                }
            ], that.ContainerDiv);
        }
    }
})();