(function () {
    if (window.UserInvitations) return;
    window.UserInvitations = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;
        params = params || {};
        var that = this;

        that.Objects = {
            Application: params.Application
        };

        GlobalUtilities.load_files(["API/UsersAPI.js", "AdvancedListViewer-v1/NewAdvancedListViewer.js"], {
            OnLoad: function () { that._initialize(that.ContainerDiv); }
        });
    };

    UserInvitations.prototype = {
        _initialize: function (containerDiv, items) {
            var that = this;
            that.ContainerDiv.innerHTML = "";

            new NewAdvancedListViewer(containerDiv, {
                _OnOptionsInit: function (containerDiv) { that._initialize_options(containerDiv) },
                OnOptionsReset: function () { that._reset_options(); },
                OnDataRequest: function (options, done) { that._get_items(options, done); },
                ItemBuilder: function (containerDiv, item, p) { that.build_item(containerDiv, item, p); }
            });
        },

        _initialize_options: function (container) { },

        _reset_options: function () { },

        _get_items: function (options, done) {
            var that = this;

            UsersAPI.GetUserInvitations(GlobalUtilities.extend(options || {}, {
                ApplicationID: that.Objects.Application.ApplicationID, ParseResults: true,
                ResponseHandler: function (result) {
                    result.Items = result.Invitations;
                    done(result);
                }
            }));
        },

        build_item: function (container, item, params) {
            var that = this;

            var invitationId = item.InvitationID;
            var userId = item.ReceiverUserID;
            var fullName = GlobalUtilities.trim((Base64.decode(item.ReceiverFirstName) || " ") + " " + (Base64.decode(item.ReceiverLastName) || " "));
            var email = Base64.decode(item.Email);
            var userImageUrl = item.ReceiverImageURL;
            var sendDate = item.SendDate;
            var activated = item.Activated === true;
            var userPageUrl = !userId ? "" : UsersAPI.UserPageURL({ UserID: userId });

            var trimedEmail = GlobalUtilities.trim2pix(email, 240, { Postfix: "..." });
            var trimedFullName = GlobalUtilities.trim2pix(fullName, 200, { Postfix: "..." });

            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div",
                Class: "small-12 medium-12 large-12 rv-border-radius-quarter rv-bg-color-white-softer SoftBorder SoftShadow",
                Style: "margin-top:0.3rem; padding:0.3rem; border-color:rgb(220,220,220);",
                Childs: [
                    {
                        Type: "div", Name: "invitationDiv",
                        Childs: [
                            {
                                Type: "div", Class: "Float", Name: "imgDiv",
                                Childs: [{ Type: "img", Name: "sendAgnImg", Style: "width:16px; height:16px; margin:0px 4px 0px 4px;" }]
                            },
                            {
                                Type: "div", Class: "Float", Style: "width:240px; margin-" + RV_RevFloat + ":4px;", Tooltip: (trimedEmail == email ? "" : email),
                                Childs: [{ Type: "text", TextValue: trimedEmail }]
                            },
                            {
                                Type: "div", Class: "Float", Style: "width:200px; height:16px; margin-" + RV_RevFloat + ":4px;", Link: userPageUrl,
                                Tooltip: (trimedFullName == fullName ? "" : fullName),
                                Childs: [{ Type: "text", TextValue: trimedFullName }]
                            },
                            {
                                Type: "div", Class: "Float", Style: "width:130px; margin-" + RV_RevFloat + ":4px;",
                                Childs: [
                                    {
                                        Type: "img", Name: "regImg", Style: "width:16px; height:16px; margin:0px 4px 0px 4px;",
                                        Attributes: [{ Name: "src", Value: GlobalUtilities.icon(activated ? "RaaiVanFav.png" : "forbidden.png") }]
                                    }
                                ]
                            },
                            {
                                Type: "div", Class: "Float WarmColor",
                                Style: "width:80px; margin-" + RV_RevFloat + ":4px; margin-top:2px; font-size:10px;",
                                Childs: [{ Type: "text", TextValue: sendDate }]
                            },
                            { Type: "div", Style: "clear:both;" }
                        ]
                    },
                    {
                        Type: "div", Name: "sendInvDiv", Style: "display:none;",
                        Childs: [
                            {
                                Type: "div", Name: "SENDTO", Class: "Float", Style: "margin-" + RV_RevFloat + ":4px; margin-top:2px;",
                                Childs: [{ Type: "text", TextValue: email }]
                            },
                            {
                                Type: "div", Name: "sendButton", Class: "RevFloat ActionButton", Style: "margin-" + RV_RevFloat + ":4px;",
                                Childs: [{ Type: "text", TextValue: RVDic["Send"] }]
                            },
                            {
                                Type: "div", Class: "RevFloat", Style: "margin-" + RV_RevFloat + ":4px;",
                                Childs: [{
                                    Type: "textarea", Name: "bodyInput", Class: "TextInput", Style: "width:150px; height:16px;",
                                    Attributes: [{ Name: "type", Value: "text" }],
                                    Properties: [
                                        {
                                            Name: "onkeyup", Value:
                                                function () { this.style.direction = (GlobalUtilities.textdirection(this.value) || ''); }
                                        }
                                    ]
                                }]
                            },
                            {
                                Type: "div", Class: "RevFloat", Style: "margin-" + RV_RevFloat + ":4px;",
                                Childs: [{
                                    Type: "input", Name: "nameInput", Class: "TextInput", Style: "width:120px; height:18px;",
                                    Attributes: [{ Name: "type", Value: "text" }],
                                    Properties: [
                                        {
                                            Name: "onkeyup", Value:
                                                function () { this.style.direction = (GlobalUtilities.textdirection(this.value) || ''); }
                                        }
                                    ]
                                }]
                            },
                            { Type: "div", Style: "clear:both;" }
                        ]
                    }
                ]
            }], container);

            var sendAgnImg = elems["sendAgnImg"];
            var regImg = elems["regImg"];
            var nameInput = elems["nameInput"];
            var bodyInput = elems["bodyInput"];
            var sendButton = elems["sendButton"];
            var sendInvDiv = elems["sendInvDiv"];
            var invitationDiv = elems["invitationDiv"];

            var nameInnerTitle = RVDic["Name"] + "...";
            var bodyInnerTitle = RVDic["MessageText"] + "...";
            var sentAgain = false;

            GlobalUtilities.set_inner_title(nameInput, nameInnerTitle);
            GlobalUtilities.set_inner_title(bodyInput, bodyInnerTitle);

            var _init_sendAgnImg = function () {
                var _tooltip = userId == "" ? RVDic["Resend"] : activated ? "" : RVDic["NotActivated"];
                GlobalUtilities.append_tooltip(sendAgnImg, _tooltip);
                sendAgnImg.style.cursor = !userId ? "pointer" : "";

                sendAgnImg.setAttribute("src", (!userId ? GlobalUtilities.icon("Resend.png") : activated ?
                    userImageUrl : GlobalUtilities.icon("TimePending.png")));

                sendAgnImg.onclick = function () {
                    if (!userId) {
                        invitationDiv.style.display = "none";
                        sendInvDiv.style.display = "block";
                    }
                };
            };

            _init_sendAgnImg();
            GlobalUtilities.append_tooltip(regImg, userId == "" ? RVDic["NotRegistered"] : "");
            regImg.setAttribute("src", GlobalUtilities.icon((userId == "" ? "Forbidden" : "RaaiVanFav") + ".png"));

            var _sending = false;

            sendButton.onclick = function () {
                if (_sending) return;

                if (!nameInput.value) return alert(RVDic["PleaseFillNecessaryFields"]);

                GlobalUtilities.block(sendButton);
                _sending = true;
                
                UsersAPI.InviteUser({
                    ApplicationID: (that.Objects.Application || {}).ApplicationID,
                    InvitationID: invitationId, Email: Base64.encode(GlobalUtilities.secure_string(email)),
                    FullName: Base64.encode(GlobalUtilities.secure_string(nameInput.value)),
                    MessageText: Base64.encode(GlobalUtilities.secure_string(bodyInput.value)),
                    ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.ErrorText) {
                            alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            _sending = false;
                            GlobalUtilities.unblock(sendButton);
                            return;
                        }

                        alert(RVDic.MSG["YourMessageSentSuccessfully"]);

                        sendAgnImg.setAttribute("src", GlobalUtilities.icon("Sent.png"));
                        GlobalUtilities.append_tooltip(sendAgnImg, "Sent");
                        sendAgnImg.style.cursor = "default";
                        sendAgnImg.onclick = function () { };

                        invitationDiv.style.display = "block";
                        sendInvDiv.style.display = "none";

                        _sending = false;
                        GlobalUtilities.unblock(sendButton);
                    }
                });
            }
        }
    }
})();