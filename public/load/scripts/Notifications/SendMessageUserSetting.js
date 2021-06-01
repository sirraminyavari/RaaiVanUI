(function () {
    if (window.SendMessageUserSetting) return;

    window.SendMessageUserSetting = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;
        params = params || {};
        var that = this;
        
        this.Objects = {
            UserID: params.UserID,
            CurrentUserID: params.CurrentUserID,
            IsSystemAdmin: params.IsSystemAdmin === true,
            Editable: params.Editable,
            ActivationOptions: {}
        }

        GlobalUtilities.load_files(["API/NotificationsAPI.js"], { OnLoad: function () { that._preinit(params); } });
    };

    SendMessageUserSetting.prototype = {
        _preinit: function (params) {
            var that = this;

            NotificationsAPI.GetUserMessagingActivation({
                UserID: that.Objects.UserID, ParseResults: true,
                ResponseHandler: function (result) {
                    if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                    else that._initialize(result.Items);
                }
            });
        },

        _initialize: function (items) {
            items = items || [];
            var that = this;

            that.ContainerDiv.innerHTML = "";
            
            var itemsDic = {};

            jQuery.each(items, function (ind, val) {
                var subjectType = val.SubjectTypeName;

                jQuery.each(val.Actions || [], function (i, action) {
                    var actionName = action.ActionName;

                    jQuery.each(action.Audience || [], function (loc, aud) {
                        var audienceName = aud.Name;

                        var smsMedia = (aud.Media || []).filter(function (m) {
                            return ((m.Name || "_").toLowerCase() == "sms") && m.EnabledByAdmin;
                        });

                        var emailMedia = (aud.Media || []).filter(function (m) {
                            return ((m.Name || "_").toLowerCase() == "email") && m.EnabledByAdmin;
                        });

                        itemsDic[(subjectType + "_" + actionName + "_" + audienceName).toLowerCase()] = {
                            SubjectType: subjectType, ActionName: actionName, AudienceType: audienceName,
                            SMS: {
                                Enabled: !smsMedia.length ? null : smsMedia[0].Enabled,
                                OptionID: !smsMedia.length ? null : smsMedia[0].OptionID,
                            },
                            Email: {
                                Enabled: !emailMedia.length ? null : emailMedia[0].Enabled,
                                OptionID: !emailMedia.length ? null : emailMedia[0].OptionID
                            }
                        };

                    });
                });
            });

            for (var key in ((RVDic.NTFN || {}).SubjectType_Action || {})) {
                var entry = RVDic.NTFN.SubjectType_Action[key];

                for (var aud in (entry.Audience || {})) {
                    var dicEntryName = (key + "_" + aud).toLowerCase();
                    
                    if (itemsDic[dicEntryName]) that.add_item(that.ContainerDiv, {
                        Title: entry.Title,
                        SubTitle: entry.Audience[aud].User,
                        Data: itemsDic[dicEntryName]
                    });
                }
            }

            if (!that.ContainerDiv.firstChild) return GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Name: "_div",
                    Style: "font-size:1.2rem; padding:1rem 0; text-align:center; color:rgb(100,100,100);",
                    Childs: [{ Type: "text", TextValue: RVDic.NothingToDisplay }]
                }
            ], that.ContainerDiv);
        },

        add_item: function (container, params) {
            params = params || {};
            var that = this;

            var data = params.Data || {};

            if (!params.Title || !params.SubTitle ||
                ((data.SMS.Enabled === null) && (data.Email.Enabled === null))) return;

            var checkboxesCount = 0;

            var create_checkbox = function (options) {
                options = options || {};

                if (data[options.ValueKey].Enabled === null) return null;

                ++checkboxesCount;

                var width = 7;
                var margin = 0.5 + ((checkboxesCount - 1) * width);

                var processing = false;

                return {
                    Type: "div",
                    Style: "position:absolute; top:0.5rem;" + RV_RevFloat + ":" + margin + "rem; width:" + width + "rem;",
                    Childs: [
                        {
                            Type: "checkbox", Params: {
                                Checked: data[options.ValueKey].Enabled, Width: 18, Height: 18,
                                OnClick: function (e, done) {
                                    e.preventDefault();
                                    
                                    if (processing) return;
                                    processing = true;

                                    var newValue = !this.Checked;
                                    
                                    NotificationsAPI.SetUserMessagingActivation({
                                        UserID: that.Objects.UserID, OptionID: data[options.ValueKey].OptionID,
                                        SubjectType: data.SubjectType, UserStatus: data.AudienceType,
                                        Action: data.ActionName, Media: options.ValueKey, Enable: newValue, ParseResults: true,
                                        ResponseHandler: function (result) {
                                            processing = false;
                                            if (result.ErrorText) {
                                                done(false);
                                                return alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                                            }
                                            data[options.ValueKey].Enabled = newValue;
                                            data[options.ValueKey].OptionID = data[options.ValueKey].OptionID || result.OptionID;
                                            done(true);
                                        }
                                    });
                                }
                            }
                        },
                        {
                            Type: "div", Style: "display:inline-block; margin-" + RV_Float + ":0.5rem; font-size:0.7rem;",
                            Childs: [{ Type: "text", TextValue: options.Title }]
                        }
                    ]
                };
            };

            GlobalUtilities.create_nested_elements([
                {
                    Type: "div",
                    Class: "small-12 medium-12 large-12 rv-border-radius-half rv-bg-color-white-softer SoftShadow",
                    Style: "position:relative; margin-bottom:0.5rem; padding:0.5rem; padding-" + RV_RevFloat + ":15rem;",
                    Childs: [
                        create_checkbox({ ValueKey: "Email", Title: RVDic.Email }),
                        create_checkbox({ ValueKey: "SMS", Title: RVDic.SMS }),
                        {
                            Type: "div", Style: "display:inline-block; font-weight:bold; margin-" + RV_RevFloat + ":0.5rem;",
                            Childs: [{ Type: "text", TextValue: params.Title }]
                        },
                        {
                            Type: "div", Style: "display:inline-block;",
                            Childs: [{ Type: "text", TextValue: params.SubTitle }]
                        }
                    ]
                }
            ], container);
        },

        _set_user_options_userStatuses: function (container, mediaParams) {
            var that = this;

            var subjectType = mediaParams.SubjectType;
            var action = mediaParams.Action;
            var statusInfo = mediaParams.Status;

            var _userStatus = statusInfo.UserStatusName;

            var _mediaOne = statusInfo.Media[0].MediaName;
            var _mediaTwo = statusInfo.Media[1].MediaName;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "SoftBackgroundColor NormalPadding SoftBorder BorderRadius4", Style: "margin-top:4px;",
                    Childs: [
                        { Type: "div", Style: "margin-bottom:6px;", Childs: [{ Type: "text", TextValue: RVDic[_userStatus] || _userStatus }] },
                        {
                            Type: "div", Class: "Float", Style: "margin-" + RV_RevFloat + ":10px;",
                            Childs: [
                                {
                                    Type: "checkbox", Class: "Float", Style: "width:16px; height:16px; cursor:pointer;",
                                    Params: {
                                        Checked: !!statusInfo.Media[0].Enable,
                                        OnClick: function (e, done) {
                                            e.preventDefault();
                                            if (!statusInfo.Media[0].AdminEnable) {
                                                alert("این گزینه توسط ادمین غیر فعال شده است");
                                                done(false);
                                                return;
                                            }
                                            else {
                                                var chb = this;

                                                NotificationsAPI.SetUserMessagingActivation({
                                                    UserID: that.Objects.UserID, OptionID: statusInfo.Media[0].OptionID,
                                                    SubjectType: subjectType, UserStatus: statusInfo.UserStatusName, Action: action, Media: statusInfo.Media[0].MediaName,
                                                    Language: statusInfo.Language, Enable: this.Checked ? "false" : "true",
                                                    ResponseHandler: function (responseText) {

                                                        var result = JSON.parse(responseText);

                                                        if (result.ErrorText) {
                                                            alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                                                            chb.Checked = !chb.Checked;
                                                            done(false);
                                                        }
                                                        else {
                                                            done();
                                                            statusInfo.Media[0].Enable = chb.Checked;
                                                            statusInfo.Media[0].OptionID = result.OptionID;

                                                        }

                                                    }
                                                });
                                            }
                                        }
                                    }
                                },
                                {
                                    Type: "div", Class: "Float",
                                    Style: "margin:0px 4px 0px 4px;" + (statusInfo.Media[0].AdminEnable ? "" : "color:gray;"),
                                    Childs: [{ Type: "text", TextValue: RVDic[_mediaOne] || _mediaOne }]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "Float", Style: "margin-" + RV_RevFloat + ":10px;",
                            Childs: [
                                {
                                    Type: "checkbox", Class: "Float", Style: "width:16px; height:16px; cursor:pointer;",
                                    Params: {
                                        Checked: !!statusInfo.Media[1].Enable,
                                        OnClick: function (e, done) {
                                            e.preventDefault();
                                            if (!statusInfo.Media[1].AdminEnable) {
                                                alert("این گزینه توسط ادمین غیر فعال شده است");
                                                done(false);
                                                return;
                                            }
                                            else {
                                                var chb = this;

                                                NotificationsAPI.SetUserMessagingActivation({
                                                    UserID: that.Objects.UserID, OptionID: statusInfo.Media[1].OptionID,
                                                    SubjectType: subjectType, UserStatus: statusInfo.UserStatusName, Action: action, Media: statusInfo.Media[1].MediaName,
                                                    Language: statusInfo.Language, Enable: this.Checked ? "false" : "true",
                                                    ResponseHandler: function (responseText) {
                                                        var result = JSON.parse(responseText);

                                                        if (result.ErrorText) {
                                                            alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                                                            chb.Checked = !chb.Checked;
                                                            done(false);
                                                        }
                                                        else {
                                                            done();
                                                            statusInfo.Media[1].Enable = chb.Checked;
                                                            statusInfo.Media[1].OptionID = result.OptionID;

                                                        }
                                                    }
                                                });
                                            }
                                        }
                                    }
                                },
                                {
                                    Type: "div", Class: "Float",
                                    Style: "margin:0px 4px 0px 4px;" + (statusInfo.Media[1].AdminEnable ? "" : "color:gray;"),
                                    Childs: [{ Type: "text", TextValue: RVDic[_mediaTwo] || _mediaTwo }]
                                }
                            ]
                        },
                        { Type: "div", Style: "clear:both;" }
                    ]
                }
            ], container);
        },

        reset: function (userId) {
            var that = this;

            if ((that.Objects.UserID || "") != "" && that.Objects.UserID == userId) return;
            that.Objects.UserID = userId || that.Objects.UserID;

            that.Objects.Editable = that.Objects.IsSystemAdmin === true ||
                (String(that.Objects.CurrentUserID || "").toLowerCase() == String(that.Objects.UserID || "").toLowerCase());

            that.Objects.ActivationOptions = {};
            that.Objects.SubjectTypesDiv.innerHTML = "";
            that.Objects.UserStatusesDiv.innerHTML = "";
            GlobalUtilities.block(that.ContainerDiv);

            NotificationsAPI.GetUserMessagingActivation({
                UserID: that.Objects.UserID,
                ResponseHandler: function (responseText) {
                    var result = JSON.parse(responseText);

                    if (result.ErrorText) {
                        alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                    }
                    else {
                        that.Objects.ActivationOptions = result.MessagingActivation;

                        for (var i = 0; i < that.Objects.ActivationOptions.length; i++) {
                            var _subjectType = _subjectType || {};
                            var _action = _action || {};
                            var _stDiv = null;
                            var _actnDiv = null;

                            _subjectType = that.Objects.ActivationOptions[i].SubjectTypeName;
                            _stDiv = GlobalUtilities.create_nested_elements([
                            {
                                Type: "div", Class: "Float NormalPadding", Style: "width:300px;", Name: _subjectType + "ActionsDiv",
                                Childs: [
                                    { Type: "text", TextValue: RVDic[_subjectType] },
                                    { Type: "hr", Style: "margin-bottom:1px; width:308px;" }
                                ]
                            },
                            { Type: "div", Style: "clear:both;" }
                            ], that.Objects.SubjectTypesDiv);

                            for (var j = 0; j < that.Objects.ActivationOptions[i].Actions.length; j++) {
                                _action = that.Objects.ActivationOptions[i].Actions[j].ActionName;

                                _actnDiv = GlobalUtilities.create_nested_elements(
                                [{ Type: "div", Name: _subjectType + _action }], _stDiv[_subjectType + "ActionsDiv"]);

                                that.set_user_options_actions(_actnDiv[_subjectType + _action],
                                { SubjectType: _subjectType, Action: that.Objects.ActivationOptions[i].Actions[j] });
                            }
                        }
                    }
                }
            });

            GlobalUtilities.unblock(that.ContainerDiv);
        }
    }
})();;