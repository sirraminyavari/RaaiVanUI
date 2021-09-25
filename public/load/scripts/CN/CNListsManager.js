(function () {
    if (window.CNListsManager) return;

    window.CNListsManager = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;
        params = params || {};

        this.Interface = {
            ItemsArea: null
        };

        this.Objects = {
            NodeTypeID: params.NodeTypeID,
            NodeType: params.NodeType,
            Lists: []
        };

        var that = this;

        GlobalUtilities.load_files(["API/CNAPI.js"], { OnLoad: function () { that._preinit(); } });
    }

    CNListsManager.prototype = {
        _preinit: function () {
            var that = this;

            CNAPI.GetLists({
                NodeTypeID: that.Objects.NodeTypeID, ParseResults: true,
                ResponseHandler: function (result) {
                    that._initialize(GlobalUtilities.get_type(result) == "array" ? result : (result || {}).Lists || []);
                }
            });
        },

        _initialize: function (lists) {
            var that = this;

            that.ContainerDiv.innerHTML = "";

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Style: "text-align:center; font-weight:bold;",
                    Childs: [{ Type: "text", TextValue: RVDic.CN.NodeTypeComplexes.replace("[NodeType]", that.Objects.NodeType || RVDic.NodeType) }]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Style: "margin-top:1rem;",
                    Childs: [
                        {
                            Type: "input", Class: "rv-input", Name: "_input",
                            Style: "width:100%; font-size:0.7rem;", InnerTitle: RVDic.NewComplexName + "..."
                        }
                    ]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12 rv-trim-vertical-margins",
                    Style: "margin-top:1rem;", Name: "itemsArea"
                }
            ], that.ContainerDiv);

            that.Interface.ItemsArea = elems["itemsArea"];

            GlobalUtilities.set_onenter(elems["_input"], function () {
                var listName = GlobalUtilities.trim(elems["_input"].value);
                elems["_input"].value = "";

                if (!listName) return;

                CNAPI.AddComplex({
                    NodeTypeID: that.Objects.NodeTypeID, Name: Base64.encode(listName), ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                        else that.add_list(result.List);
                    }
                });
            });

            for (var i = 0, lnt = (lists || []).length; i < lnt; ++i)
                that.add_list(lists[i]);
        },

        add_list: function (list) {
            var that = this;

            if (!list) return;

            list.Name = Base64.decode(list.Name);

            that.Objects.Lists[list.ListID] = list;

            var create_button = function (p) {
                p = p || {};

                return {
                    Type: "i", Class: "fa " + p.Icon + " fa-lg rv-icon-button", Name: p.Name,
                    Style: "margin-" + RV_RevFloat + ":0.5rem; cursor:pointer;", Tooltip: p.Tooltip,
                    Attributes: [{ Name: "aria-hidden", Value: true }],
                    Properties: !p.OnClick ? null : [{ Name: "onclick", Value: p.OnClick }]
                };
            };

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Name: "containerDiv",
                    Class: "small-12 medium-12 large-12 rv-border-radius-quarter rv-bg-color-trans-white SoftBorder",
                    Style: "position:relative; padding:0.3rem; margin-bottom:0.3rem; padding-" + RV_Float + ":7rem;",
                    Childs: [
                        {
                            Type: "div", Style: "position:absolute; top:0.3rem;" + RV_Float + ":0.3rem;",
                            Childs: [
                                create_button({
                                    Icon: "fa-times", Tooltip: RVDic.Remove,
                                    OnClick: function () { that.remove_list(list.ListID, elems["containerDiv"]); }
                                }),
                                create_button({
                                    Icon: "fa-cubes", Tooltip: RVDic.ComplexNodes,
                                    OnClick: function () { that.manage_list_nodes(list.ListID); }
                                }),
                                create_button({
                                    Icon: "fa-user", Tooltip: RVDic.Managers,
                                    OnClick: function () { that.manage_admins(list.ListID); }
                                }),
                                create_button({ Icon: "fa-pencil", Tooltip: RVDic.Edit, Name: "editButton" })
                            ]
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "viewArea" },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Style: "display:none;", Name: "editArea",
                            Childs: [
                                {
                                    Type: "input", Class: "rv-input", Name: "titleInput",
                                    Style: "width:100%; font-size:0.7rem;"
                                }
                            ]
                        }
                    ]
                }
            ], that.Interface.ItemsArea);

            var viewArea = elems["viewArea"];
            var editArea = elems["editArea"];
            var editButton = elems["editButton"];
            var titleInput = elems["titleInput"];

            var _set_data = function () {
                GlobalUtilities.set_text(viewArea,
                    GlobalUtilities.convert_numbers_to_persian(GlobalUtilities.secure_string(list.Name)));

                titleInput.value = list.Name;
            };

            var _on_edit = function () {
                var set_things = function () {
                    editArea.style.display = editButton.__Editing ? "block" : "none";
                    viewArea.style.display = editButton.__Editing ? "none" : "block";

                    _set_data();

                    editButton.setAttribute("class",
                        "fa " + (editButton.__Editing ? "fa-floppy-o" : "fa-pencil") + " fa-lg rv-icon-button");
                    GlobalUtilities.append_tooltip(editButton, editButton.__Editing ? RVDic.Save : RVDic.Edit);
                };

                if (editButton.__Editing === true) {
                    var newName = GlobalUtilities.trim(titleInput.value);

                    if (!newName) return alert(RVDic.Checks.NCannotBeEmpty.replace("[n]", RVDic.Title));

                    GlobalUtilities.block(elems["containerDiv"]);

                    CNAPI.ModifyComplex({
                        ListID: list.ListID, Name: Base64.encode(newName),
                        ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText)
                                alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else {
                                list.Name = newName;
                                editButton.__Editing = false;
                                set_things();
                            }

                            GlobalUtilities.unblock(elems["containerDiv"]);
                        }
                    });
                }
                else editButton.__Editing = true;

                set_things();
            }; //end of _on_edit

            editButton.onclick = _on_edit;
            _set_data();
        },

        remove_list: function (listId, containerDiv) {
            var that = this;

            GlobalUtilities.confirm(RVDic.Confirms.DoYouWantToRemoveTheComplex, function (result) {
                if (!result) return;

                CNAPI.RemoveComplex({
                    ListID: listId, ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                        else {
                            that.Objects.Lists[listId] = null;
                            containerDiv.parentNode.removeChild(containerDiv);
                        }
                    }
                });
            });
        },

        manage_admins: function (listId) {
            var that = this;

            var _name = RVDic.CN.NodeTypeComplexAdmins.replace("[Name]", that.Objects.Lists[listId].Name)
                .replace("[NodeType]", that.Objects.NodeType || RVDic.NodeType);
            _name = GlobalUtilities.secure_string(_name);

            that.__ComplexAdmins = that.__ComplexAdmins || {};

            if (that.__ComplexAdmins[listId]) {
                GlobalUtilities.set_text(that.__ComplexAdmins[listId].Title, _name);
                return GlobalUtilities.show(that.__ComplexAdmins[listId].Container);
            }

            that.__ComplexAdmins[listId] = { Container: null, Title: null };

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-9 large-8 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0rem auto; padding:1rem;", Name: "container",
                    Childs: [
                        {
                            Type: "div", Name: "_title", Style: "font-weight:bold; text-align:center; margin-bottom:1rem;",
                            Childs: [{ Type: "text", TextValue: _name }]
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "content" }
                    ]
                }
            ]);

            that.__ComplexAdmins[listId].Container = elems["container"];
            that.__ComplexAdmins[listId].Title = elems["_title"];

            var contentDiv = elems["content"];

            GlobalUtilities.loading(contentDiv);
            GlobalUtilities.show(that.__ComplexAdmins[listId].Container);

            GlobalUtilities.load_files([{ Root: "API/", Ext: "js", Childs: ["CNAPI"] }, "USR/RelatedUsersManager.js"], {
                OnLoad: function () {
                    new RelatedUsersManager(contentDiv, {
                        Options: {
                            Editable: true,
                            Title: null,
                            TitleStyle: "margin:0px;",
                            ItemsAreaStyle: "margin-top:8px;",
                            RemoveConfirm: RVDic.Confirms.DoYouWantToRemoveTheComplexAdmin,
                            OnBeforeUsersGet: function (e, done) {
                                e.preventDefault();

                                CNAPI.GetComplexAdmins({
                                    ListID: listId,
                                    ParseResults: true,
                                    ResponseHandler: function (result) { done(result.Users); }
                                });
                            },
                            OnBeforeAdd: function (e, done) {
                                e.preventDefault();

                                CNAPI.AddComplexAdmin({
                                    ListID: listId, UserID: e.User.UserID,
                                    ParseResults: true,
                                    ResponseHandler: function (result) {
                                        if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                                        else done(result.User);
                                    }
                                });
                            },
                            OnBeforeRemove: function (e, done) {
                                e.preventDefault();

                                CNAPI.RemoveComplexAdmin({
                                    ListID: listId, UserID: e.User.UserID,
                                    ParseResults: true,
                                    ResponseHandler: function (result) {
                                        if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                                        else done();
                                    }
                                });
                            }
                        }
                    });
                }
            });
        },

        manage_list_nodes: function (listId) {
            var that = this;

            var _name = RVDic.CN.NodeTypeComplexNodes.replace("[Name]", that.Objects.Lists[listId].Name)
                .replace("[NodeType]", that.Objects.NodeType || RVDic.NodeType);
            _name = GlobalUtilities.secure_string(_name);

            that.__ComplexNodes = that.__ComplexNodes || {};

            if (that.__ComplexNodes[listId]) {
                GlobalUtilities.set_text(that.__ComplexAdmins[listId].Title, _name);
                return GlobalUtilities.show(that.__ComplexNodes[listId].Container);
            }

            that.__ComplexNodes[listId] = { Container: null, Title: null };

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-9 large-8 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0rem auto; padding:1rem;", Name: "container",
                    Childs: [
                        {
                            Type: "div", Name: "_title", Style: "font-weight:bold; text-align:center; margin-bottom:1rem;",
                            Childs: [{ Type: "text", TextValue: _name }]
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "content" }
                    ]
                }
            ]);

            that.__ComplexNodes[listId].Container = elems["container"];
            that.__ComplexNodes[listId].Title = elems["_title"];

            var contentDiv = elems["content"];

            GlobalUtilities.loading(contentDiv);
            GlobalUtilities.show(that.__ComplexNodes[listId].Container);

            GlobalUtilities.load_files([{ Root: "API/", Ext: "js", Childs: ["CNAPI"] }, "CN/ListNodesManager.js"], {
                OnLoad: function () {
                    new ListNodesManager(contentDiv, {
                        ListID: listId,
                        NodeTypeID: that.Objects.NodeTypeID,
                        NodeType: that.Objects.NodeType,
                        Options: { Editable: true }
                    });
                }
            });
        }
    }
})();