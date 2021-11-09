(function () {
    if (window.PermissionSetting) return;

    window.PermissionSetting = function (container, params) {
        this.ContainerDiv = typeof (container) == "object" ? container : document.getElementById(container);
        if (!this.ContainerDiv) return;
        params = params || {};

        this.Interface = {
            ConfidentialitySelect: null,
            DefaultPermissions: null,
            HierarchyCheckbox: null,
            ItemsArea: null
        };

        this.Objects = {
            ObjectID: params.ObjectID,
            SelectedItems: [],
            RolesDic: {},
            PrivacyData: null
        };

        this.Options = GlobalUtilities.extend({
            ObjectType: null,
            ConfidentialitySelect: false,
            PermissionTypes: [],
            PermissionTypesWithDefaultValue: ["Create", "View", "ViewAbstract", "ViewRelatedItems", "Download"],
            OnInit: null,
            OnSave: null,
            DontSave: false
        }, params.Options || {});

        var that = this;

        //Check PermissionTypesWithDefaultValue
        var arr = [];

        jQuery.each(that.Options.PermissionTypesWithDefaultValue || [], function (ind, val) {
            var yes = false;
            for (var i = 0; i < (that.Options.PermissionTypes || []).length; ++i)
                if (val == that.Options.PermissionTypes[i]) yes = true;
            if (yes) arr.push(val);
        });

        that.Options.PermissionTypesWithDefaultValue = arr;
        //end of Check PermissionTypesWithDefaultValue

        this.preload();
    }

    PermissionSetting.prototype = {
        preload: function () {
            var that = this;
            
            GlobalUtilities.load_files([{ Root: "API/", Ext: "js", Childs: ["CNAPI", "UsersAPI", "PrivacyAPI"] }], {
                OnLoad: function () {
                    PrivacyAPI.GetAudience({
                        ObjectID: that.Objects.ObjectID, ObjectType: that.Options.ObjectType, ParseResults: true,
                        ResponseHandler: function (results) {
                            if ((results || {}).Items) that.Objects.PrivacyData = results.Items;

                            that.initialize(results);

                            if (that.Options.OnInit) that.Options.OnInit();
                        }
                    });
                }
            });
        },

        initialize: function (data) {
            var that = this;
            data = data || {};

            //Check if has view permission: to allow the user set the default permission
            var hasViewPermission = false;

            jQuery.each(that.Options.PermissionTypes || [], function (ind, val) {
                if (val.toLowerCase() == "view") hasViewPermission = true;
            });
            //end of Check if has view permission

            that.ContainerDiv.innerHTML = "";

            var singleDefaultPermission = (that.Options.PermissionTypesWithDefaultValue || []).length == 1;

            var _add_option = function (slct, p) {
                GlobalUtilities.create_nested_elements([{
                    Type: "option",
                    Attributes: [{ Name: "title", Value: p.ID }],
                    Properties: [{ Name: "TheName", Value: !p.ID ? null : p.Title }],
                    Childs: [{ Type: "text", TextValue: p.Title }]
                }], slct);
            };

            var privacyElems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-quarter rv-bg-color-trans-white",
                    Style: "margin-bottom:1rem; position:relative; padding:0.3rem; padding-" + RV_Float + ":8rem;" +
                        (that.Options.ConfidentialitySelect ? "" : "display:none;"),
                    Childs: [
                        {
                            Type: "div", Style: "position:absolute; top:0rem; bottom:0rem;" + RV_Float + ":0.3rem; width:7.5rem;",
                            Childs: [{ Type: "middle", Childs: [{ Type: "text", TextValue: RVDic.ConfidentialityLevel + ":" }] }]
                        },
                        { Type: "select", Class: "rv-input", Style: "width:100%; font-size:0.7rem;", Name: "slctConf" }
                    ]
                },
                {
                    Type: "div", Name: "defaultPermissions",
                    Class: "small-12 medium-12 large-12 row rv-border-radius-quarter rv-bg-color-trans-white",
                    Style: "margin:0rem; margin-bottom:1rem; padding:0.3rem;" +
                        ((that.Options.PermissionTypesWithDefaultValue || []).length ? "" : "display:none;"),
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "margin-bottom:0.5rem;" + (singleDefaultPermission ? "display:none;" : ""),
                            Childs: [{ Type: "text", TextValue: RVDic.PRVC.SelectDefaultPermissions }]
                        }
                    ]
                },
                {
                    Type: "div", Name: "hierarchyArea",
                    Class: "small-12 medium-12 large-12 rv-border-radius-quarter rv-bg-color-trans-white",
                    Style: "position:relative; margin-bottom:1rem; padding:0.3rem;" +
                        "padding-" + RV_Float + ":2.2rem; min-height:1.9rem; cursor:pointer;",
                    Properties: [{ Name: "onclick", Value: function () { privacyElems["hierarchyCheckbox"][privacyElems["hierarchyCheckbox"].Checked ? "uncheck" : "check"]({ StopOnChange: true }); } }],
                    Childs: [
                        {
                            Type: "div", Style: "position:absolute; top:0.3rem;" + RV_Float + ":0.3rem;",
                            Childs: [{ Type: "checkbox", Name: "hierarchyCheckbox" }]
                        },
                        {
                            Type: "div", Style: "display:inline-block;",
                            Childs: [{ Type: "text", TextValue: RVDic.PRVC.CalculateHierarchy }]
                        }
                    ]
                },
                {
                    Type: "div", Style: "margin:0rem; padding:0.3rem;",
                    Class: "small-12 medium-12 large-12 row rv-border-radius-quarter rv-bg-color-trans-white",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "padding-" + RV_RevFloat + ":1rem; margin-bottom:0.5rem; font-weight:bold; text-align:center;",
                            Childs: [{ Type: "middle", Childs: [{ Type: "text", TextValue: RVDic.PRVC.RolesAndPermissions }] }]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "itemTypeArea",
                            Style: "position:relative; margin-bottom:0.5rem; padding-" + RV_Float + ":8rem;",
                            Childs: [
                                {
                                    Type: "div", Style: "position:absolute; top:0rem; bottom:0rem;" + RV_Float + ":0rem;",
                                    Childs: [{ Type: "middle", Childs: [{ Type: "text", TextValue: RVDic.PRVC.AddRoleOfType }] }]
                                },
                                { Type: "select", Class: "rv-input", Name: "itemTypeSelect", Style: "width:100%; font-size:0.7rem;" }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 row",
                            Style: "margin:0rem;", Name: "itemSelectArea",
                            Childs: [
                                {
                                    Type: "div", Class: "small-12 medium-6 large-6", Name: "itemTypeAutosuggestDiv",
                                    Style: "display:none; padding-" + RV_RevFloat + ":1rem;"
                                },
                                { Type: "div", Class: "small-12 medium-12 large-12", Name: "itemAutosuggestDiv" }
                            ]
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "itemsArea", Style: "margin-top:0.5rem;" }
                    ]
                },
                {
                    Type: "div", Class: "small-10 medium-7 large-4 rv-air-button rv-circle",
                    Style: "margin:1.5rem auto 0rem auto;", Name: "saveButton",
                    Childs: [
                        (that.Options.DontSave ? null : {
                            Type: "i", Class: "fa fa-save fa-lg", Style: "margin-" + RV_RevFloat + ":0.5rem;",
                            Attributes: [{ Name: "aria-hidden", Value: true }]
                        }),
                        { Type: "text", TextValue: that.Options.DontSave ? RVDic.Confirm : RVDic.Save }
                    ]
                }
            ], that.ContainerDiv);

            var itemTypeSelect = privacyElems["itemTypeSelect"];
            var hierarchyCheckbox = that.Interface.HierarchyCheckbox = privacyElems["hierarchyCheckbox"];
            var itemsArea = that.Interface.ItemsArea = privacyElems["itemsArea"];
            that.Interface.ConfidentialitySelect = privacyElems["slctConf"];
            that.Interface.DefaultPermissions = privacyElems["defaultPermissions"];
            
            //Set Confidentiality Level
            _add_option(that.Interface.ConfidentialitySelect, { ID: null, Title: RVDic.Select + "..." });
            
            jQuery.each(data.ConfidentialityLevels || [], function (ind, val) {
                _add_option(that.Interface.ConfidentialitySelect, { ID: val.ID, Title: Base64.decode(val.Title) });
            });

            var confLevelId = (((data.Items || {})[that.Objects.ObjectID] || {}).Confidentiality || {}).ID;
            
            for (var i = 0, lnt = that.Interface.ConfidentialitySelect.length; i < lnt; ++i)
                if (that.Interface.ConfidentialitySelect[i].title == confLevelId) that.Interface.ConfidentialitySelect.selectedIndex = i;
            //end of Set Confidentiality Level

            _add_option(itemTypeSelect, { ID: "User", Title: RVDic.User });
            _add_option(itemTypeSelect, { ID: "Node", Title: RVDic.Group });

            var _add_default_permission = function (itemName) {
                var dp = (((data || {}).Items || {})[that.Objects.ObjectID] || {}).DefaultPermissions || [];
                var isSelected = null;

                jQuery.each(dp, function (ind, val) {
                    if ((val.PermissionType == itemName) && (val.DefaultValue == "Public")) isSelected = true;
                    else if ((val.PermissionType == itemName) && (val.DefaultValue == "Restricted")) isSelected = false;
                });

                var cls = singleDefaultPermission ? "small-12 medium-12 large-12" : "small-12 medium-6 large-4";
                var ttl = RVDic.PRVC.PermissionTypes[itemName] || itemName;

                if (singleDefaultPermission) ttl = RVDic.PRVC.SelectDefaultPermissionN.replace("[n]", "'" + ttl + "'");

                var dpElems = GlobalUtilities.create_nested_elements([{
                    Type: "div", Class: cls, Style: "padding:0.3rem;", Name: "container",
                    Childs: [
                        {
                            Type: "div",
                            Class: "small-12 medium-12 large-12 rv-border-radius-quarter rv-bg-color-white-softer SoftShadow",
                            Style: "position:relative; padding:0.3rem; padding-" + RV_Float + ":2rem; cursor:pointer;",
                            Properties: [{
                                Name: "onclick", Value: function () {
                                    var curVal = dpElems["chb"].Checked;
                                    var nextFunc = curVal === true ? "uncheck" : (curVal === false ? "clear" : "check");
                                    dpElems["chb"][nextFunc]({ StopOnChange: true });
                                }
                            }],
                            Childs: [
                                {
                                    Type: "div", Style: "position:absolute; top:0rem; bottom:0rem;" + RV_Float + ":0.3rem;",
                                    Childs: [{
                                        Type: "middle",
                                        Childs: [{
                                            Type: "checkbox", Name: "chb", Style: "width:1rem; height:1rem; cursor:pointer;",
                                            Params: { ThreeState: true, Checked: isSelected }
                                        }]
                                    }]
                                },
                                { Type: "text", TextValue: ttl }
                            ]
                        }
                    ]
                }], that.Interface.DefaultPermissions);

                dpElems["container"].Get = function () {
                    var theVal = dpElems["chb"].Checked === true ? "Public" :
                        (dpElems["chb"].Checked === false ? "Restricted" : null);
                    return { PermissionType: itemName, DefaultValue: theVal };
                };
            };

            jQuery.each(that.Options.PermissionTypesWithDefaultValue || [], function (ind, val) { _add_default_permission(val); });

            privacyElems["saveButton"].onclick = function () {
                if (that.processing()) return;

                var confidentialityId = !that.Options.ConfidentialitySelect || !that.Interface.ConfidentialitySelect ? null :
                    that.Interface.ConfidentialitySelect[that.Interface.ConfidentialitySelect.selectedIndex].title;
                var confidentialityTitle = !confidentialityId ? null :
                    that.Interface.ConfidentialitySelect[that.Interface.ConfidentialitySelect.selectedIndex].TheName;
                var calculateHierarchy = that.Interface.HierarchyCheckbox.checked;
                var defaultPermissions = [];
                var audience = [];
                
                var first = that.Interface.DefaultPermissions.firstChild;
                while (first) {
                    if (first.Get && first.Get()) defaultPermissions.push(first.Get());
                    first = first.nextSibling;
                }

                first = that.Interface.ItemsArea.firstChild;
                while (first) {
                    if (first.Get && first.Get()) audience.push(first.Get());
                    first = first.nextSibling;
                }
                
                var data = {};

                data[that.Objects.ObjectID] = {
                    Confidentiality: {
                        ID: confidentialityId,
                        Title: Base64.encode(confidentialityTitle)
                    },
                    CalculateHierarchy: calculateHierarchy,
                    Audience: [],
                    DefaultPermissions: []
                };

                jQuery.each(audience || [], function (ind, val) {
                    jQuery.each((val || {}).Permissions || [], function (i, v) {
                        data[that.Objects.ObjectID].Audience.push({
                            RoleID: val.RoleID,
                            PermissionType: v.PermissionType,
                            Allow: v.Allow,
                            ExpirationDate: v.ExpirationDate
                        });
                    });
                });

                jQuery.each(defaultPermissions || [], function (ind, val) {
                    data[that.Objects.ObjectID].DefaultPermissions.push({
                        PermissionType: val.PermissionType,
                        DefaultValue: val.DefaultValue
                    });
                });

                if (that.Options.DontSave) {
                    that.Objects.PrivacyData = data;
                    if (that.Options.OnSave) that.Options.OnSave(data);
                    return;
                }
                
                that.processing(true);

                PrivacyAPI.SetAudience({
                    ObjectType: that.Options.ObjectType, Data: Base64.encode(JSON.stringify(data)), ParseResults: true,
                    ResponseHandler: function (result) {
                        var msg = result.Succeed || result.ErrorText;
                        alert(RVDic.MSG[msg] || msg);
                        that.processing(false);
                        if (result.Succeed && that.Options.OnSave) that.Options.OnSave(data);
                    }
                });
            }

            var ass = { ItemAutosuggest: null, NodeTypes: [] };

            var itemTypeContainer = privacyElems["itemTypeAutosuggestDiv"];
            var itemTypeSelect = privacyElems["itemTypeSelect"];

            itemTypeSelect.onchange = function () {
                var itemType = this[this.selectedIndex].title;
                itemTypeContainer.style.display = itemType == "Node" ? "block" : "none";
                ass.ItemAutosuggest.clear({ ClearURL: true });
                
                if (itemType == "User") {
                    ass.ItemAutosuggest.bindURL(UsersAPI.GetUsersDataSource());
                    GlobalUtilities.set_inner_title(ass.ItemAutosuggest.InputElement, RVDic.UserSelect + "...");
                    privacyElems["itemAutosuggestDiv"].setAttribute("class", "small-12 medium-12 large-12");
                }
                else if (itemType == "Node") {
                    ass.ItemAutosuggest.bindURL(CNAPI.GetNodesDataSource());
                    GlobalUtilities.set_inner_title(ass.ItemAutosuggest.InputElement, RVDic.NodeSelect + "...");
                    privacyElems["itemAutosuggestDiv"].setAttribute("class", "small-12 medium-6 large-6");
                }
            };

            var itemTypeAutosuggest = GlobalUtilities.append_autosuggest(itemTypeContainer, {
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.7rem;",
                InnerTitle: RVDic.NodeTypeSelect + "...",
                AjaxDataSource: CNAPI.GetNodeTypesDataSource({ Extensions: ["Group", "Members", "Experts"].join(",") }),
                ResponseParser: function (responseText) {
                    var nodeTypes = JSON.parse(responseText).NodeTypes || [];
                    var arr = [];
                    for (var i = 0, lnt = nodeTypes.length; i < lnt; ++i)
                        arr.push([Base64.decode(nodeTypes[i].TypeName || ""), nodeTypes[i].NodeTypeID]);
                    return arr;
                },
                OnSelect: function () {
                    var nodeTypeId = this.values[this.selectedIndex], nodeType = this.keywords[this.selectedIndex];
                    var innerTitle = RVDic.SelectN.replace("[n]", nodeType) + "...";
                    ass.ItemAutosuggest.clear({ ClearURL: true });
                    ass.ItemAutosuggest.bindURL(CNAPI.GetNodesDataSource({ NodeTypeID: nodeTypeId }));
                    GlobalUtilities.set_inner_title(ass.ItemAutosuggest.InputElement, innerTitle);
                }
            });

            ass.ItemAutosuggest = GlobalUtilities.append_autosuggest(privacyElems["itemAutosuggestDiv"], {
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.7rem;",
                InnerTitle: RVDic.UserSelect + "...",
                AjaxDataSource: UsersAPI.GetUsersDataSource(),
                ResponseParser: function (responseText) {
                    var result = JSON.parse(responseText);
                    var items = result.Users || result.Nodes || [];
                    var arr = [];

                    jQuery.each(items, function (ind, val) {
                        var isNode = !!val.NodeID;
                        
                        var id = isNode ? val.NodeID : val.UserID;
                        var name = isNode ? Base64.decode(val.Name) :
                            Base64.decode(val.FirstName) + " " + Base64.decode(val.LastName);
                        var additionalId = isNode ? Base64.decode(val.AdditionalID) : Base64.decode(val.UserName);
                        var nodeType = isNode ? Base64.decode(val.NodeType) : null;

                        that.Objects.RolesDic[id] = {
                            RoleType: isNode ? "Node" : "User",
                            RoleName: name,
                            AdditionalID: additionalId,
                            NodeType: nodeType
                        };

                        arr.push([name + (additionalId && !isNode ? " - " + additionalId : ""), id]);
                    });

                    return arr;
                },
                OnSelect: function () {
                    var item = { RoleID: this.values[this.selectedIndex], RoleName: this.keywords[this.selectedIndex] };
                    this.InputElement.value = "";
                    if (that.has_item(item.RoleID)) return;
                    that.Objects.SelectedItems.push(item);
                    that.add_item(item);
                }
            });

            //////////////////////////////////////////////////////////////////////////////////////////////////

            var dt = ((data || {}).Items || {})[that.Objects.ObjectID] || {};

            if (dt.CalculateHierarchy) hierarchyCheckbox.check();

            var audienceDic = {};
            
            jQuery.each(dt.Audience || [], function (ind, val) {
                audienceDic[val.RoleID] = audienceDic[val.RoleID] || {
                    RoleID: val.RoleID,
                    RoleName: Base64.decode(val.RoleName),
                    RoleType: Base64.decode(val.RoleType),
                    NodeType: Base64.decode(val.NodeType),
                    AdditionalID: Base64.decode(val.AdditionalID),
                    Permissions: {}
                };

                audienceDic[val.RoleID].Permissions[val.PermissionType] = {
                    Allow: val.Allow,
                    ExpirationDate: val.ExpirationDate,
                    ExpirationDate_Locale: val.ExpirationDate_Locale
                };
            });

            for (var k in audienceDic) {
                that.Objects.SelectedItems.push(audienceDic[k]);
                that.add_item(audienceDic[k]);
            }
        },

        add_item: function (item) {
            var that = this;

            if (!item) return;

            var itemId = item.RoleID;
            var roleType = item.RoleType || (that.Objects.RolesDic[itemId] || {}).RoleType;
            var itemName = item.RoleName || (that.Objects.RolesDic[itemId] || {}).RoleName;
            var nodeType = item.NodeType || (that.Objects.RolesDic[itemId] || {}).NodeType;
            var additionalId = item.AdditionalID || (that.Objects.RolesDic[itemId] || {}).AdditionalID;
            
            var isUser = roleType == "User";

            if (String(itemId).toLowerCase() === String(that.Objects.ObjectID).toLowerCase()) return;

            var first = that.Interface.ItemsArea.firstChild;
            while (first) { if (first.ItemID == itemId) return; first = first.nextSibling; }

            var singlePermissionType = (that.Options.PermissionTypes || []).length == 1;
            
            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-quarter rv-bg-color-white-softer SoftShadow",
                    Style: "padding:0.3rem; margin-top:0.4rem; font-size:0.7rem; min-height:2.1rem;", Name: "itemArea",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "position:relative; padding-" + RV_Float + ":1.5rem;" +
                                "padding-" + RV_RevFloat + ":" + (singlePermissionType ? "0" : "4") + "rem;",
                            Childs: [
                                {
                                    Type: "div", Style: "position:absolute; top:0rem;" + RV_Float + ":0rem;",
                                    Childs: [
                                        {
                                            Type: "i", Class: "fa fa-times fa-lg rv-icon-button", Name: "removeButton", Tooltip: RVDic.Remove,
                                            Attributes: [{ Name: "aria-hidden", Value: true }]
                                        }
                                    ]
                                },
                                {
                                    Type: "div", Class: "rv-air-button rv-border-radius-quarter", Name: "permissionsButton",
                                    Style: "position:absolute; top:0rem;" + RV_RevFloat + ":0rem;" +
                                        "padding:0.1rem 0.3rem; font-size:0.7rem;" + (singlePermissionType ? "display:none;" : ""),
                                    Childs: [
                                        { Type: "i", Class: "fa fa-chevron-down", Style: "margin-" + RV_RevFloat + ":0.3rem;" },
                                        { Type: "text", TextValue: RVDic.Permissions }
                                    ]
                                },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12", Style: "font-size:0.8rem;",
                                    Childs: [
                                        {
                                            Type: "i", Class: "fa fa-user-o",
                                            Style: "margin-" + RV_RevFloat + ":0.5rem;" + (isUser ? "" : "display:none;")
                                        },
                                        { Type: "text", TextValue: itemName },
                                        {
                                            Type: "div", Class: "rv-border-radius-quarter SoftBorder",
                                            Style: "display:" + (additionalId ? "inline-block" : "none") + ";" +
                                                "margin-" + RV_Float + ":0.5rem; font-size:0.6rem; padding:0.1rem 0.2rem;" +
                                                "background-color:white; cursor:default;",
                                            Childs: [{ Type: "text", TextValue: additionalId }]
                                        },
                                        {
                                            Type: "div", Class: "rv-border-radius-quarter SoftBorder",
                                            Style: "display:" + (nodeType ? "inline-block" : "none") + ";" +
                                                "margin-" + RV_Float + ":0.5rem; font-size:0.6rem; padding:0.1rem 0.2rem;" +
                                                "background-color:white; cursor:default;",
                                            Childs: [{ Type: "text", TextValue: nodeType }]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 rv-trim-vertical-margins", Name: "permissions",
                            Style: singlePermissionType ? "padding:0.3rem; margin-top:0.5rem;" : "display:none;"
                        }
                    ]
                }
            ], that.Interface.ItemsArea);

            elems["itemArea"].ItemID = itemId;

            var _add_permission_type = function (typeName) {
                var dt = (item.Permissions || {})[typeName] || {};

                var perElems = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Name: "container",
                        Class: "small-12 medium-12 large-12 rv-border-radius-quarter rv-bg-color-white-softer SoftShadow", 
                        Style: "position:relative; padding:0.3rem; margin-bottom:0.3rem; padding-" + RV_Float + ":12rem;",
                        Childs: [
                            {
                                Type: "div", Style: "position:absolute; top:0rem; bottom:0rem;" + RV_Float + ":0.3rem; cursor:pointer;",
                                Properties: [{
                                    Name: "onclick",
                                    Value: function () {
                                        var val = perElems["chb"].Checked;
                                        perElems["chb"][val === null ? "check" : (val === true ? "uncheck" : "clear")]({ StopOnChange: true });
                                    }
                                }],
                                Childs: [
                                    {
                                        Type: "middle",
                                        Childs: [
                                            {
                                                Type: "checkbox", Style: "width:1rem; height:1rem; cursor:pointer;", Name: "chb",
                                                Params: { ThreeState: true, Checked: dt.Allow }
                                            },
                                            {
                                                Type: "div", Style: "display:inline-block; width:10rem; margin-" + RV_Float + ":0.5rem; font-size:0.9rem;",
                                                Childs: [{ Type: "text", TextValue: RVDic.PRVC.PermissionTypes[typeName] || typeName }]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                Type: "div", Class: "small-12 medium-12 large-12 RevDirection RevTextAlign",
                                Childs: [
                                    {
                                        Type: "div", Class: "Direction TextAlign", Style: "display:inline-block;",
                                        Childs: [
                                            {
                                                Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem;",
                                                Childs: [{ Type: "text", TextValue: RVDic.ExpirationDate + ":" }]
                                            },
                                            { Type: "div", Style: "display:inline-block;", Name: "expDate" }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ], elems["permissions"]);

                var expDate = null;

                GlobalUtilities.append_calendar(perElems["expDate"], { ClearButton: true }, function (cal) {
                    expDate = cal;
                    if (dt.ExpirationDate) expDate.Set({ Value: dt.ExpirationDate, Label: dt.ExpirationDate_Locale });
                });

                perElems["container"].Get = function () {
                    return perElems["chb"].Checked === null ? null : {
                        PermissionType: typeName,
                        Allow: perElems["chb"].Checked,
                        ExpirationDate: !expDate ? null : expDate.Get().Value,
                        ExpirationDate_Locale: !expDate ? null : expDate.Get().Label
                    };
                };
            };

            jQuery.each(that.Options.PermissionTypes || [], function (ind, val) { _add_permission_type(val); });

            var processing = false;

            elems["permissionsButton"].onclick = function () {
                if (processing) return;
                processing = true;

                var isHidden = elems["permissions"].style.display == "none";

                elems["permissionsButton"].innerHTML = "<i class='fa " + (isHidden ? "fa-chevron-up" : "fa-chevron-down") +
                    "' style='margin-" + RV_RevFloat + ":0.3rem;'></i>" + RVDic.Permissions;

                jQuery(elems["permissions"]).animate({
                    'height': "toggle",
                    'padding': isHidden ? "0.3rem" : "0rem",
                    'margin-top': isHidden ? "0.7rem" : "0rem"
                }, 500, function () { processing = false; });
            };

            elems["removeButton"].onclick = function () {
                var msg = RVDic.Confirms.DoYouWantToRemoveN.replace("[n]", "'" + itemName + "'");

                GlobalUtilities.confirm(msg, function (r) {
                    if (!r) return;

                    jQuery(elems["itemArea"]).fadeOut(500, function () { this.remove(); });
                    that.remove_item(itemId);
                });
            };

            elems["itemArea"].Get = function () {
                var arr = [];

                var first = elems["permissions"].firstChild;
                while (first) {
                    if (first.Get && first.Get()) arr.push(first.Get());
                    first = first.nextSibling;
                }

                return !arr.length ? null : { RoleID: itemId, RoleName: itemName, Permissions: arr };
            };
        },

        has_item: function (itemId) {
            for (var i = 0, lnt = this.Objects.SelectedItems.length; i < lnt; ++i)
                if ((this.Objects.SelectedItems[i] || {}).ID == itemId) return true;
            return false;
        },

        remove_item: function (itemId) {
            for (var i = 0, lnt = this.Objects.SelectedItems.length; i < lnt; ++i)
                if ((this.Objects.SelectedItems[i] || {}).ID == itemId) this.Objects.SelectedItems[i] = null;
        },

        clear: function () {
            this.Interface.ItemsArea.innerHTML = "";
            if (this.Interface.HierarchyCheckbox) this.Interface.HierarchyCheckbox.checked = false;
        },

        reset: function (params) {
            params = params || {};

            this.clear();
            this.Objects.ObjectID = params.ObjectID || this.Objects.ObjectID;
            this.Objects.SelectedItems = [];
        },

        processing: function (value) {
            var that = this;
            if (GlobalUtilities.get_type(value) == "boolean") that.__PROCESSING = value;
            else return !!that.__PROCESSING;
        },

        get_data: function () {
            return this.Objects.PrivacyData;
        }
    }
})();