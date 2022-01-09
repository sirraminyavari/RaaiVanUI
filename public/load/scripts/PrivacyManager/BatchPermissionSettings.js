(function () {
    if (window.BatchPermissionSettings) return;

    window.BatchPermissionSettings = function (container, params) {
        this.Container = typeof (container) == "object" ? container : document.getElementById(container);
        if (!this.Container) return;
        params = params || {};
        
        this.Interface = {
            Groups: null,
            Users: null,
            Items: null
        };
        
        this.Objects = {
            Sections: params.Sections || [],
            Permissions: (params.Sections || []).map(sec => sec.Items || []).flat()
                .reduce((obj, itm) => (obj[itm.ID] = {}, obj), {}),
            ConfidentialityLevels: [],
            Roles: [],
            SelectedRole: null
        };
        
        this.Options = GlobalUtilities.extend({
            Title: params.Title,
            ObjectType: params.ObjectType,
            PermissionType: params.PermissionType,
            IgnoreConfidentialities: params.IgnoreConfidentialities,
            OnCancel: null,
            OnSave: null
        }, params.Options || {});

        this.preload();
    };

    BatchPermissionSettings.prototype = {
        preload: function () {
            var that = this;

            GlobalUtilities.load_files([{ Root: "API/", Ext: "js", Childs: ["CNAPI", "UsersAPI", "PrivacyAPI"] }], {
                OnLoad: function () {
                    PrivacyAPI.GetAudience({
                        ObjectIDs: that.Objects.Sections.map(s => s.Items || []).flat().map(itm => itm.ID).join("|"),
                        ObjectType: that.Options.ObjectType, ParseResults: true,
                        ResponseHandler: function (results) {
                            results = results || {};

                            that.Objects.ConfidentialityLevels = (results.ConfidentialityLevels || [])
                                .map(conf => GlobalUtilities.extend(conf, { Title: Base64.decode(conf.Title) }));

                            Object.keys(that.Objects.Permissions).filter(key => !!that.Objects.Permissions[key]).forEach(key => {
                                that.Objects.Permissions[key] = {
                                    ConfidentialityID: ((results.Items[key] || {}).Confidentiality || {}).ID,
                                    Audience: ((results.Items[key] || {}).Audience || []).map(itm => itm.RoleID)
                                };
                            });

                            var roles = {};

                            Object.keys(results.Items || {}).map(key => results.Items[key].Audience).flat().forEach(aud => {
                                roles[aud.RoleID] = {
                                    RoleID: aud.RoleID,
                                    RoleName: Base64.decode(aud.RoleName),
                                    RoleType: Base64.decode(aud.RoleType),
                                    AdditionalID: Base64.decode(aud.AdditionalID)
                                };
                            });
                            
                            that.Objects.Roles = Object.keys(roles).map(key => roles[key]).sort((a, b) => a.RoleID < b.RoleID);

                            that.initialize();
                        }
                    });
                }
            });
        },

        initialize: function () {
            var that = this;

            that.Container.innerHTML = "";
            
            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Style: "display:flex; flex-flow:column; height:100%;",
                Childs: [
                    {
                        Type: "div", Class: "rv-title", Style: "flex:0 0 auto;",
                        Childs: [{ Type: "text", TextValue: that.Options.Title || RVDic.AccessSettings }]
                    },
                    {
                        Type: "div", Style: "flex:1 1 auto;",
                        Childs: [{
                            Type: "div", Class: "small-12 medium-12 large-12 row", Style: "height:100%;",
                            Childs: [
                                {
                                    Type: "div", Class: "small-12 medium-4 large-3",
                                    Childs: [{ Name: "groups", Title: RVDic.Groups }, { Name: "users", Title: RVDic.Users }].map((itm, ind) => ({
                                        Type: "div", Style: "position:relative; height:50%;" + (ind ? "padding-top" : "padding-bottom") + ":0.5rem;",
                                        Childs: [
                                            {
                                                Type: "div", Class: "SoftBackgroundColor",
                                                Style: "position:absolute; top:" + (ind ? "-0.1rem" : "-0.6rem") + ";" +
                                                    RV_Float + ":0.5rem; padding:0 0.5rem;",
                                                Childs: [{ Type: "text", TextValue: itm.Title }]
                                            },
                                            {
                                                Type: "div", Class: "rv-trim-vertical-margins rv-border-radius-quarter SoftBorder",
                                                Style: "height:100%; border-color:rgb(180,180,180); padding-top:0.7rem;" +
                                                    "display:flex; flex-flow:column;",
                                                Childs: [
                                                    {
                                                        Type: "div", Style: "flex:0 0 auto; text-align:center; padding:0.3rem 20%; font-size:0.7rem;",
                                                        Childs: [{
                                                            Type: "div", Class: "rv-air-button rv-circle",
                                                            Properties: [{
                                                                Name: "onclick",
                                                                Value: () => itm.Name == "groups" ? that.new_group() : that.new_user()
                                                            }],
                                                            Childs: [
                                                                { Type: "i", Class: "fa fa-plus", Style: "margin-" + RV_RevFloat + ":0.5rem;" },
                                                                { Type: "text", TextValue: RVDic.Add }
                                                            ]
                                                        }]
                                                    },
                                                    { Type: "div", Style: "flex:1 1 auto;", Name: itm.Name }
                                                ]
                                            }
                                        ]
                                    }))
                                },
                                { Type: "div", Class: "small-12 medium-8 large-9 rv-trim-vertical-margins", Name: "items" }
                            ]
                        }]
                    },
                    {
                        Type: "div", Style: "flex:0 0 auto; padding-top:1rem; display:flex; flex-flow:row; justify-content:center;",
                        Childs: [
                            {
                                Type: "div", Class: "rv-air-button rv-circle",
                                Style: "flex:0 0 auto; width:8rem; margin:0 1rem;",
                                Properties: [{ Name: "onclick", Value: () => { if (that.Options.OnCancel) that.Options.OnCancel(); } }],
                                Childs: [{ Type: "text", TextValue: RVDic.Cancel }]
                            },
                            {
                                Type: "div", Class: "rv-air-button rv-circle",
                                Style: "flex:0 0 auto; width:8rem; margin:0 1rem;",
                                Properties: [{ Name: "onclick", Value: () => that.save() }],
                                Childs: [{ Type: "text", TextValue: RVDic.Save }]
                            }
                        ]
                    }
                ]
            }], that.Container);

            //append scrollbar
            that.Interface.Groups = GlobalUtilities.append_scrollbar(elems["groups"], { AutoHeight: false });
            that.Interface.Groups.style.padding = "0.2rem 1.1rem";

            that.Interface.Users = GlobalUtilities.append_scrollbar(elems["users"], { AutoHeight: false });
            that.Interface.Users.style.padding = "0.2rem 1.1rem";

            that.Interface.Items = GlobalUtilities.append_scrollbar(elems["items"], { AutoHeight: false });
            that.Interface.Items.style.padding = "0 0.7rem";
            //end of append scrollbar

            that.Objects.Roles.filter(r => r.RoleType == "Node").forEach(r => that.add_role(that.Interface.Groups, r));
            that.Objects.Roles.filter(r => r.RoleType == "User").forEach(r => that.add_role(that.Interface.Users, r));

            that.rebuild_items();
        },

        add_role: function (container, role, select) {
            var that = this;

            if (!(role || {}).RoleID) return;

            var is_selected = () => (that.Objects.SelectedRole || {}).RoleID == role.RoleID;

            var get_class = () => "rv-border-radius-quarter SoftShadow " +
                (is_selected() ? "rv-bg-color-softer-soft SoftBorder" : "rv-bg-color-white-softer");

            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: get_class(), Name: "container",
                Style: "display:flex; flex-flow:row; align-items:center; padding:0.3rem;" +
                    "margin:0.3rem 0; cursor:pointer; font-size:0.7rem;",
                Properties: [{
                    Name: "onclick",
                    Value: () => {
                        that.Objects.SelectedRole = role;
                        that.rebuild_items();
                        that.Objects.Roles.filter(r => !!r.set_appearance).forEach(r => r.set_appearance());
                    }
                }],
                Childs: [
                    {
                        Type: "div", Style: "flex:1 1 auto; padding-" + RV_RevFloat + ":0.5rem;",
                        Childs: [{ Type: "text", TextValue: role.RoleName }]
                    },
                    {
                        Type: "div", Class: "rv-icon-button", Style: "flex:0 0 auto;",
                        Properties: [{
                            Name: "onclick",
                            Value: (e) => {
                                e.stopPropagation();
                                jQuery(elems["container"]).fadeOut(500, () => jQuery(elems["container"]).remove());

                                that.Objects.Roles = that.Objects.Roles.filter(r => r.RoleID != role.RoleID);

                                Object.keys(that.Objects.Permissions || {})
                                    .map(key => that.Objects.Permissions[key])
                                    .filter(p => ((p || {}).Audience || []).length)
                                    .forEach(p => p.Audience = p.Audience.filter(a => a != role.RoleID));

                                if ((that.Objects.SelectedRole || {}).RoleID == role.RoleID) {
                                    that.Objects.SelectedRole = null;
                                    that.rebuild_items();
                                }
                            }
                        }],
                        Childs: [{ Type: "i", Class: "fa fa-times" }]
                    }
                ]
            }], container);

            role.set_appearance = () => elems["container"].setAttribute("class", get_class());

            if (select) jQuery(elems["container"]).click();
        },

        rebuild_items: function () {
            var that = this;

            var roleId = (that.Objects.SelectedRole || {}).RoleID;

            that.Interface.Items.innerHTML = "";

            if (!roleId && that.Options.IgnoreConfidentialities) {
                return GlobalUtilities.create_nested_elements([{
                    Type: "div",
                    Style: "font-weight:700; font-size:1.2rem; text-align:center; padding:3rem 0; color:rgb(120,120,120);",
                    Childs: [{ Type: "text", TextValue: RVDic.Checks.PleaseSelectAGroupOrAUser }]
                }], that.Interface.Items);
            }

            var singleSection = (that.Objects.Sections || []).length == 1;
            
            var elems = GlobalUtilities.create_nested_elements((that.Objects.Sections || []).map(sec => {
                var secName = "sec_" + sec.Name;
                var arrowName = secName + "_arrow";
                var checkAllName = secName + "_check_all";
                var itemCheckBoxClass = "item-checkbox";
                
                var is_open = (value) => {
                    if (singleSection) return true;

                    if (GlobalUtilities.get_type(value) == "boolean")
                        that.Objects.Sections.filter(s => s.Name == sec.Name)[0].IsOpen = value;
                    return !!that.Objects.Sections.filter(s => s.Name == sec.Name)[0].IsOpen;
                };
                
                var get_arrow_class = () => is_open() ? "fa fa-chevron-up" : "fa fa-chevron-down";

                var itemsCount = (sec.Items || []).length;
                var get_checked_count = () => (sec.Items || [])
                    .filter(itm => ((that.Objects.Permissions[itm.ID] || {}).Audience || []).some(a => a == roleId)).length;

                var get_check_all_class = () => "fa " + (itemsCount == get_checked_count() ? "fa-check-square-o" :
                    (get_checked_count() ? "fa-minus-square-o" : "fa-square-o")) + " fa-lg";

                var set_check_all_class = () => elems[checkAllName].setAttribute("class", get_check_all_class());
                
                var checkAll = () => [].forEach.call(elems[secName].getElementsByClassName(itemCheckBoxClass), x => x.Check());
                var uncheckAll = () => [].forEach.call(elems[secName].getElementsByClassName(itemCheckBoxClass), x => x.Uncheck());
                
                return {
                    Type: "div",
                    Style: "margin:0.5rem 0; padding:0.5rem;",
                    Childs: [
                        {
                            Type: "div", Style: "display:flex; flex-flow:row; align-items:center;",
                            Childs: [
                                (!roleId ? null : {
                                    Type: "div",
                                    Style: "flex:0 0 auto; display:flex; align-items:center; cursor:pointer;",
                                    Properties: [{
                                        Name: "onclick",
                                        Value: (e) => {
                                            e.stopPropagation();

                                            if (get_checked_count()) uncheckAll();
                                            else checkAll();

                                            set_check_all_class();
                                        }
                                    }],
                                    Childs: [{ Type: "i", Class: get_check_all_class(), Name: checkAllName }]
                                }),
                                {
                                    Type: "div", Style: "flex:0 0 auto; cursor:pointer; padding:0 0.5rem;",
                                    Properties: [{
                                        Name: "onclick",
                                        Value: () => {
                                            jQuery(elems[secName]).animate({ height: 'toggle' }, 500);
                                            is_open(!is_open());
                                            console.log(that.Objects.Sections.filter(s => s.Name == sec.Name));
                                            elems[arrowName].setAttribute("class", get_arrow_class());
                                        }
                                    }],
                                    Childs: [{ Type: "text", TextValue: sec.Title }]
                                },
                                (singleSection ? null : {
                                    Type: "div", Style: "flex:0 0 auto; display:flex; align-items:center;",
                                    Childs: [{ Type: "i", Class: get_arrow_class(), Name: arrowName, Style: "color:rgb(150,150,150);" }]
                                })
                            ]
                        },
                        {
                            Type: "div", Style: (is_open() ? "" : "display:none;"), Name: secName,
                            Childs: (sec.Items || []).map(itm => {
                                var selectedConfId = (that.Objects.Permissions[itm.ID] || {}).ConfidentialityID;
                                var perObj = that.Objects.Permissions[itm.ID] || {};

                                return {
                                    Type: "div", Class: "rv-border-radius-quarter rv-bg-color-white-softer SoftShadow",
                                    Style: "display:flex; flex-flow:row; margin:0.5rem 0; padding:0.5rem;",
                                    Childs: [
                                        (!roleId ? null : {
                                            Type: "div", Style: "flex:0 0 auto; padding-" + RV_RevFloat + ":0.5rem;",
                                            Childs: [{
                                                Type: "checkbox", Class: itemCheckBoxClass,
                                                Style: "width:1rem; height:1rem; cursor:pointer;",
                                                Params: {
                                                    Checked: (perObj.Audience || []).some(a => a == roleId),
                                                    OnChange: function () {
                                                        if (this.Checked) {
                                                            if (!(perObj.Audience || []).some(a => a == roleId))
                                                                (perObj.Audience || []).push(roleId);
                                                        }
                                                        else perObj.Audience = (perObj.Audience || []).filter(a => a != roleId);
                                                        
                                                        set_check_all_class();
                                                    }
                                                }
                                            }]
                                        }),
                                        {
                                            Type: "div", Style: "flex:1 1 auto;",
                                            Childs: [{ Type: "text", TextValue: itm.Title }]
                                        },
                                        (that.Options.IgnoreConfidentialities ? null : {
                                            Type: "div", Style: "flex:0 0 auto;",
                                            Childs: [{
                                                Type: "select", Class: "rv-input", Style: "font-size:0.6rem; padding:0.1rem;",
                                                Properties: [{
                                                    Name: "onchange",
                                                    Value: function () {
                                                        (that.Objects.Permissions[itm.ID] || {}).ConfidentialityID =
                                                            this.options[this.selectedIndex].value;
                                                    }
                                                }],
                                                Childs: [{
                                                    Type: "option",
                                                    Childs: [{ Type: "text", TextValue: RVDic.ConfidentialityLevel + "..." }]
                                                }].concat((that.Objects.ConfidentialityLevels || []).map(conf => ({
                                                    Type: "option",
                                                    Attributes: [
                                                        { Name: "value", Value: conf.ID },
                                                        (selectedConfId != conf.ID ? null : { Name: "selected", Value: true })
                                                    ],
                                                    Childs: [{ Type: "text", TextValue: Base64.decode(conf.Title) }]
                                                })))
                                            }]
                                        })
                                    ]
                                };
                            })
                        }
                    ]
                };
            }), that.Interface.Items);
        },

        new_user: function () {
            var that = this;

            if (that.__UserListContainer) {
                that.__ShowedUserList = GlobalUtilities.show(that.__UserListContainer);
                return;
            }

            var _div = that.__UserListContainer = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-10 medium-8 large-6 rv-border-radius-1 SoftBackgroundColor",
                Style: "margin:0 auto; padding:1rem;", Name: "_div"
            }])["_div"];

            that.__ShowedUserList = GlobalUtilities.show(_div);
            GlobalUtilities.loading(_div);

            GlobalUtilities.load_files(["USR/UserSelect.js"], {
                OnLoad: function () {
                    new UserSelect(_div, {
                        Options: {
                            HideSelectedItems: true,
                            OnSelect: function (user) {
                                that.__ShowedUserList.Close();
                                
                                if (!that.Objects.Roles.some(r => r.RoleID == user.UserID)) {
                                    var newUser = {
                                        RoleID: user.UserID,
                                        RoleName: user.FullName,
                                        RoleType: "User",
                                        AdditionalID: user.UserName
                                    };

                                    that.Objects.Roles.push(newUser);

                                    that.add_role(that.Interface.Users, newUser, true);
                                }
                            }
                        }
                    });
                }
            });
        },

        new_group: function () {
            var that = this;

            if (that.__NoGroupExists)
                return alert(RVDic.MSG.CannotFindAnyGroups);
            else if (that.__NodeListContainer) {
                that.__ShowedNodeList = GlobalUtilities.show(that.__NodeListContainer);
                return;
            }

            var _div = that.__NodeListContainer = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-11 medium-11 large-10 rv-border-radius-1 SoftBackgroundColor",
                Style: "margin:0 auto; padding:1rem;", Name: "_div"
            }])["_div"];

            that.__ShowedNodeList = GlobalUtilities.show(_div);
            GlobalUtilities.loading(_div);

            GlobalUtilities.load_files(["Ontology/NodeSelect.js"], {
                OnLoad: function () {
                    CNAPI.GetNodeTypes({
                        Extensions: ["Members", "Group", "Experts"].join(","), ParseResults: true,
                        ResponseHandler: function (result) {
                            if (!(result.NodeTypes || []).length) {
                                that.__ShowedNodeList.Close();
                                that.__NoGroupExists = true;
                                return alert(RVDic.MSG.CannotFindAnyGroups);
                            }

                            new NodeSelect(_div, {
                                Options: {
                                    Title: RVDic.NodeSelect,
                                    NodeTypeSearchBox: false,
                                    HideSelectedItems: true,
                                    Filters: false,
                                    Limits: { NodeTypes: result.NodeTypes || [] },
                                    OnSelect: function (node) {
                                        that.__ShowedNodeList.Close();

                                        if (!that.Objects.Roles.some(r => r.RoleID == node.NodeID)) {
                                            var newNode = {
                                                RoleID: node.NodeID,
                                                RoleName: node.Name,
                                                RoleType: "Node",
                                                AdditionalID: node.AdditionalID
                                            };

                                            that.Objects.Roles.push(newNode);

                                            that.add_role(that.Interface.Groups, newNode, true);
                                        }
                                    },
                                    OnCancel: function () { that.__ShowedNodeList.Close(); }
                                }
                            });
                        }
                    });
                }
            });
        },

        save: function () {
            var that = this;

            if (that.__Saving) return;
            that.__Saving = true;

            var data = {};

            Object.keys(that.Objects.Permissions || {}).forEach(key => {
                data[key] = {
                    Confidentiality: {
                        ID: that.Objects.Permissions[key].ConfidentialityID
                    },
                    CalculateHierarchy: false,
                    Audience: (that.Objects.Permissions[key].Audience || []).map(aud => ({
                        RoleID: aud,
                        PermissionType: that.Options.PermissionType,
                        Allow: true
                    }))
                };
            });
            
            PrivacyAPI.SetAudience({
                ObjectType: that.Options.ObjectType, Data: Base64.encode(JSON.stringify(data)), ParseResults: true,
                ResponseHandler: function (result) {
                    that.__Saving = false;

                    var msg = (result || {}).Succeed || (result || {}).ErrorText;
                    alert(RVDic.MSG[msg] || msg);
                    if ((result || {}).Succeed && that.Options.OnSave) that.Options.OnSave(data);
                }
            });
        }
    }
})();