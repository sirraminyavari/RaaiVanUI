(function () {
    if (window.SpecialUsers) return;

    window.SpecialUsers = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;
        params = params || {};

        this.Objects = {
            NodeTypeID: params.NodeTypeID || "",
            ServiceAdminMode: params.ServiceAdminMode === true
        };

        var that = this;

        GlobalUtilities.load_files([{ Root: "API/", Ext: "js", Childs: ["CNAPI"] }, "USR/RelatedUsersManager.js"], {
            OnLoad: function () {
                new RelatedUsersManager(that.ContainerDiv, {
                    Options: {
                        Editable: true,
                        Title: that.Objects.ServiceAdminMode ? "" : RVDic.CN.Service.FreeUsers,
                        InputStyle: "width:100%; margin-bottom:0.5rem;",
                        OnBeforeUsersGet: function (e, done) {
                            e.preventDefault();

                            if (!that.Objects.ServiceAdminMode) done(params.FreeUsers || []);
                            else {
                                CNAPI.GetServiceAdmins({
                                    NodeTypeID: that.Objects.NodeTypeID, ParseResults: true,
                                    ResponseHandler: function (result) { done(result.ServiceAdmins || []); }
                                });
                            }
                        },
                        OnBeforeAdd: function (e, done) {
                            e.preventDefault();

                            CNAPI[that.Objects.ServiceAdminMode ? "AddServiceAdmin" : "AddFreeUser"]({
                                NodeTypeID: that.Objects.NodeTypeID, UserID: e.User.UserID,
                                ParseResults: true,
                                ResponseHandler: function (result) {
                                    if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                                    else done(result.User);
                                }
                            });
                        },
                        OnBeforeRemove: function (e, done) {
                            e.preventDefault();

                            CNAPI[that.Objects.ServiceAdminMode ? "RemoveServiceAdmin" : "RemoveFreeUser"]({
                                NodeTypeID: that.Objects.NodeTypeID, UserID: e.User.UserID,
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
    }
})();