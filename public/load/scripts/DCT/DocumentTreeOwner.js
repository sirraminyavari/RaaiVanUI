(function () {
    if (window.DocumentTreeOwner) return;

    window.DocumentTreeOwner = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;
        params = params || {};

        this.Objects = {
            OwnerID: params.OwnerID,
            SelectedTrees: {}
        };

        var that = this;

        GlobalUtilities.load_files(["API/DocsAPI.js"], { OnLoad: function () { that._preinit(); } });
    }

    DocumentTreeOwner.prototype = {
        _preinit: function () {
            var that = this;

            DocsAPI.GetOwnerTrees({
                OwnerID: that.Objects.OwnerID, ParseResults: true,
                ResponseHandler: function (result) {
                    that._initialize(result.Trees || []);
                }
            });
        },

        _initialize: function (trees) {
            var that = this;

            that.ContainerDiv.innerHTML = "";

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "position:relative; padding-" + RV_Float + ":12rem;",
                    Childs: [
                        {
                            Type: "div", Style: "position:absolute; top:0rem;" + RV_Float + ":1.5rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.CN.Service.DocumentTrees + ":" }]
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "treeInput" },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "itemsArea" }
                    ]
                }
            ], that.ContainerDiv);

            var _input = GlobalUtilities.append_autosuggest(elems["treeInput"], {
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.7rem;",
                InnerTitle: RVDic.DocumentTreeSelect + "...",
                OnSelect: function () {
                    var treeId = this.values[this.selectedIndex];
                    var treeName = this.keywords[this.selectedIndex];

                    if (that.Objects.SelectedTrees[treeId]) return;

                    GlobalUtilities.block(elems["treeInput"]);

                    DocsAPI.AddOwnerTree({
                        OwnerID: that.Objects.OwnerID, TreeID: treeId,
                        ParseResults: true,
                        ResponseHandler: function (result) {
                            if (!result.ErrorText) {
                                that.add_item(elems["itemsArea"], { ID: treeId, Title: treeName });
                                _input.empty();
                            }

                            GlobalUtilities.unblock(elems["treeInput"]);
                        }
                    });
                }
            });

            DocsAPI.GetTrees({
                ParseResults: true,
                ResponseHandler: function (result) {
                    var arr = [];
                    for (var i = 0, lnt = (result.Trees || []).length; i < lnt; ++i)
                        arr.push([Base64.decode(result.Trees[i].Title || ""), result.Trees[i].ID]);
                    _input.bindArray(arr);
                }
            });

            for (var i = 0, lnt = (trees || []).length; i < lnt; ++i)
                that.add_item(elems["itemsArea"], trees[i]);
        },

        add_item: function (container, params) {
            params = params || {};
            var that = this;

            var treeId = params.ID || "";
            var treeName = Base64.decode(params.Title || "");

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Name: "itemDiv",
                    Class: "small-12 medium-12 large-12 rv-border-radius-quarter SoftBorder",
                    Style: "position:relative; margin-top:0.3rem; padding:0.3rem; padding-" + RV_Float + ":1.5rem;",
                    Childs: [
                        {
                            Type: "div",
                            Style: "position:absolute; top:0.3rem;" + RV_Float + ":0.3rem;",
                            Childs: [
                                {
                                    Type: "i", Name: "removeButton", Tooltip: RVDic.Remove,
                                    Class: "fa fa-times fa-lg rv-icon-button",
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Style: "font-size:0.7rem;",
                            Childs: [{ Type: "text", TextValue: treeName }]
                        }
                    ]
                }
            ], container);

            that.Objects.SelectedTrees[treeId] = true;

            elems["removeButton"].onclick = function () {
                var btn = this;
                if (btn.Processing) return;

                var msg = RVDic.Confirms.DoYouWantToRemoveN.replace("[n]", "'" + treeName + "'");

                GlobalUtilities.confirm(msg, function (r) {
                    if (!r) return;

                    btn.Processing = true;

                    DocsAPI.RemoveOwnerTree({
                        OwnerID: that.Objects.OwnerID, TreeID: treeId, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText)
                                alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else {
                                jQuery(elems["itemDiv"]).fadeOut(500, function () { this.remove(); });
                                that.Objects.SelectedTrees[treeId] = false;
                            }

                            btn.Processing = false;
                        }
                    });
                });
            };
        }
    }
})();