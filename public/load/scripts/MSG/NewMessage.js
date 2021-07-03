(function () {
    if (window.NewMessage) return;

    window.NewMessage = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;
        params = params || {};

        this.Objects = {
            UserSelect: null,
            MessageBody: null,
            GroupCheckbox: null,
            Uploader: null,
            GroupCheckboxClicked: false
        }

        this.Options = {
            OnMessageSent: params.OnMessageSent,
            Message: params.Message
        }

        var that = this;

        GlobalUtilities.load_files([{ Root: "API/", Ext: "js", Childs: ["MessagingAPI", "DocsAPI", "UsersAPI"] }], {
            OnLoad: function () { that._initialize(); }
        });
    }

    NewMessage.prototype = {
        _initialize: function () {
            var that = this;
            var message = that.Options.Message || {};
            that.ContainerDiv.innerHTML = "";

            var el = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Name: "container",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "Header",
                            Childs: [
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12",
                                    Style: "margin-bottom:0.5rem; font-weight:bold;",
                                    Childs: [{ Type: "text", TextValue: RVDic.NewMessage || "NewMessage" }]
                                },
                                { Type: "hr", Class: "small-12 medium-12 large-12" }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 row", Style: "margin:0rem; margin-bottom:0.5rem;",
                            Childs: [
                                {
                                    Type: "div", Class: "small-8 medium-8 large-8",
                                    Childs: [
                                        {
                                            Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":0.5rem;",
                                            Childs: [
                                                {
                                                    Type: "checkbox", Name: "groupCheckbox",
                                                    Params: { OnClick: function (e, done) { that.Objects.GroupCheckboxClicked = true; } }
                                                }
                                            ]
                                        },
                                        {
                                            Type: "div", Style: "display:inline-block;",
                                            Childs: [{ Type: "text", TextValue: RVDic.SendGroupMessage || "SendGroupMessage" }]
                                        }
                                    ]
                                },
                                {
                                    Type: "div", Class: "small-4 medium-4 large-4 ActionButton",
                                    Style: "font-weight:bold;", Name: "sendMessage",
                                    Childs: [{ Type: "text", TextValue: RVDic.Send || "Send" }]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "margin-bottom:0.3rem;", Name: "recieverUsersDiv"
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "margin-bottom:0.3rem;", Name: "messageTextAdvInput"
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "attachmentsDiv" }
                    ]
                }
            ], that.ContainerDiv);

            that.Objects.GroupCheckbox = el["groupCheckbox"];

            var newMessageTextAdvInput = that.Objects.MessageBody = new AdvancedTextArea({
                ContainerDiv: el["messageTextAdvInput"],
                DefaultText: (RVDic["MessageText"] || "MessageText") + "...",
                QueryTemplate: "RelatedThings",
                ItemTemplate: { ItemsTitle: "Items", ID: "ItemID", Name: "Name", Type: "Type", ImageURL: "ImageURL" }
            });

            var NewMessageUploader = null;

            GlobalUtilities.load_files(["API/DocsAPI.js"], {
                OnLoad: function () {
                    var _el = GlobalUtilities.create_nested_elements([
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-quarter SoftBorder",
                            Style: "padding:0.3rem; border-style:dashed;", Name: "uploadArea", Tooltip: RVDic.UploadFile
                        }
                    ], el["attachmentsDiv"]);

                    var _uploadParams = {
                        UploadDataSource: DocsAPI.GetUploadLink(), Removable: true,
                        OnRemove: function (fl, uploadResponse, callback) { callback(); }
                    };
                    GlobalUtilities.uploader(_el["uploadArea"], _uploadParams, function (au) {
                        NewMessageUploader = that.Objects.Uploader = au;
                    });
                }
            });

            if (message) newMessageTextAdvInput.set_data(Base64.decode(message.MessageText));

            var receiverUsers = null;
            var lastCount = 0;

            var onUsersCountChange = function () {
                if (that.Objects.GroupCheckboxClicked) return;

                var newCount = receiverUsers.get_items().length;
                var diff = newCount - lastCount;

                if (lastCount == 1 && diff >= 1) that.Objects.GroupCheckbox.check();
                else if (lastCount == 2 && diff < 0) that.Objects.GroupCheckbox.uncheck();

                lastCount = newCount;
            }

            GlobalUtilities.load_files(["SingleDataContainer/NewSingleDataContainer.js"], {
                OnLoad: function () {
                    receiverUsers = that.Objects.UserSelect = new NewSingleDataContainer(el["recieverUsersDiv"], {
                        InputClass: "rv-input",
                        InputStyle: "width:100%;",
                        InnerTitle: RVDic.UserSelect + "...",
                        AjaxDataSource: UsersAPI.GetUsersDataSource(),
                        ResponseParser: function (responseText) {
                            var users = JSON.parse(responseText).Users || [];
                            var arr = [];
                            for (var i = 0, lnt = users.length; i < lnt; ++i) {
                                users[i].FirstName = Base64.decode(users[i].FirstName || "");
                                users[i].LastName = Base64.decode(users[i].LastName || "");
                                users[i].UserName = Base64.decode(users[i].UserName || "");

                                arr.push([users[i].FirstName + " " + users[i].LastName + " - " + users[i].UserName, users[i].UserID]);
                            }
                            return arr;
                        },
                        OnAfterAdd: onUsersCountChange,
                        OnAfterRemove: onUsersCountChange
                    });
                }
            });

            var sendMessage = function () {
                var userIds = !receiverUsers ? "" : receiverUsers.get_items_string("|");
                var messageText = GlobalUtilities.trim(newMessageTextAdvInput.get_data());

                if (!userIds) return alert(RVDic.Checks["PleaseSelectReceivers"] || "PleaseSelectReceivers");

                if (!messageText) return alert(RVDic.Checks["MessageTextCannotBeEmpty"] || "MessageTextCannotBeEmpty");

                var strAttachedFiles = that.Objects.Uploader ? that.Objects.Uploader.get_items_string() : "";
                GlobalUtilities.block(el["container"]);

                MessagingAPI.SendMessage({
                    ReceiverUserIDs: userIds, ForwardedFrom: message ? message.MessageID : "",
                    MessageText: Base64.encode(messageText), IsGroup: that.Objects.GroupCheckbox.checked,
                    AttachedFiles: strAttachedFiles, Ref: "Messages",
                    ResponseHandler: function (responseText) {
                        var result = JSON.parse(responseText);

                        if (result.ErrorText) {
                            alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                        }
                        else if (that.Options.OnMessageSent) that.Options.OnMessageSent(result);

                        GlobalUtilities.unblock(el["container"]);
                    }
                });
            }

            el["sendMessage"].onclick = sendMessage;
        },

        clear: function () {
            if ((this.Objects.UserSelect || {}).clear) this.Objects.UserSelect.clear();
            if (this.Objects.GroupCheckbox) this.Objects.GroupCheckbox.uncheck();
            if (this.Objects.MessageBody) this.Objects.MessageBody.set_data("");
            if ((this.Objects.Uploader || {}).clear) this.Objects.Uploader.clear();
            this.Objects.GroupCheckboxClicked = false;
        }
    }
})();