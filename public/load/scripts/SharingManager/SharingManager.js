(function () {
    if (window.SharingManager) return;
    
    window.SharingManager = function (params) {
        params = params || {};

        var containerDiv = params.Container || params.ContainerDiv || params.PostsContainerDivID;

        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (this.ContainerDiv == null) return;

        this.Interface = {
            OwnerInfoArea: typeof (params.OwnerInfoArea) == "object" ?
                params.OwnerInfoArea : document.getElementById(params.OwnerInfoArea),
            PostsArea: null
        };

        this.Objects = {
            OwnerID: params.OwnerID || params.OwnerObjectID,
            OwnerType: params.OwnerType,
            PostID: params.PostID,
            NewPostTextArea: null,
            MoreButton: null,
            FirstPostDate: null,
            LastPostDate: null,
            Uploader: null,
            AttachedFile: null,
            Items: {}
        };

        this.Options = {
            InitialFill: params.InitialFill === true,
            RealTime: params.RealTime === true,
            RealTimeFeedID: params.RealTimeFeedID,
            Removable: !((params.Removable === false) || (params.PostsRemovable === false)),
            HidePrivacyOptions: params.HidePrivacyOptions === true,
            NewsMode: (params.News === true) || (params.NewsMode === true),
            Count: params.Count || params.PostsCount || 20,
            EnableImageUpload: true,
            Permissions: params.Permissions || {},
            OnLoad: params.OnLoad,
            OnPostCreate: params.OnPostCreate
        };
        
        var that = this;

        GlobalUtilities.load_files([{ Root: "API/", Ext: "js", Childs: ["SharingAPI", "UsersAPI", "DocsAPI"] }], {
            OnLoad: function () { that.initialize(); }
        });
    };

    SharingManager.prototype = {
        initialize: function () {
            var that = this;

            that.ContainerDiv.innerHTML = "";

            if (that.Options.Permissions.AddPost) that.create_new_post_area(that.ContainerDiv);

            that.Interface.PostsArea = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-12 medium-12 large-12 rv-trim-vertical-margins", Name: "_div"
            }], that.ContainerDiv)["_div"];

            if (!that.Objects.PostID) that.create_more_button(that.ContainerDiv);
            
            if (that.Options.InitialFill && (that.Objects.PostID || that.Objects.OwnerID)) that.get_posts();

            if (that.Options.OnLoad) that.Options.OnLoad();

            that.realtime();
        },

        create_advanced_textarea_instance: function (params) {
            params = params || {};

            return new AdvancedTextArea({
                ContainerDiv: params.ContainerDiv,
                DefaultText: params.DefaultText || RVDic.WhatDoYouThink,
                OnKeyDown: params.OnKeyDown,
                QueryTemplate: "RelatedThings",
                ItemTemplate: { ItemsTitle: "Items", ID: "ItemID", Name: "Name", Type: "Type", ImageURL: "ImageURL" }
            });
        },

        create_new_post_area: function (container) {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-12 medium-12 large-12 SurroundingShadow",
                Style: "background-color:white; margin-bottom:1rem;",
                Childs: [
                    {
                        Type: "div", Class: "small-12 medium-12 large-12",
                        Style: "position:relative; min-height:2.5rem; padding:1rem 0; padding-" + RV_Float + ":3.1rem;",
                        Childs: [
                            {
                                Type: "div", Style: "position:absolute; top:1rem;" + RV_Float + ":0.5rem; width:2.5rem; height:2.5rem; padding:0.2rem;",
                                Childs: [{
                                    Type: "img", Class: "rv-border-radius-quarter", Style: "width:100%; height:100%;",
                                    Attributes: [{ Name: "src", Value: GlobalUtilities.add_timestamp(((window.RVGlobal || {}).CurrentUser || {}).ImageURL) }]
                                }]
                            },
                            { Type: "div", Class: "small-12 medium-12 large-12", Name: "textAreaDiv" }
                        ]
                    },
                    (!that.Options.EnableImageUpload ? null : {
                        Type: "div", Class: "small-12 medium-12 large-12", Name: "uploaderDiv",
                        Style: "display:none; margin-top:0.5rem;"
                    }),
                    (!that.Options.EnableImageUpload ? null : {
                        Type: "div", Class: "small-12 medium-12 large-12", Name: "uploadedFile", Style: "display:none; padding:0.5rem;"
                    }),
                    {
                        Type: "div", Class: "small-12 medium-12 large-12 RevDirection RevTextAlign SoftBackgroundColor",
                        Style: "position:relative; margin:0rem; padding-" + RV_Float + ":5rem; padding-" + RV_RevFloat + ":10rem; min-height:2rem;",
                        Childs: [
                            (!that.Options.EnableImageUpload ? null : {
                                Type: "div", Class: "rv-air-button rv-border-radius-quarter TextAlign Direction",
                                Style: "position:absolute; top:0; bottom:0;" + RV_Float + ":0;", Name: "uploadButton",
                                Childs: [{
                                    Type: "middle",
                                    Childs: [
                                        { Type: "i", Class: "fa fa-camera fa-lg", Style: "margin-" + RV_RevFloat + ":0.5rem;" },
                                        { Type: "text", TextValue: RVDic.SelectN.replace("[n]", RVDic.Image) }
                                    ]
                                }]
                            }),
                            {
                                Type: "div", Class: "ActionButton", Name: "sendButton",
                                Style: "position:absolute; top:0; bottom:0;" + RV_RevFloat + ":0; width:9rem;",
                                Childs: [{ Type: "middle", Childs: [{ Type: "text", TextValue: RVDic.SendPost }] }]
                            },
                            (that.Options.HidePrivacyOptions ? null : {
                                Type: "div", Class: "Direction TextAlign", Style: "display:inline-block;",
                                Childs: [{
                                    Type: "select", Class: "rv-input SoftBackgroundColor", Name: "privacySelect",
                                    Style: "width:100%; font-size:0.7rem; border-width:0; border-" + RV_Float + "-width:3px; border-color:white;",
                                    Childs: [
                                        {
                                            Type: "option", Attributes: [{ Name: "title", Value: "Public" }],
                                            Childs: [{ Type: "text", TextValue: RVDic.Public }]
                                        },
                                        {
                                            Type: "option", Attributes: [{ Name: "title", Value: "Friends" }],
                                            Childs: [{ Type: "text", TextValue: RVDic.Friends }]
                                        }
                                    ]
                                }]
                            })
                        ]
                    }
                ]
            }], container);

            var textArea = that.Objects.NewPostTextArea = that.create_advanced_textarea_instance({
                ContainerDiv: elems["textAreaDiv"]
            });

            textArea.textarea().style.borderWidth = "0rem";

            //Active-Deactive SendButton
            var set_btn_active = function () {
                if (!!GlobalUtilities.trim(textArea.get_data()))
                    jQuery(elems["sendButton"]).css({ 'opacity': 1, 'cursor': 'pointer' });
                else jQuery(elems["sendButton"]).css({ 'opacity': 0.5, 'cursor': 'not-allowed' });
            };

            jQuery(textArea.textarea()).on("keyup", set_btn_active);
            set_btn_active();
            //end of Active-Deactive SendButton

            if (that.Options.EnableImageUpload && elems["uploaderDiv"]) {
                if (elems["uploadButton"]) elems["uploadButton"].onclick = function () {
                    if (that.Objects.Uploader) that.Objects.Uploader.browse();
                };

                var _create_thumbnail = function (file, attachedFile) {
                    GlobalUtilities.create_nested_elements([
                        {
                            Type: "div", Style: "display:inline-block;",
                            Childs: [{
                                Type: "img", Class: "rv-border-radius-quarter", Style: "max-width:4rem; max-height:4rem;",
                                Attributes: [{ Name: "src", Value: attachedFile.DownloadLink }]
                            }]
                        },
                        {
                            Type: "div", Style: "display:inline-block; margin-" + RV_Float + ":0.5rem; color:blue; font-size:0.8rem; cursor:pointer;",
                            Properties: [{
                                Name: "onclick", Value: function (e) {
                                    that.Objects.Uploader.clear();
                                    that.Objects.AttachedFile = null;

                                    jQuery(elems["uploadedFile"]).fadeOut(500, function () {
                                        elems["uploadedFile"].innerHTML = "";
                                    });
                                }
                            }],
                            Childs: [{ Type: "text", TextValue: RVDic.RemoveN.replace("[n]", RVDic.Image) }]
                        }
                    ], elems["uploadedFile"]);
                };

                var _uploadParams = {
                    UploadDataSource: DocsAPI.UploadPicture({ Type: "Post" }),
                    Removable: true,
                    AcceptedFiles: [".jpg", ".jpeg", ".png", ".bmp"],
                    OnFileAccept: function (file) {
                        jQuery(elems["uploaderDiv"]).fadeIn(0);
                    },
                    OnUpload: function (file, jsonResponse) {
                        elems["uploadedFile"].innerHTML = "";

                        jQuery(elems["uploaderDiv"]).fadeOut(0);
                        jQuery(elems["uploadedFile"]).fadeIn(500);

                        var attachedFile = GlobalUtilities.extend({}, jsonResponse.AttachedFile || {});

                        attachedFile.DownloadLink = RVAPI.DownloadURL({
                            FileID: attachedFile.FileID, Extension: Base64.encode("jpg"), Category: "TemporaryFiles"
                        });

                        _create_thumbnail(file, attachedFile);

                        that.Objects.AttachedFile = that.Objects.Uploader.get_items_string();
                        that.Objects.Uploader.clear();
                    },
                    OnRemove: function (p) { },
                    InnerDiv: document.createElement("div")
                };

                GlobalUtilities.uploader(elems["uploaderDiv"], _uploadParams, function (au) { that.Objects.Uploader = au; });
            }

            //Send Button
            var processing = false;

            elems["sendButton"].onclick = function () {
                var desc = GlobalUtilities.trim(textArea.get_data());

                if (!desc || processing) return;
                processing = true;

                var privacySelect = elems["privacySelect"];

                var privacy = that.Objects.OwnerType != "User" ? "Public" :
                    (!privacySelect ? "Public" : privacySelect[privacySelect.selectedIndex].title);

                SharingAPI.AddPost({
                    PostType: "Text", Privacy: privacy, OwnerID: that.Objects.OwnerID, Description: Base64.encode(desc),
                    OwnerType: that.Objects.OwnerType, AttachedFile: that.Objects.AttachedFile, ParseResults: true,
                    ResponseHandler: function (result) {
                        processing = false;

                        if (result.ErrorText) return alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                        else that.add_post(that.parse_post(result), { Add2Top: true });

                        //done
                        textArea.clear();
                        if (that.Objects.Uploader) that.Objects.Uploader.clear();
                        that.Objects.AttachedFile = null;
                        jQuery(elems["uploadedFile"]).fadeOut(500);
                        elems["uploadedFile"].innerHTML = "";
                        //end of done

                        if (that.Options.OnPostCreate) that.Options.OnPostCreate(result);
                    }
                });
            };
            //end of Send Button
        },

        create_new_comment_area: function (container, item, onAdd) {
            var that = this;
            
            container.innerHTML = "";

            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-quarter",
                Style: "background-color:rgb(250,250,250); padding:0.5rem; display:flex; flex-flow:row; align-items:center;",
                Childs: [
                    { Type: "div", Style: "padding-" + RV_RevFloat + ":0.5rem; flex:1 1 auto;", Name: "commentArea" },
                    {
                        Type: "div", Style: "flex:0 1 auto;",
                        Childs: [{
                            Type: "div", Class: "rv-air-button rv-border-radius-quarter", Name: "sendButton",
                            Style: "font-size:0.7rem; padding:0.2rem 0.5rem;",
                            Childs: [
                                {
                                    Type: "i", Class: "fa fa-send", Style: "margin-" + RV_RevFloat + ":0.3rem;",
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                },
                                { Type: "text", TextValue: RVDic.Send }
                            ]
                        }]
                    }
                ]
            }], container);

            var newComment = that.create_advanced_textarea_instance({
                ContainerDiv: elems["commentArea"], DefaultText: RVDic.YourComment + "..."
            });

            jQuery(container).fadeIn(500, function () {
                GlobalUtilities.scroll_into_view(container, { Offset: 200 });
                jQuery(newComment.textarea()).focus();
            });

            //Active-Deactive SendButton
            var set_btn_active = function () {
                if (!!GlobalUtilities.trim(newComment.get_data()))
                    jQuery(elems["sendButton"]).css({ 'opacity': 1, 'cursor': 'pointer' });
                else jQuery(elems["sendButton"]).css({ 'opacity': 0.5, 'cursor': 'not-allowed' });
            };

            jQuery(newComment.textarea()).on("keyup", set_btn_active);
            set_btn_active();
            //end of Active-Deactive SendButton

            var processing = false;

            elems["sendButton"].onclick = function () {
                var description = GlobalUtilities.trim(newComment.get_data());

                if (processing || !description) return
                processing = true;

                newComment.clear();

                SharingAPI.AddComment({
                    PostID: item.PostID, Description: Base64.encode(description), ParseResults: true,
                    ResponseHandler: function (result) {
                        processing = false;

                        if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                        else if (onAdd) onAdd(that.parse_comment(result, item.PostID));
                    }
                });
            };
        },

        create_more_button: function (container) {
            var that = this;

            that.Objects.MoreButton = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-12 medium-12 large-12 rv-circle rv-air-button", Name: "_div",
                Style: "text-align:center; padding:0.5rem; font-weight:bold; margin-top:0.8rem;",
                Properties: [{ Name: "onclick", Value: function () { that.get_posts(); } }],
                Childs: [{ Type: "text", TextValue: RVDic.More }]
            }], container)["_div"];
        },

        loading: function () {
            var that = this;

            if (!that.Objects.MoreButton) return;

            that.Objects.MoreButton.innerHTML = "";
            GlobalUtilities.loading(that.Objects.MoreButton);
        },

        set_more_button_text: function (text) {
            if (this.Objects.MoreButton) this.Objects.MoreButton.innerHTML = text;
        },

        toggle_more_button: function (hide) {
            if (this.Objects.MoreButton == null) return;

            this.Objects.MoreButton.style.display = hide === true ? "none" :
                (hide === false ? "block" : (this.Objects.MoreButton.style.display == "none" ? "block" : "none"));
        },

        get_posts_count: function () {
            var that = this;
            var count = 0;

            for (var id in that.Objects.Items)
                if (that.Objects.Items[id] && !that.Objects.Items[id].IsComment) count++;

            return count;
        },

        set_owner_info: function (info) {
            var that = this;

            if (!that.Interface.OwnerInfoArea || !info.ID) return;

            that.Interface.OwnerInfoArea.innerHTML = "";

            GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Style: "display:flex; flex-flow:row; align-items:center;",
                    Childs: [
                        {
                            Type: "div", Style: "flex:0 1 auto;",
                            Childs: [{
                                Type: "img", Class: "rv-border-radius-quarter", Style: "width:2.5rem; height:2.5rem;",
                                Attributes: [{ Name: "src", Value: info.ImageURL }]
                            }]
                        },
                        {
                            Type: "div", Style: "flex:1 1 auto; padding-" + RV_Float + ":0.5rem;",
                            Childs: [{
                                Type: "a", Class: "rv-link", Style: "font-weight:bold; cursor:pointer;",
                                Attributes: [{ Name: "href", Value: info.NavigateURL }],
                                Childs: [
                                    { Type: "text", TextValue: Base64.decode(info.Title) },
                                    (!info.Type ? null : {
                                        Type: "div", Class: "rv-air-button-base rv-air-button-black rv-border-radius-quarter",
                                        Style: "display:inline-block; font-size:0.7rem; margin-" + RV_Float + ":0.5rem; font-weight:normal;",
                                        Childs: [{ Type: "text", TextValue: Base64.decode(info.Type) }]
                                    }),
                                    (!info.IsWorkFlow ? null : {
                                        Type: "div", Class: "rv-air-button-base rv-air-button-black rv-border-radius-quarter",
                                        Style: "display:inline-block; font-size:0.7rem; margin-" + RV_Float + ":0.5rem; font-weight:normal;",
                                        Childs: [{ Type: "text", TextValue: RVDic.WorkFlow }]
                                    })
                                ]
                            }]
                        }
                    ]
                }
            ], that.Interface.OwnerInfoArea);
        },

        show_full_size_image: function (url) {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "label", Class: "rv-border-radius-half SoftBackgroundColor", Name: "_div",
                    Style: "text-align:center; padding:1rem;",
                    Childs: [
                        {
                            Type: "i", Class: "fa fa-spinner fa-spin fa-pulse fa-3x", Name: "loading",
                            Attributes: [{ Name: "aria-hidden", Value: true }]
                        },
                        {
                            Type: "img", Class: "rv-border-radius-half", Name: "image",
                            Style: "max-width:100%; display:none;",
                            Attributes: [{ Name: "src", Value: url }],
                            Properties: [
                                {
                                    Name: "onload",
                                    Value: function () {
                                        jQuery(elems["loading"]).fadeOut(0, function () {
                                            jQuery(elems["image"]).toggle(500);
                                        });
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]);

            GlobalUtilities.show(elems["_div"], { Style: "text-align:center;" });

            elems["_div"].style.display = "inline-block";
        },

        set_body_text: function (container, item, params) {
            var that = this;

            var editable = (item.Options || {}).Editable;
            var processing = false;

            var elems = GlobalUtilities.create_nested_elements([
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "view" },
                (!editable ? null : { Type: "div", Class: "small-12 medium-12 large-12", Name: "edit", Style: "display:none;" }),
                (!editable ? null : {
                    Type: "div", Class: "small-5 medium-4 large-3 rv-air-button rv-circle",
                    Style: "margin:0.5rem auto 0 auto; display:none;", Name: "saveButton",
                    Properties: !params.OnSave ? null : [{
                        Name: "onclick",
                        Value: function () {
                            var newText = GlobalUtilities.trim(textArea.get_data());

                            if (!newText || !textArea || processing) return;
                            processing = true;

                            params.OnSave(newText, function (result) {
                                processing = false;
                                if (result) retObj.GoToViewMode();
                            });
                        }
                    }],
                    Childs: [
                        { Type: "i", Class: "fa fa-floppy-o", Style: "margin-" + RV_RevFloat + ":0.5rem;" },
                        { Type: "text", TextValue: RVDic.Save }
                    ]
                })
            ], container);

            var textArea = null;

            var retObj = {
                Set: function () {
                    elems["view"].innerHTML = "";

                    var direction = GlobalUtilities.textdirection(GlobalUtilities.get_text_begining(item.Description, 100));
                    elems["view"].style.direction = direction;
                    elems["view"].style.textAlign = direction == "rtl" ? "right" : "left";

                    GlobalUtilities.append_markup_text(elems["view"], item.Description, { RichText: false, ReadMore: 200 });
                },
                GoToViewMode: function () {
                    retObj.Set();
                    jQuery(elems["saveButton"]).fadeOut(200);
                    jQuery(elems["edit"]).fadeOut(200, function () { jQuery(elems["view"]).fadeIn(500); });
                },
                GoToEditMode: function () {
                    textArea = textArea || that.create_advanced_textarea_instance({ ContainerDiv: elems["edit"] });

                    jQuery(elems["view"]).fadeOut(200, function () {
                        jQuery(elems["edit"]).fadeIn(500, function () { textArea.set_data(item.Description); });
                        jQuery(elems["saveButton"]).fadeIn(500);
                    });
                }
            };

            retObj.Set();

            return retObj
        },

        create_options_menu: function (button, item, options) {
            var that = this;
            item = item || {};
            options = options || {};

            if (!button) return;

            var isComment = !!item.CommentID;
            var removable = that.Options.Removable && (item.Options || {}).Removable;

            var opArr = [
                (!(item.Options || {}).Editable ? null : {
                    Name: "editButton", Title: RVDic.Edit, Icon: "fa-pencil",
                    OnClick: !options.OnEdit ? null : function () { options.OnEdit(); }
                }),
                (isComment ? null : {
                    Name: "shareButton", Title: RVDic.Share, Icon: "fa-share-alt",
                    OnClick: !options.OnShare ? null : function () { options.OnShare(); }
                }),
                (!removable ? null : {
                    Name: "removeButton", Title: RVDic.Remove, Icon: "fa-times",
                    OnClick: !options.OnRemove ? null : function () { options.OnRemove(); }
                })
            ].filter(function (u) { return !!u; });

            if (!opArr.length) return jQuery(button).fadeOut(0);

            button.onclick = function (e) {
                e.stopPropagation();

                var menuElems = GlobalUtilities.create_nested_elements([{
                    Type: "div", Class: "Direction TextAlign", Style: "width:7.5rem;", Name: "container",
                    Childs: opArr.map(function (op) {
                        return {
                            Type: "div", Name: op.Name, Class: "rv-border-radius-quarter rv-bg-color-trans-soft WarmColor",
                            Style: "padding:0.3rem; cursor:pointer;",
                            Properties: [{
                                Name: "onclick", Value: function () {
                                    hideFunc();
                                    if (op.OnClick) op.OnClick();
                                }
                            }],
                            Childs: [
                                {
                                    Type: "i", Class: "fa " + op.Icon, Style: "margin-" + RV_RevFloat + ":0.5rem;",
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                },
                                { Type: "text", TextValue: op.Title }
                            ]
                        };
                    })
                }]);

                var hideFunc = function () {
                    jQuery(document.body).off('click', hideHandler);
                    popupMenu.Hide();
                };

                var hideHandler = function (event) {
                    if (popupMenu.IsOpen() && !jQuery(event.target).closest(popupMenu.Container).length &&
                        GlobalUtilities.is_visible(event.target)) hideFunc();
                };

                var popupMenu = GlobalUtilities.popup_menu(button, menuElems["container"], {
                    Align: "bottom",
                    LeftOffset: RV_RTL ? 30 : -30,
                    ContentClass: "SurroundingShadow",
                    Style: "background-color:white; border-color:rgb(200,200,200);",
                    OnAfterShow: function () { jQuery(document.body).on('click', hideHandler); }
                });

                button.onclick = function (e) {
                    e.stopPropagation();

                    if (popupMenu.IsOpen()) hideFunc();
                    else popupMenu.Show();
                };
            };
        },

        create_post_comment: function (container, itemObject, params) {
            var that = this;
            itemObject = itemObject || {};
            params = params || {};

            var isComment = !!itemObject.CommentID;
            var itemId = itemObject.CommentID || itemObject.PostID;

            if (!params.Shared && (!container || that.Objects.Items[itemId])) return false;

            jQuery(container).fadeIn(0);

            var picUrl = RVAPI.DownloadURL({ FileID: itemObject.PictureID, Category: "Pictures" });
            var profileImgSize = isComment ? 2 : 2.5;
            var sidePadding = isComment ? 3.5 : 4;

            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Name: "container",
                Class: "small-12 medium-12 large-12 row rv-border-radius-quarter SoftShadow " +
                    (params.Shared ? "SoftBorder " : "") +
                    (!isComment && !params.Shared ? "SurroundingShadow " : ""),
                Style: "position:relative; padding:0.5rem; padding-" + RV_Float + ":" + sidePadding + "rem;" +
                    "min-height:4rem; display:none; background-color:" + (isComment ? "rgb(248,248,248)" : "white") + ";" +
                    (!params.Shared ? "" : "border-width:0; border-" + RV_Float + "-width:3px; background-color:rgb(250,250,250);") +
                    (isComment ? "margin:0.7rem 0;" : "margin:1rem 0;"),
                Childs: [
                    {
                        Type: "div", Style: "position:absolute; top:0.5rem;" + RV_Float + ":0.5rem;",
                        Childs: [{
                            Type: "img", Class: "rv-border-radius-quarter",
                            Style: "width:" + profileImgSize + "rem; height:" + profileImgSize + "rem;",
                            Link: RVAPI.UserPageURL({ UserID: itemObject.Sender.UserID }),
                            Attributes: [{ Name: "src", Value: itemObject.Sender.ImageURL || itemObject.Sender.ProfileImageURL }]
                        }]
                    },
                    {
                        Type: "div", Class: "small-12 medium-12 large-12", Name: "senderArea",
                        Style: "position:relative; margin-bottom:0.5rem; padding-" + RV_RevFloat + ":2.5rem; display:flex; flex-flow:row;",
                        Childs: [
                            (params.Shared ? null : {
                                Type: "div", Style: "position:absolute; top:0;" + RV_RevFloat + ":0;",
                                Childs: [{
                                    Type: "div", Class: "rv-circle rv-bg-color-trans-soft", Name: "optionsButton",
                                    Style: "display:inline-block; width:1.5rem; height:1.5rem; cursor:pointer;" +
                                        "text-align:center; font-weight:bold; padding-bottom:0.3rem;",
                                    Childs: [{ Type: "middle", Childs: [{ Type: "text", TextValue: "..." }] }]
                                }]
                            }),
                            (!params.Shared ? null : {
                                Type: "div", Style: "position:absolute; top:0;" + RV_RevFloat + ":0;",
                                Childs: [{
                                    Type: "i", Class: "fa fa-expand fa-lg rv-icon-button",
                                    Attributes: [{ Name: "aria-hidden", Value: true }],
                                    Properties: [{ Name: "onclick", Value: function (e) { that.show_ref_post(e, itemObject.PostID); } }]
                                }]
                            }),
                            {
                                Type: "div", Style: "flex-grow:0; flex-shrink:1; flex-basis:auto;",
                                Childs: [
                                    {
                                        Type: "div", Class: "WarmColor", Style: "font-weight:bold;",
                                        Link: RVAPI.UserPageURL({ UserID: itemObject.Sender.UserID }),
                                        Childs: [{ Type: "text", TextValue: (itemObject.Sender || {}).Name }]
                                    },
                                    (!(itemObject.Sender || {}).JobTitle || isComment ? null : {
                                        Type: "div", Style: "color:rgb(80,80,80); font-size:0.7rem;",
                                        Childs: [{ Type: "text", TextValue: (itemObject.Sender || {}).JobTitle }]
                                    })
                                ]
                            },
                            (!itemObject.Receiver ? null : {
                                Type: "div", Style: "flex-grow:0; flex-shrink:1; flex-basis:auto; padding-" + RV_Float + ":1rem;",
                                Childs: [
                                    {
                                        Type: "i", Style: "cursor:default;",
                                        Class: "fa " + (RV_RTL ? "fa-angle-left" : "fa-angle-right") + " fa-lg rv-icon-button",
                                        Attributes: [{ Name: "aria-hidden", Value: true }]
                                    },
                                    {
                                        Type: "img", Class: "rv-border-radius-quarter", Tooltip: itemObject.Receiver.Name,
                                        Style: "width:2.5rem; height:2.5rem; margin:0rem 0.8rem;",
                                        Link: RVAPI.UserPageURL({ UserID: itemObject.Receiver.UserID }),
                                        Attributes: [{ Name: "src", Value: itemObject.Receiver.ImageURL }]
                                    }
                                ]
                            })
                        ]
                    },
                    {
                        Type: "div", Style: (isComment ? "padding:0.3rem 0;" : "padding:0.5rem;") + "padding-" + RV_RevFloat + ":1.8rem;",
                        Class: "small-12 medium-12 large-12 rv-border-radius-quarter",
                        Childs: [
                            { Type: "div", Class: "small-12 medium-12 large-12", Name: "contentArea", Style: "line-height:1.5rem;" },
                            (!itemObject.PictureID ? null : {
                                Type: "div", Class: "small-12 medium-12 large-12", Style: "text-align:center; margin-top:1rem;",
                                Childs: [{
                                    Type: "img", Class: "rv-border-radius-half", Style: "max-width:100%; cursor:pointer;",
                                    Attributes: [{ Name: "src", Value: picUrl }],
                                    Properties: [{ Name: "onclick", Value: function () { that.show_full_size_image(picUrl); } }]
                                }]
                            }),
                            (!itemObject.OriginalPost ? null : {
                                Type: "div", Name: "originalPost", Style: "margin-top:0.5rem;",
                                Class: "small-12 medium-12 large-12 rv-trim-vertical-margins"
                            })
                        ]
                    },
                    (params.Shared ? null : {
                        Type: "div", Class: "small-4 medium-4 large-4", Style: "margin-top:0.2rem;",
                        Childs: [{
                            Type: "bottom",
                            Childs: [
                                { Type: "i", Class: "fa fa-lg", Style: "color:red; cursor:pointer;", Name: "likeIcon" },
                                {
                                    Type: "div", Name: "likesCount",
                                    Style: "display:inline-block; padding:0 0.3rem; margin-" + RV_Float + ":0.2rem;"
                                },
                                (isComment ? null : {
                                    Type: "i", Class: "fa fa-lg", Name: "commentIcon",
                                    Style: "color:rgb(100,100,100); margin-" + RV_Float + ":2rem; cursor:pointer;",
                                    Properties: [{ Name: "onclick", Value: function () { retObj.NewComment(); } }]
                                }),
                                (isComment ? null : {
                                    Type: "div", Name: "commentsCount",
                                    Style: "display:inline-block; padding:0 0.3rem; margin-" + RV_Float + ":0.2rem;"
                                })
                            ]
                        }]
                    }),
                    (params.Shared ? null : {
                        Type: "div", Class: "small-8 medium-8 large-8 RevDirection RevTextAlign",
                        Style: "margin-top:0.2rem; padding-" + RV_RevFloat + ":1.8rem;",
                        Childs: [
                            (!itemObject.IsPublic ? null : {
                                Type: "i", Class: "RevFloat fa fa-globe rv-icon-button", Tooltip: RVDic.Public,
                                Style: "cursor:default; margin-top:2px; margin-" + RV_Float + ":1rem; padding-top:0.2rem;",
                                Attributes: [{ Name: "aria-hidden", Value: true }]
                            }),
                            {
                                Type: "div", Class: "Direction TextAlign WarmColor",
                                Style: "display:inline-block; font-size:0.7rem; margin-" + RV_Float + ":1rem;",
                                Tooltip: !itemObject.NDaysAgo || (itemObject.NDaysAgo == 1) ? itemObject.SendDate : null,
                                Childs: [{ Type: "text", TextValue: !itemObject.NDaysAgo ? RVDic.Today : (itemObject.NDaysAgo == 1 ? RVDic.Yesterday : itemObject.SendDate) }]
                            },
                            (isComment ? null : {
                                Type: "div", Class: "rv-air-button rv-circle",
                                Style: "display:inline-block; font-size:0.6rem; padding:0.1rem 0.5rem;",
                                Properties: [{ Name: "onclick", Value: function () { retObj.NewComment(); } }],
                                Childs: [{ Type: "text", TextValue: isComment ? RVDic.Reply : RVDic.SendComment }]
                            })
                        ]
                    }),
                    (isComment ? null : {
                        Type: "div", Class: "small-12 medium-12 large-12 rv-trim-vertical-margins", Name: "commentsArea",
                        Style: "margin-top:1rem; font-size:0.7rem; padding-" + RV_RevFloat + ":1.8rem; display:none;"
                    }),
                    (isComment ? null : {
                        Type: "div", Class: "small-12 medium-12 large-12", Name: "newCommentArea",
                        Style: "margin-top:1rem; font-size:0.7rem; padding-" + RV_RevFloat + ":1.8rem; display:none;"
                    })
                ]
            }]);

            var add2top = (params.Add2Top === true) || (params.Top === true);

            if (add2top) container.insertBefore(elems["container"], that.Interface.PostsArea.firstChild);
            else container.appendChild(elems["container"]);

            if (itemObject.OriginalPost) that.create_post_comment(elems["originalPost"], itemObject.OriginalPost, { Shared: true });

            var bodyTextObj = that.set_body_text(elems["contentArea"], itemObject, {
                OnSave: function (text, done) {
                    SharingAPI[isComment ? "ModifyComment" : "ModifyPost"]({
                        PostID: itemId, CommentID: itemId,
                        Description: Base64.encode(text), ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else itemObject.Description = Base64.decode((result || {}).Description) || text;

                            done(!result.ErrorText);
                        }
                    });
                }
            });

            //if (!isComment && add2top) GlobalUtilities.scroll_into_view(elems["container"]);

            (itemObject.Comments || []).forEach(function (comment) {
                that.create_post_comment(elems["commentsArea"], comment, { Add2Top: false });
            });

            if (add2top) jQuery(elems["container"]).animate({ height: "toggle" }, 500);
            else jQuery(elems["container"]).fadeIn(0);

            if (elems["optionsButton"] && !params.Shared) that.create_options_menu(elems["optionsButton"], itemObject, {
                OnEdit: function () { bodyTextObj.GoToEditMode(); },
                OnRemove: function () {
                    GlobalUtilities.confirm(RVDic.Confirms.DoYouWantToRemoveN.replace("[n]", RVDic.Post), function (result) {
                        if (!result) return;

                        SharingAPI[isComment ? "RemoveComment" : "RemovePost"]({
                            PostID: itemId, CommentID: itemId, ParseResults: true,
                            ResponseHandler: function (result) {
                                if (result.ErrorText) return alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                                else retObj.Dispose();
                            }
                        });
                    });
                },
                OnShare: function () { that.share_dialog(itemObject); }
            });

            if (elems["likeIcon"]) elems["likeIcon"].onclick = function () {
                var btn = this;

                if (btn.Processing) return;
                btn.Processing = true;

                var newLikeStatus = itemObject.LikeStatus === true ? null : true;

                SharingAPI.LikeDislike({
                    PostID: isComment ? null : itemId,
                    CommentID: isComment ? itemId : null,
                    Like: newLikeStatus, ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.Succeed) {
                            itemObject.LikeStatus = newLikeStatus;
                            itemObject.LikesCount += newLikeStatus ? 1 : -1;

                            retObj.SetLikeStatus();
                        }

                        btn.Processing = false;
                    }
                });
            };

            var retObj = {
                ID: itemId,
                Item: itemObject,
                IsComment: isComment,
                SetDescription: function (desc) {
                    itemObject.Description = desc;
                    bodyTextObj.Set();
                },
                SetLikeStatus: function () {
                    if (elems["likeIcon"]) {
                        elems["likeIcon"].classList.remove("fa-heart");
                        elems["likeIcon"].classList.remove("fa-heart-o");
                        elems["likeIcon"].classList.add(itemObject.LikeStatus === true ? "fa-heart" : "fa-heart-o");
                    }

                    if (elems["likesCount"]) {
                        elems["likesCount"].innerHTML = GlobalUtilities.convert_numbers_to_persian(itemObject.LikesCount || "0");
                        elems["likesCount"].style.cursor = itemObject.LikesCount ? "pointer" : "default";
                        elems["likesCount"].onclick = !itemObject.LikesCount ? null :
                            function () { that.show_users(itemObject.CommentID || itemObject.PostID, isComment ? "Comment" : "Post", true); };
                    }
                },
                SetCommentsCount: function () {
                    if (elems["commentIcon"]) {
                        elems["commentIcon"].classList.remove("fa-comment-o");
                        elems["commentIcon"].classList.add("fa-comment-o");
                    }

                    if (elems["commentsCount"]) elems["commentsCount"].innerHTML =
                        GlobalUtilities.convert_numbers_to_persian(itemObject.CommentsCount || "0");
                },
                NewComment: function () {
                    that.create_new_comment_area(elems["newCommentArea"], itemObject, function (comment) {
                        itemObject.CommentsCount++;
                        retObj.SetCommentsCount();
                        that.create_post_comment(elems["commentsArea"], comment, { Add2Top: false });
                    });
                },
                AddComment: function (comment, params) {
                    return that.create_post_comment(elems["commentsArea"], comment, params);
                },
                Dispose: function () {
                    that.Objects.Items[itemId] = null;
                    jQuery(elems["container"]).animate({ height: "toggle" }, 500, function () { this.remove(); });
                }
            };

            if (!params.Shared) that.Objects.Items[itemId] = retObj;

            retObj.SetLikeStatus();
            retObj.SetCommentsCount();

            return true;
        },

        share_dialog: function (item) {
            var that = this;
            item = item || {};
            
            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-8 medium-7 large-6 rv-border-radius-1 SoftBackgroundColor",
                Style: "margin:0 auto; padding:1rem;", Name: "container"
            }]);

            GlobalUtilities.loading(elems["container"]);
            var showed = GlobalUtilities.show(elems["container"]);

            GlobalUtilities.load_files(["SharingManager/ShareDialog.js"], {
                OnLoad: function () {
                    new ShareDialog(elems["container"], {
                        OwnerID: that.Objects.OwnerID, Post: item,
                        Done: function () { showed.Close(); }
                    });
                }
            });
        },

        hide_share_dialog: function () {
            if (that.Objects.ShareDialog === null) return;

            var that = this;

            that.Objects.ShareDialog.PopupDialog.Close();

            that.Objects.ShareDialog.Autosuggest.values = [];
            that.Objects.ShareDialog.Autosuggest.keywords = [];
            that.Objects.ShareDialog.Autosuggest.selectedIndex = -1;
            that.Objects.ShareDialog.Input.value = "";
            that.Objects.ShareDialog.ObjectTypeSelect.selectedIndex = 0;
            that.Objects.ShareDialog.Textarea.clear ?
                that.Objects.ShareDialog.Textarea.clear() :
                that.Objects.ShareDialog.Textarea.value = "";

            that.Objects.ShareDialog.PrivacySelect.style.display = "block";
        },

        add_post: function (postObject, params) {
            var that = this;
            return that.create_post_comment(that.Interface.PostsArea, postObject, params);
        },

        add_posts: function (postsArray, params) {
            if (postsArray == null) return false;

            params = params || {};
            if (params.Add2Top === true) postsArray.reverse();

            var count = postsArray.length;

            for (var i = 0, lnt = count; i < lnt; ++i)
                this.add_post(postsArray[i], postsArray[i].Params || params);

            return count <= 0 ? false : (count == postsArray.length ? true : count);
        },

        get_posts: function () {
            var that = this;
            
            if (that._GettingPosts) return;
            that._GettingPosts = true;
            
            that.loading();
            
            if (that.Objects.PostID) {
                SharingAPI.GetPost({
                    PostID: that.Objects.PostID, OwnerInfo: !!that.Interface.OwnerInfoArea, ParseResults: true,
                    ResponseHandler: function (result) {
                        that.set_owner_info(result.OwnerInfo || {});
                        that.add_post(that.parse_post(result.Post || {}));

                        that._GettingPosts = false;
                    }
                });
            }
            else {
                SharingAPI.GetPosts({
                    OwnerID: that.Objects.OwnerID, Count: that.Options.Count, MaxDate: that.Objects.LastPostDate,
                    OwnerInfo: !!that.Interface.OwnerInfoArea, News: that.Options.NewsMode, ParseResults: true,
                    ResponseHandler: function (result) {
                        that.set_owner_info(result.OwnerInfo || {});

                        that.Objects.FirstPostDate = result.FirstDate;
                        that.Objects.LastPostDate = result.LastDate;

                        that.set_more_button_text(RVDic.More);

                        (result.Posts || []).forEach(function (p) { that.add_post(that.parse_post(p)); });

                        var postsCount = (result.Posts || []).length;
                        that.toggle_more_button(!postsCount || (postsCount < that.Options.Count));

                        that._GettingPosts = false;
                    }
                });
            }
        },

        get_comments: function (params) {
            var that = this;
            params = params || {};

            var postId = params.PostID;

            that.__CommentsGot = that.__CommentsGot || [];

            if (that.__CommentsGot[postId] || that.__GettingComments) return;
            that.__GettingComments = true;

            SharingAPI.GetComments({
                PostID: postId, ParseResults: true,
                ResponseHandler: function (result) {
                    var comments = result.Comments || [];

                    for (var i = 0, lnt = comments.length; i < lnt; ++i)
                        comments[i] = that.parse_comment(comments[i], postId);

                    //that.add_comments(comments, postId, { Add2Top: true });

                    that.__GettingComments = false;
                    that.__CommentsGot[postId] = true;
                }
            });
        },

        parse_post: function (post) {
            var that = this;

            var fullName = GlobalUtilities.trim(Base64.decode((post.Sender || {}).FirstName || " ") + " " +
                Base64.decode((post.Sender || {}).LastName || " "));
            var originalFullName = GlobalUtilities.trim(Base64.decode((post.OriginalSender || {}).FirstName || " ") + " " +
                Base64.decode((post.OriginalSender || {}).LastName || " "));

            var hasReceiver = (Base64.decode(post.OwnerType) == "User") &&
                (post.OwnerID != (post.IsOriginal ? (post.OriginalSender || {}).UserID : (post.Sender || {}).UserID));

            return {
                PostID: post.PostID,
                LikeStatus: GlobalUtilities.get_type(post.LikeStatus) == "boolean" ? post.LikeStatus === true : null,
                LikesCount: post.LikesCount,
                DislikesCount: post.DislikesCount,
                CommentsCount: post.CommentsCount,
                SendDate: (post.IsOriginal ? post.OriginalSendDate : post.SendDate),
                NDaysAgo: (post.IsOriginal ? post.OriginalNDaysAgo : post.NDaysAgo),
                Description: (post.IsOriginal ? Base64.decode(post.OriginalDescription) : Base64.decode(post.Description)),
                Options: {
                    Editable: post.Editable === true,
                    Removable: post.Removable === true
                },
                Sender: {
                    UserID: (post.IsOriginal ? (post.OriginalSender || {}).UserID : (post.Sender || {}).UserID),
                    Name: post.IsOriginal ? originalFullName : fullName,
                    ImageURL: GlobalUtilities.add_timestamp(post.IsOriginal ? post.OriginalSenderProfileImage : post.SenderProfileImage),
                    JobTitle: GlobalUtilities.trim(post.IsOriginal ?
                        Base64.decode((post.OriginalSender || {}).JobTitle) : Base64.decode((post.Sender || {}).JobTitle))
                },
                Receiver: !hasReceiver ? null : {
                    UserID: post.OwnerID,
                    Name: Base64.decode(post.OwnerTitle),
                    ImageURL: GlobalUtilities.add_timestamp(post.OwnerImageURL)
                },
                OriginalPost: post.IsOriginal ? null : {
                    PostID: post.RefPostID,
                    Description: Base64.decode(post.OriginalDescription),
                    Sender: {
                        UserID: (post.OriginalSender || {}).UserID,
                        Name: originalFullName,
                        ImageURL: GlobalUtilities.add_timestamp(post.OriginalSenderProfileImage),
                        JobTitle: Base64.decode((post.OriginalSender || {}).JobTitle)
                    }
                },
                OwnerID: post.OwnerID,
                PictureID: post.PictureID,
                IsPublic: String(Base64.decode(post.Privacy) || "_").toLowerCase() == "public",
                Comments: (post.Comments || []).map(function (c) { return that.parse_comment(c, post.PostID); })
            };
        },

        parse_comment: function (comment, postId) {
            var that = this;

            return {
                CommentID: comment.CommentID,
                PostID: postId || comment.PostID,
                LikeStatus: comment.LikeStatus,
                LikesCount: comment.LikesCount,
                DislikesCount: comment.DislikesCount,
                SendDate: comment.SendDate,
                NDaysAgo: comment.NDaysAgo,
                Description: Base64.decode(comment.Description),
                Options: {
                    Editable: comment.Editable,
                    Removable: comment.Removable
                },
                Sender: {
                    UserID: (comment.Sender || {}).UserID,
                    Name: Base64.decode((comment.Sender || {}).FirstName) + " " + Base64.decode((comment.Sender || {}).LastName),
                    ImageURL: (comment.Sender || {}).ProfileImageURL
                }
            };
        },

        show_users: function (itemId, subjectType, likeStatus) {
            var that = this;

            var strLikeStatus = String(!!likeStatus).toLowerCase();

            that.UserContainers = that.UserContainers || {};
            that.UserContainers[likeStatus] = that.UserContainers[likeStatus] || {};

            if (that.UserContainers[strLikeStatus][itemId])
                return GlobalUtilities.show(that.UserContainers[strLikeStatus][itemId]);

            var _div = that.UserContainers[strLikeStatus][itemId] =
                GlobalUtilities.create_nested_elements([{ Type: "div", Name: "_div" }])["_div"];

            GlobalUtilities.loading(_div);
            GlobalUtilities.show(_div);

            return GlobalUtilities.load_files(["Social/RelatedUsersViewer.js"], {
                OnLoad: function () {
                    new RelatedUsersViewer(_div, {
                        SubjectID: itemId, SubjectType: subjectType, LikeStatus: likeStatus
                    });
                }
            });
        },

        show_ref_post: function (e, postId) {
            var that = this;

            if (e.ctrlKey) return window.open(SharingAPI.PostPageURL({ PostID: postId }));

            if (that.__RefPostDiv) return GlobalUtilities.show(that.__RefPostDiv);

            var _div = that.__RefPostDiv = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-9 large-8 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0rem auto; padding:1rem;", Name: "_div"
                }
            ])["_div"];

            GlobalUtilities.loading(_div);
            GlobalUtilities.show(_div);

            new SharingManager({
                Container: _div, OwnerInfoArea: null, OwnerID: null,
                InitialFill: true, OwnerType: null, PostID: postId, Permissions: null
            });
        },

        realtime: function () {
            var that = this;

            if (!window.RaaiVanHub || !that.Options.RealTimeFeedID || !that.Options.RealTime ||
                !((window.RVGlobal || {}).Modules || {}).RealTime) return;

            RaaiVanHub.add_listeners([
                {
                    UniqueID: GlobalUtilities.generate_new_guid(),
                    Name: "NewPost",
                    FeedID: that.Options.RealTimeFeedID,
                    Func: function (d) {
                        if ((d.Sender || {}).UserID == ((window.RVGlobal || {}).CurrentUser || {}).UserID) return;

                        d.Removable = d.Editable = false;
                        if (that.add_post(that.parse_post(d.Post || d), { Add2Top: true })) that.notify(d);
                    }
                },
                {
                    UniqueID: GlobalUtilities.generate_new_guid(),
                    Name: "ModifyPost",
                    FeedID: that.Options.RealTimeFeedID,
                    Func: function (d) {
                        if ((that.Objects.Items[d.PostID] || {}).SetDescription)
                            that.Objects.Items[d.PostID].SetDescription(Base64.decode(d.Description));
                        that.update_notification(d.PostID, d.Description);
                    }
                },
                {
                    UniqueID: GlobalUtilities.generate_new_guid(),
                    Name: "RemovePost",
                    FeedID: that.Options.RealTimeFeedID,
                    Func: function (d) {
                        if ((that.Objects.Items[d.PostID] || {}).Dispose) that.Objects.Items[d.PostID].Dispose();
                        that.remove_notification(d.PostID, true);
                    }
                },
                {
                    UniqueID: GlobalUtilities.generate_new_guid(),
                    Name: "NewComment",
                    FeedID: that.Options.RealTimeFeedID,
                    Func: function (d) {
                        if ((d.Sender || {}).UserID == ((window.RVGlobal || {}).CurrentUser || {}).UserID) return;
                        
                        d.Removable = d.Editable = false;
                        if ((that.Objects.Items[d.PostID] || {}).AddComment &&
                            that.Objects.Items[d.PostID].AddComment(that.parse_comment(d, d.PostID), { Add2Top: false })) that.notify(d);
                    }
                },
                {
                    UniqueID: GlobalUtilities.generate_new_guid(),
                    Name: "ModifyComment",
                    FeedID: that.Options.RealTimeFeedID,
                    Func: function (d) {
                        if ((that.Objects.Items[d.CommentID] || {}).SetDescription)
                            that.Objects.Items[d.CommentID].SetDescription(Base64.decode(d.Description));
                        that.update_notification(d.CommentID, d.Description);
                    }
                },
                {
                    UniqueID: GlobalUtilities.generate_new_guid(),
                    Name: "RemoveComment",
                    FeedID: that.Options.RealTimeFeedID,
                    Func: function (d) {
                        if ((that.Objects.Items[d.CommentID] || {}).Dispose) that.Objects.Items[d.CommentID].Dispose();
                        that.remove_notification(d.CommentID, false);
                    }
                }
            ]);
        },

        notify: function (obj) {
            var that = this;

            var senderUserId = ((obj || {}).Sender || {}).UserID;

            if (!obj || ((obj.Sender || {}).UserID == (window.RVGlobal || {}).CurrentUserID)) return;

            var isPost = !obj.CommentID;

            var id = obj.CommentID || obj.PostID;
            var profileImgeUrl = obj.SenderProfileImage || obj.ProfileImageURL || (obj.Sender || {}).ProfileImageURL;
            var description = obj.Description || obj.OriginalDescription;
            var firstName = Base64.decode((obj.Sender || {}).FirstName || (obj.OriginalSender || {}).FirstName);
            var lastName = Base64.decode((obj.Sender || {}).LastName || (obj.OriginalSender || {}).LastName);

            var area = window.POSTSNOTIFICATIONAREA = window.POSTSNOTIFICATIONAREA || GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "rv-border-radius-quarter rv-trim-vertical-margins SoftShadow", Name: "_div",
                    Style: "position:fixed; bottom:4rem;" + RV_RevFloat + ":1rem; width:20rem; padding:0.3rem;" +
                        "background-color:rgba(0,0,0,0.6); max-height:calc(100vh - 20rem); overflow:hidden; display:none;"
                }
            ], document.body)["_div"];

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Name: "container",
                    Class: "small-12 medium-12 large-12 rv-border-radius-quarter " +
                        (isPost ? "rv-bg-color-white-softer SoftBorder" : "rv-bg-color-softer-soft"),
                    Style: "position:relative; padding:0.3rem; padding-" + RV_Float + ":2.8rem;" +
                        "padding-" + RV_RevFloat + ":1.5rem; cursor:pointer; min-height:2.6rem; margin-top:0.3rem; display:none;",
                    Link: RVAPI.PostsPageURL({ PostID: obj.PostID }), Params: { IgnoreMouseEvents: true },
                    Childs: [
                        {
                            Type: "div", Style: "position:absolute; top:0.3rem;" + RV_Float + ":0.3rem;",
                            Childs: [
                                {
                                    Type: "img", Class: "rv-border-radius-quarter", Style: "width:2rem; height:2rem;",
                                    Link: RVAPI.UserPageURL({ UserID: senderUserId }),
                                    Tooltip: firstName + " " + lastName, TooltipAlign: RV_RevFloat,
                                    Attributes: [{ Name: "src", Value: profileImgeUrl }]
                                }
                            ]
                        },
                        {
                            Type: "div", Style: "position:absolute; top:0.2rem;" + RV_RevFloat + ":0.3rem;",
                            Childs: [
                                {
                                    Type: "i", Class: "fa fa-times fa-lg rv-icon-button",
                                    Attributes: [{ Name: "aria-hidden", Value: true }],
                                    Properties: [{ Name: "onclick", Value: function (e) { e.stopPropagation(); _remove(); } }]
                                }
                            ]
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Style: "font-size:0.7rem;", Name: "desc" }
                    ]
                }
            ]);

            var _div = elems["container"];

            area.insertBefore(_div, area.firstChild);

            var _set_desc = function (desc) {
                desc = GlobalUtilities.get_text_begining(Base64.decode(desc), 40, "...");

                elems["desc"].innerHTML = "";

                GlobalUtilities.create_nested_elements([
                    (isPost ? null : {
                        Type: "span", Style: "margin-" + RV_RevFloat + ":0.3rem; color:blue;",
                        Childs: [{ Type: "text", TextValue: RVDic.Comment }]
                    }),
                    { Type: "text", TextValue: GlobalUtilities.convert_numbers_to_persian(desc) }
                ], elems["desc"]);
            };

            _set_desc(description);

            var _remove = function () {
                jQuery(_div).fadeOut(500, function () {
                    this.remove();
                    if (!area.firstChild) jQuery(area).fadeOut(100);
                });

                area.Notifications[id] = null;
            };

            setTimeout(_remove, 10000);

            jQuery(area).fadeIn(500);
            jQuery(_div).fadeIn(500);

            area.Notifications = area.Notifications || {};
            area.Notifications[id] = {
                PostID: obj.PostID,
                Remove: function () { _remove(); },
                Update: function (desc) { _set_desc(desc); }
            };
        },

        remove_notification: function (id, isPost) {
            var that = this;

            var dic = (window.POSTSNOTIFICATIONAREA || {}).Notifications || {};

            if (dic[id]) dic[id].Remove();

            if (isPost) {
                for (var x in dic)
                    if (dic[x] && (dic[x].PostID == id)) dic[x].Remove();
            }
        },

        update_notification: function (id, desc) {
            var that = this;
            if (((window.POSTSNOTIFICATIONAREA || {}).Notifications || {})[id])
                window.POSTSNOTIFICATIONAREA.Notifications[id].Update(desc);
        }
    }
})();