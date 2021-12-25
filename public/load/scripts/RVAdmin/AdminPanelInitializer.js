(function () {
    if (window.AdminPanelInitializer) return;

    window.AdminPanelInitializer = function (container) {
        var that = this;

        GlobalUtilities.load_files(["API/PrivacyAPI.js"], {
            OnLoad: function () { that.initialize(container); }
        });
    };

    AdminPanelInitializer.prototype = {
        initialize: function (settingsArea) {
            var that = this;

            var permissions = [
                { Name: "Settings", Icon: "Settings300.png", URL: "systemsettings" },
                { Name: "UsersManagement", Icon: "User128.png", URL: "users" },
                { Name: "ManageConfidentialityLevels", Icon: "UserConfidentiality240.png", URL: "confidentiality" },
                { Name: "UserGroupsManagement", Icon: "Group.png", OnClick: () => that.access_roles() },
                { Name: "ManageOntology", Icon: "Graph.png", URL: "map" },
                { Name: "KnowledgeAdmin", Icon: "Audit200.png", URL: "knowledge" },
                { Name: "ContentsManagement", Icon: "Ledgers240.png", URL: "documents" },
                { Name: "ManageForms", Icon: "Forms240.png", URL: "forms" },
                { Name: "ManagePolls", Icon: "Poll.png", URL: "polls" },
                { Name: "ManageWorkflow", Icon: "Workflow240.png", URL: "workflows" },
                { Name: "ManageQA", Icon: "Question.png", URL: "qa" },
                { Name: "DataImport", Icon: "DataImport128.png", URL: "dataimport" },
                { Name: "SMSEMailNotifier", Icon: "Notification128.png", URL: "externalnotifications" },
                { Name: "RemoteServers", Icon: "remote_server.png", URL: "remoteservers" }
            ];

            var permissionsDic = {};

            for (var i = 0; i < permissions.length; ++i)
                permissionsDic[permissions[i].Name] = permissions[i];

            GlobalUtilities.load_files(["API/PrivacyAPI.js"], {
                OnLoad: function () {
                    PrivacyAPI.CheckAuthority({
                        Permissions: permissions.map(p => p.Name).join("|"), ParseResults: true,
                        ResponseHandler: function (result) {
                            if ((window.RVGlobal || {}).IsSystemAdmin) _add_item(settingsArea, permissions[0].Name);

                            for (var i = 1; i < permissions.length; ++i)
                                if (result[permissions[i].Name]) _add_item(settingsArea, permissions[i].Name);
                        }
                    });
                }
            });

            var _add_item = function (container, name) {
                if (!permissionsDic[name]) return;

                var modules = (window.RVGlobal || {}).Modules || {};

                if (((name == "KnowledgeAdmin") && !modules.KnowledgeAdmin) ||
                    ((name == "ContentsManagement") && !modules.DCT) ||
                    ((name == "ManageForms") && !modules.FG) ||
                    ((name == "ManagePolls") && !modules.FG) ||
                    ((name == "ManageWorkflow") && !modules.WF) ||
                    ((name == "ManageQA") && !modules.QAAdmin) ||
                    ((name == "SMSEMailNotifier") && !modules.SMSEMailNotifier) ||
                    ((name == "RemoteServers") && RVGlobal.SAASBasedMultiTenancy)) return;

                GlobalUtilities.create_nested_elements([{
                    Type: "div", Class: "small-12 medium-4 large-3", Style: "padding:0.1rem;",
                    Childs: [{
                        Type: "div", Style: "padding:0.5rem; height:100%;",
                        Class: "small-12 medium-12 large-12 rv-border-radius-half rv-air-button",
                        Link: !permissionsDic[name].URL ? null : "../../configuration/" + permissionsDic[name].URL,
                        Params: { IgnoreMouseEvents: true },
                        Properties: !permissionsDic[name].OnClick ? [] : [{
                            Name: "onclick", Value: permissionsDic[name].OnClick
                        }],
                        Childs: [{
                            Type: "middle", Class: "small-12 medium-12 large-12",
                            Style: "text-align:center;",
                            Childs: [
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12", Name: "image",
                                    Childs: [{
                                        Type: "img", Style: "width:6rem; height:6rem;",
                                        Attributes: [{ Name: "src", Value: GlobalUtilities.icon(permissionsDic[name].Icon) }]
                                    }]
                                },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12",
                                    Style: "font-size:1.2rem; margin-top:1rem; text-transform:capitalize;",
                                    Childs: [{ Type: "text", TextValue: RVDic.PRVC[name] || RVDic[name] || name }]
                                }
                            ]
                        }]
                    }]
                }], container);
            };
        },

        access_roles: function () {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-10 medium-9 large-8 rv-border-radius-1 SoftBackgroundColor",
                Style: "padding:1rem; margin:0 auto; height:calc(100vh - 10vw);", Name: "container"
            }]);

            var sections = [{
                Name: "",
                Title: "",
                Items: (RVGlobal.AccessRoles || []).map(r => ({
                    ID: r.ID,
                    Title: RVDic.PRVC[r.Name] || RVDic[r.Name] || r.Name
                }))
            }];
            
            GlobalUtilities.loading(elems["container"]);
            var showed = GlobalUtilities.show(elems["container"]);

            GlobalUtilities.load_files(["PrivacyManager/BatchPermissionSettings.js"], {
                OnLoad: function () {
                    new BatchPermissionSettings(elems["container"], {
                        Sections: sections,
                        Options: {
                            Title: RVDic.PRVC.UserGroupsManagement,
                            ObjectType: "AccessRole",
                            PermissionType: "View",
                            IgnoreConfidentialities: true,
                            OnCancel: () => showed.Close(),
                            OnSave: () => showed.Close()
                        }
                    });
                }
            });
        }
    };
})();