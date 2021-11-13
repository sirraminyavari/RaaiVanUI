(function () {
    if (window.WorkFlowViewer) return;

    window.WorkFlowViewer = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (this.ContainerDiv == null) return;

        params = params || {};

        this.OptionsArea = null;
        this.HistoryArea = null;

        this.Objects = {
            OwnerID: params.OwnerID,
            HistoryID: null,
            Description: null,
            AttachedFiles: {},
            DescriptionNeeded: null,
            HistoryViewer: null,
            FormViewer: null
        };

        this.Options = {
            FormInstanceIDToBeFilled: null,
            OnInit: params.OnInit,
            OnEnd: params.OnEnd
        };

        var that = this;

        GlobalUtilities.load_files(["API/WFAPI.js", "MediaManager/MediaManager.js"], {
            OnLoad: function () {
                WFAPI.GetOwnerHistory({
                    OwnerID: that.Objects.OwnerID, LastOnly: true, Done: true,
                    ParseResults: true,
                    ResponseHandler: function (_hstry) { that.initialize(_hstry); }
                });
            }
        });
    }

    WorkFlowViewer.prototype = {
        initialize: function (lastHist) {
            var that = this;
            
            that.ContainerDiv.innerHTML = "";

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "font-size:0.7rem;", Name: "optionsArea"
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "historyContainer",
                            Style: "margin-top:1rem; display:none;",
                            Childs: [
                                { Type: "hr", Class: "small-12 medium-12 large-12" },
                                {
                                    Type: "div", Name: "historyButton",
                                    Class: "small-12 medium-12 large-12 rv-border-radius-quarter DashedAutoHideBorder",
                                    Style: "cursor:pointer; padding:0.5rem; text-align:center; font-weight:bold;",
                                    Childs: [{ Type: "text", TextValue: RVDic.ViewHistory }]
                                },
                                { Type: "div", Class: "small-12 medium-12 large-12", Name: "historyArea" }
                            ]
                        }
                    ]
                }
            ], that.ContainerDiv);

            that.OptionsArea = elems["optionsArea"];
            that.HistoryArea = elems["historyArea"];

            elems["historyButton"].onclick = function () {
                that.show_history(elems["historyArea"], elems["historyButton"]);
            };

            if (that.Options.OnInit) that.Options.OnInit.call(that);
        },

        show_history: function (containerDiv, button) {
            if (this.__ShowingHistory) return;
            this.__ShowingHistory = true;

            button.parentNode.removeChild(button);

            var that = this;

            GlobalUtilities.load_files([
                { Root: "API/", Ext: "js", Childs: ["SharingAPI", "CNAPI"] },
                "WorkFlowManager/HistoryViewer.js"
            ], {
                OnLoad: function () {
                    that.Objects.HistoryViewer = new HistoryViewer(containerDiv, { OwnerID: that.Objects.OwnerID });
                    that.Objects.HistoryViewer.show();
                }
            });
        },

        _preshow: function () {
            var that = this;

            GlobalUtilities.load_files([
                { Root: "API/", Ext: "js", Childs: ["WFAPI", "FGAPI", "DocsAPI"] },
                "MediaManager/MediaManager.js"
            ], {
                OnLoad: function () {
                    that.__Initialized = true;
                    that.show();
                }
            });
        },

        show: function () {
            if (!this.__Initialized) return this._preshow();

            if (this.__Processing) return;
            this.__Processing = true;

            var that = this;

            that.OptionsArea.innerHTML = "";

            GlobalUtilities.loading(that.OptionsArea);

            WFAPI.GetWorkFlowOptions({
                OwnerID: that.Objects.OwnerID, ParseResults: true,
                ResponseHandler: function (result) {
                    if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                    else if (result.ViewerStatus == "None") {
                        if (that.Options.OnEnd) {
                            alert(RVDic.MSG.OperationCompletedSuccessfully);
                            that.Options.OnEnd();
                        }
                        else that.ContainerDiv.innerHTML = "";
                    }
                    else {
                        if (result.HasHistory && that.HistoryArea && that.HistoryArea.parentNode)
                            jQuery(that.HistoryArea.parentNode).fadeIn(500);
                        that.initialize_options(result);
                    }

                    that.__Processing = false;
                }
            });
        },

        initialize_options: function (params) {
            params = params || {};
            var that = this;

            that.OptionsArea.innerHTML = "";

            that.Objects.HistoryID = params.HistoryID;
            that.Objects.DescriptionNeeded = params.DescriptionNeeded === true;
            that.Objects.AttachedFiles = {};

            var workflowStateId = params.WorkFlowStateID || "";

            var description = Base64.decode(params.Description || "");
            var dataNeeds = params.DataNeeds || [];
            var dataNeedsDescription = dataNeeds.length > 0 ? Base64.decode(params.DataNeedsDescription || "") : "";
            var stateTitle = Base64.decode(params.StateTitle || "");
            var Connections = params.Connections || [];
            var isDirector = params.ViewerStatus == "Director";
            var isOwner = params.ViewerStatus == "Owner";
            var isAdmin = params.IsAdmin === true;
            var postsCount = params.PostsCount || "0";
            var finishable = params.Finishable === true;
            var isTerminated = params.IsTerminated === true;
            var restartable = isTerminated && (isAdmin || isOwner);

            var formInstanceIdToBeFilled = that.Options.FormInstanceIDToBeFilled = params.FormInstanceIDToBeFilled || "";

            var creatorArr = [];
            if (params.Creator) {
                var _creator = params.Creator;

                creatorArr.push({
                    Type: "div", Class: "small-12 medium-12 large-12", Style: "margin-bottom:1rem;",
                    Childs: [
                        {
                            Type: "div", Style: "display:inline-block;",
                            Childs: [
                                {
                                    Type: "img", Class: "rv-border-radius-quarter",
                                    Style: "width:2.5rem; height:2.5rem;",
                                    Attributes: [{ Name: "src", Value: _creator.ProfileImageURL }]
                                }
                            ]
                        },
                        {
                            Type: "div", Link: RVAPI.UserPageURL({ UserID: _creator.UserID }),
                            Style: "display:inline-block; margin:0.5rem 0.5rem 0rem 0.5rem; font-weight:bold;",
                            Childs: [{ Type: "text", TextValue: Base64.decode(_creator.FirstName) + " " + Base64.decode(_creator.LastName) + " (ثبت کننده)" }]
                        }
                    ]
                });
            }

            var sharingRoom = [];
            if (!isOwner && !isTerminated) {
                var els = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-10 medium-8 large-7 rv-border-radius-1 SoftBackgroundColor",
                        Style: "margin:0rem auto; padding:1rem;", Name: "container",
                        Childs: [
                            {
                                Type: "div", Class: "small-12 medium-12 large-12",
                                Style: "margin-bottom:1rem; font-weight:bold; text-align:center;",
                                Childs: [{ Type: "text", TextValue: "اتاق هم اندیشی" }]
                            },
                            { Type: "div", Class: "small-12 medium-12 large-12", Name: "sharingDiv" }
                        ]
                    }
                ]);

                var _cntnr = els["container"];
                var _sharingContainer = els["sharingDiv"];

                sharingRoom.push({
                    Type: "div",
                    Style: "display:inline-block; cursor:pointer; font-weight:bold; color:green; margin-top:0.5rem;",
                    Properties: [
                        { Name: "onmouseover", Value: function () { this.style.color = "red"; } },
                        { Name: "onmouseout", Value: function () { this.style.color = "green"; } },
                        {
                            Name: "onclick",
                            Value: function () {
                                var btn = this;

                                if (btn._SharingManager) return GlobalUtilities.show(_cntnr);

                                GlobalUtilities.loading(_sharingContainer);
                                GlobalUtilities.show(_cntnr);

                                GlobalUtilities.load_files(["SharingManager/SharingManager.js"], {
                                    OnLoad: function () {
                                        btn._SharingManager = new SharingManager({
                                            PostsContainerDivID: _sharingContainer, OwnerObjectID: that.Objects.HistoryID,
                                            HidePrivacyOptions: true, InitialFill: true, OwnerType: "WFHistory",
                                            Permissions: { AddPost: true }, PostLike: false, PostDislike: false,
                                            PostShare: false, PostsRemovable: false, ShowComments: false,
                                            OnPostCreate: function () { that.__OnPostCreate(); }
                                        });
                                    }
                                });
                            }
                        }
                    ],
                    Childs: [
                        {
                            Type: "text", Name: "sharingTitle",
                            TextValue: "ورود به اتاق هم اندیشی" + (postsCount == 0 ? "" : " (" + postsCount + " " + "نظر" + ")")
                        }
                    ]
                });
            }

            var create_button = function (p) {
                p = p || {};

                return {
                    Type: "div", Name: p.Name,
                    Class: "small-10 medium-8 large-6 rv-circle rv-bg-color-trans-white",
                    Style: "font-weight:bold; margin:0rem auto 0.4rem auto; text-align:center;" +
                        "padding:0.3rem; cursor:pointer;",
                    Properties: !p.OnClick ? null : [{ Name: "onclick", Value: p.OnClick }],
                    Childs: [{ Type: "text", TextValue: p.Title }]
                };
            };

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "text-align:center; margin-bottom:1rem; font-size:1rem;",
                    Childs: [
                        {
                            Type: "div", Style: "display:inline-block; margin-" + RV_RevFloat + ":0.3rem;",
                            Childs: [{ Type: "text", TextValue: "وضعیت کنونی:" }]
                        },
                        {
                            Type: "div", Style: "display:inline-block; font-weight:bold;",
                            Childs: [{ Type: "text", TextValue: stateTitle }]
                        }
                    ]
                },
                { Type: "div", Class: "small-12 medium-12 large-12", Childs: creatorArr },
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "display:none; margin-bottom:1rem; text-align:justify;", Name: "headerArea"
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "display:none; margin-bottom:1rem;", Name: "dataNeedsDiv",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "dataNeedsDescriptionArea",
                            Style: "display:none; margin-bottom:0.5rem;"
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "dataNeedsArea" }
                    ]
                },
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "descriptionArea" },
                { Type: "div", Class: "small-12 medium-12 large-12", Childs: sharingRoom },
                {
                    Type: "div", Name: "pollArea",
                    Class: "small-12 medium-12 large-12 rv-border-radius-half SoftBorder",
                    Style: "display:none; margin:1rem 0rem; padding:0.5rem; background-color:white;"
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12 rv-bg-color-trans-white rv-border-radius-half",
                    Style: "margin:1rem 0rem; padding:0.5rem;", Name: "attachmentsArea"
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: (finishable && !isTerminated ? "" : "display:none;"),
                    Childs: [create_button({ Name: "terminateButton", Title: RVDic.TerminateWorkFlow })]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Style: (isTerminated ? "" : "display:none;"),
                    Childs: [
                        {
                            Type: "div", Style: "font-weight:bold; text-align:center; color:gray; margin-top:1rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.Terminated }]
                        }
                    ]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Style: (restartable ? "" : "display:none;"),
                    Childs: [create_button({ Name: "restartButton", Title: RVDic.RestartWorkFlow })]
                },
                { Type: "div", Style: "margin-top:0.5rem; display:none;", Name: "rejectArea" },
                {
                    Type: "div", Name: "formToBeFilled", Style: "display:none; padding:0.5rem; margin-top:1rem;",
                    Class: "small-12 medium-12 large-12 rv-border-radius-half SoftBorder"
                },
                { Type: "div", Style: "margin-top:1rem; display:none;", Name: "optionsArea" }
            ], this.OptionsArea);

            var terminateButton = elems["terminateButton"];

            if (terminateButton) terminateButton.onclick = function () {
                if (that.__Sending) return;

                var desc = GlobalUtilities.trim(that.Objects.Description.get_data());
                if (!desc && that.Objects.DescriptionNeeded) return alert("لطفا نظر خود را وارد کنید");

                that.__Sending = true;

                WFAPI.TerminateWorkFlow({
                    HistoryID: that.Objects.HistoryID, Description: Base64.encode(desc),
                    ResponseHandler: function (responseText) {
                        var result = JSON.parse(responseText);

                        that.__Sending = false;

                        if (result.ErrorText)
                            return alert(RVDic.WF.MSG[result.ErrorText] || RVDic.MSG[result.ErrorText] || result.ErrorText);

                        that.show();
                    }
                });
            }

            if (restartable) elems["restartButton"].onclick = function () {
                if (that.__Sending) return;
                that.__Sending = true;

                WFAPI.RestartWorkFlow({
                    OwnerID: that.Objects.OwnerID, ParseResults: true,
                    ResponseHandler: function (result) {
                        that.__Sending = false;
                        if (result.ErrorText)
                            return alert(RVDic.WF.MSG[result.ErrorText] || RVDic.MSG[result.ErrorText] || result.ErrorText);
                        that.show();
                    }
                });
            }
            
            if (params.Rejectable === true) {
                var _rejectTitle = Base64.decode(params.RejectionTitle || "") || RVDic.WF.Reject;

                elems["rejectArea"].style.display = "block";

                GlobalUtilities.create_nested_elements([
                    create_button({
                        Title: _rejectTitle,
                        OnClick: function () {
                            if (that.__Sending) return;

                            var description = GlobalUtilities.trim(that.Objects.Description.get_data());
                            if (description == "" && that.Objects.DescriptionNeeded)
                                return alert("لطفا نظر خود را وارد کنید");

                            that.__Sending = true;

                            WFAPI.SendToNextState({
                                HistoryID: that.Objects.HistoryID,
                                Description: Base64.encode(description), Reject: true, ParseResults: true,
                                ResponseHandler: function (result) {
                                    that.__Sending = false;

                                    if (result.ErrorText)
                                        return alert(RVDic.WF.MSG[result.ErrorText] || RVDic.MSG[result.ErrorText] || result.ErrorText);

                                    if (that.Objects.HistoryViewer != null) that.Objects.HistoryViewer.add_history(result.History, { AddToTop: true });
                                    that.show();
                                }
                            });
                        }
                    })
                ], elems["rejectArea"]);
            }

            if (description) {
                jQuery(elems["headerArea"]).fadeIn(0);

                GlobalUtilities.append_markup_text(elems["headerArea"], description);
            }

            var __sharingTitle = elems["sharingTitle"];
            if (__sharingTitle) {
                __sharingTitle.PostsCount = postsCount;

                that.__OnPostCreate = function () {
                    __sharingTitle.PostsCount = +__sharingTitle.PostsCount + 1;
                    __sharingTitle.data = "ورود به اتاق هم اندیشی" +
                        (__sharingTitle.PostsCount == 0 ? "" : " (" + __sharingTitle.PostsCount + " " + "نظر" + ")");
                }
            }

            if (isDirector && !isTerminated) {
                this.Objects.Description = new AdvancedTextArea({
                    ContainerDiv: elems["descriptionArea"],
                    DefaultText: "نظر شما " + (that.Objects.DescriptionNeeded ? "(ضروری)" : "(اختیاری)") + "...",
                    QueryTemplate: "RelatedThings",
                    ItemTemplate: { ItemsTitle: "Items", ID: "ItemID", Name: "Name", Type: "Type", ImageURL: "ImageURL" }
                });
            }

            if (dataNeedsDescription || dataNeeds.length) {
                jQuery(elems["dataNeedsDiv"]).fadeIn(0);

                if (dataNeedsDescription) {
                    jQuery(elems["dataNeedsDescriptionArea"]).fadeIn(0);
                    GlobalUtilities.append_markup_text(elems["dataNeedsDescriptionArea"], dataNeedsDescription);
                }

                jQuery.each(dataNeeds || [], function (ind, val) { that.add_data_need(elems["dataNeedsArea"], val); });
            }

            if ((params.Poll || {}).RefPollID) {
                elems["pollArea"].style.display = "block";

                GlobalUtilities.loading(elems["pollArea"]);

                GlobalUtilities.load_files(["Polls/PollStart.js"], {
                    OnLoad: function () {
                        var pl = params.Poll || {};
                        
                        new PollStart(elems["pollArea"], {
                            OwnerID: params.HistoryID,
                            OwnerType: "WorkFlow",
                            CopyFromPollID: pl.RefPollID,
                            PollID: pl.PollID,
                            PollName: pl.Name,
                            AudienceCount: pl.AudienceCount,
                            UseExistingPoll: true,
                            IsWorkFlowAdmin: isDirector
                        });
                    }
                });
            }

            that.set_attached_files(elems["attachmentsArea"], {
                AttachedFiles: params.Attachments, Editable: !!(params.Connections || []).length
            });

            jQuery.each(Connections || [], function (ind, val) {
                GlobalUtilities.create_nested_elements([
                    create_button({
                        Title: Base64.decode(val.Label),
                        OnClick: function () { that.show_option(val); }
                    })
                ], elems["optionsArea"]);
            });

            if (Connections.length) jQuery(elems["optionsArea"]).fadeIn(500);

            if (formInstanceIdToBeFilled) {
                jQuery(elems["formToBeFilled"]).fadeIn(0);

                GlobalUtilities.loading(elems["formToBeFilled"]);

                GlobalUtilities.load_files(["FormsManager/FormViewer.js"], {
                    OnLoad: function () {
                        that.Objects.FormViewer = new FormViewer(elems["formToBeFilled"], {
                            InstanceID: formInstanceIdToBeFilled, LimitOwnerID: workflowStateId,
                            ShowAllIfNoLimit: true, Editable: true, HideHeader: false, HideDescription: true, FillButton: false
                        });
                    }
                });
            }
        },

        set_attached_files: function (container, params) {
            params = params || {};
            var editable = params.Editable === true;
            var attachedFiles = params.AttachedFiles || [];
            var that = this;

            if (!editable && attachedFiles.length == 0) return container.parentNode.removeChild(container);

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Style: "font-weight:bold; margin-bottom:0.3rem;",
                    Childs: [{ Type: "text", TextValue: RVDic.Attachments }]
                },
                {
                    Type: "div", Name: "uploadArea",
                    Class: "small-12 medium-12 large-12 rv-border-radius-quarter SoftBorder",
                    Style: "padding:0.3rem; border-style:dashed; margin-bottom:0.5rem;" + (editable ? "" : "display:none;")
                },
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "attachedFiles" }
            ], container);

            var mediaManager = new MediaManager({ ContainerDiv: elems["attachedFiles"], UnlimitedDownloadAccess: true });

            var _clarify = function (_attachedFile) {
                _attachedFile.FileName = Base64.decode(_attachedFile.FileName);
                _attachedFile.DownloadLink = DocsAPI.GetDownloadLink({ FileID: _attachedFile.FileID });
                _attachedFile.Extension = Base64.decode(_attachedFile.Extension);
                return _attachedFile;
            }

            for (var i = 0, lnt = attachedFiles.length; i < lnt; ++i)
                attachedFiles[i] = _clarify(attachedFiles[i]);

            var mediaManagerParams = {
                Removable: editable, Acceptable: false,
                OnRemove: function (p) {
                    GlobalUtilities.confirm(RVDic.Confirms.DoYouWantToRemoveAttachedFile, function (result) {
                        if (!result) return;
                        p = p || {};
                        var file = p.File || {};
                        
                        DocsAPI.RemoveFile({
                            FileID: file.FileID, OwnerID: file.OwnerID, ParseResults: true,
                            ResponseHandler: function (result) {
                                if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                                else if (p.ContainerDiv) {
                                    p.ContainerDiv.parentNode.removeChild(p.ContainerDiv);
                                    that.Objects.AttachedFiles[file.FileID] = null;
                                }
                            }
                        });
                    });
                },
                OnAccept: function (p) { },
                OnAdd: function (p) { that.Objects.AttachedFiles[p.File.FileID] = p.File; }
            };

            mediaManager.add_items(attachedFiles, mediaManagerParams);

            var uploader = null;

            var _uploadParams = {
                UploadDataSource: DocsAPI.GetUploadLink({ OwnerID: that.Objects.HistoryID, OwnerType: "WorkFlow" }),
                Removable: editable,
                OnUpload: function (file, jsonResponse) {
                    var attachedFile = jsonResponse.AttachedFile;
                    if (attachedFile) mediaManager.add_item(_clarify(attachedFile), mediaManagerParams);
                    uploader.remove(file);
                },
                OnRemove: function (p) { }
            }

            if (editable) GlobalUtilities.uploader(elems["uploadArea"], _uploadParams, function (au) { uploader = au; });
        },

        get_attached_files_count: function () {
            var that = this;
            var cnt = 0;
            for (var id in (that.Objects.AttachedFiles || {}))
                if (that.Objects.AttachedFiles[id])++cnt;
            return cnt;
        },

        add_data_need: function (_div, dataNeed) {
            var that = this;

            var nodeTypeId = dataNeed.NodeTypeID || "";
            var nodeType = Base64.decode(dataNeed.NodeType || "");
            var multiselect = dataNeed.MultiSelect === true;
            var admin = dataNeed.Admin === true;
            var necessary = dataNeed.Necessary === true;
            var formId = dataNeed.FormID || "";
            var formTitle = Base64.decode(dataNeed.FormTitle || "");
            var instances = dataNeed.Instances || [];

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-half SoftBorder",
                    Style: "border-color:black; padding:0.5rem",
                    Childs: [
                        { Type: "div", Class: "small-12 medium-8 large-6", Style: "display:none;", Name: "inputArea" },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "instancesArea" }
                    ]
                }
            ], _div);

            var inputArea = elems["inputArea"];
            var instancesArea = elems["instancesArea"];

            var _show_input_area = function () { inputArea.style.display = "block"; }
            var _hide_input_area = function () { inputArea.style.display = "none"; }

            if (multiselect === true || instances.length == 0) _show_input_area();

            var nodeAutosuggest = GlobalUtilities.append_autosuggest(elems["inputArea"],
                {
                    InputClass: "rv-input",
                    InputStyle: "width:100%;",
                    AjaxDataSource: CNAPI.GetNodesDataSource({ NodeTypeID: nodeTypeId }),
                    ResponseParser: function (responseText) {
                        var items = JSON.parse(responseText).Nodes || [];
                        var arr = [];
                        for (var i = 0, lnt = items.length; i < lnt; ++i) {
                            var tt = Base64.decode(items[i].Name || "");
                            if (items[i].AdditionalID) tt += " - " + Base64.decode(items[i].AdditionalID || "");
                            arr.push([tt, items[i].NodeID]);
                        }
                        return arr;
                    },
                    OnSelect: function () { dataNeed.onclick(); }
                });

            GlobalUtilities.set_inner_title(nodeAutosuggest.InputElement, "ارسال فرم" + " '" + formTitle + "' " +
                "برای" + " '" + nodeType + "' " + "...");

            var _on_unfill = function (params) {
                for (var i = i, lnt = (instances || []).length; i < lnt; ++i)
                    if (instances[i].InstanceID == (params || []).InstanceID) instances[i].Filled = false;
            }

            var _on_instance_remove = function (params) {
                for (var i = 0, lnt = (instances || []).length; i < lnt; ++i)
                    if (instances[i].InstanceID == (params || []).InstanceID) instances[i] = null;
            }

            dataNeed.onclick = function () {
                var index = nodeAutosuggest.selectedIndex;
                if (index < 0) return;

                if (dataNeed.__Sending) return;

                var historyId = that.Objects.HistoryID;
                var nodeId = nodeAutosuggest.values[index];

                var nodeName = nodeAutosuggest.keywords[index];

                var __reset = function () {
                    nodeAutosuggest.InputElement.value = "";
                    nodeAutosuggest.SelectedIndex = -1;
                    GlobalUtilities.set_inner_title(nodeAutosuggest.InputElement, "ارسال فرم" + " '" + formTitle + "' " +
                            "برای" + " '" + nodeType + "' " + "...");
                }

                for (var i = 0, lnt = instances.length; i < lnt; ++i)
                    if (instances[i] != null && instances[i].NodeID == nodeId) { __reset(); return; }

                dataNeed.__Sending = true;

                WFAPI.CreateStateDataNeedInstance({
                    HistoryID: historyId, NodeID: nodeId, Admin: admin, FormID: formId,
                    ResponseHandler: function (responseText) {
                        var result = JSON.parse(responseText);

                        if (result.ErrorText) {
                            alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            dataNeed.__Sending = false;
                            return;
                        }

                        dataNeed.__Sending = false;

                        __reset();

                        var instanceId = result.InstanceID || "";

                        var newInstance = { NodeID: nodeId, NodeName: Base64.encode(nodeName), InstanceID: instanceId, Filled: false };
                        instances.push(newInstance);
                        that.add_data_need_instance(instancesArea, newInstance, { OnRemove: _on_instance_remove, OnUnfill: _on_unfill });
                    }
                });
            }

            for (var i = 0, lnt = instances.length; i < lnt; ++i)
                this.add_data_need_instance(instancesArea, instances[i], { OnRemove: _on_instance_remove, OnUnfill: _on_unfill });
        },

        add_data_need_instance: function (_div, instance, params) {
            var that = this;

            var nodeId = instance.NodeID;
            var nodeName = Base64.decode(instance.NodeName);
            var instanceId = instance.InstanceID;
            instance.Filled = instance.Filled === true;
            var FillingDate = instance.FillingDate;
            var creator = instance.Creator || {};
            creator.UserID = creator.UserID;
            creator.FullName = Base64.decode(creator.FullName);
            creator.ProfileImageURL = creator.ProfileImageURL;
            var attachments = instance.PreAttachedFiles || [];

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12 row",
                    Style: "margin:0rem; margin-top:0.5rem;", Name: "instanceDiv",
                    Childs: [
                        {
                            Type: "div", Style: "display:inline-block; width:1.5rem;",
                            Childs: [
                                {
                                    Type: "i", Class: "fa fa-times fa-lg rv-icon-button", Name: "removeButton",
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                }
                            ]
                        },
                        {
                            Type: "div", Style: "display:inline-block;",
                            Link: RVAPI.NodePageURL({ NodeID: nodeId }),
                            Childs: [{ Type: "text", TextValue: nodeName }]
                        },
                        { Type: "div", Style: "display:inline-block; margin:0rem 1rem; color:green;", Name: "descriptionArea" },
                        {
                            Type: "div", Name: "actionArea",
                            Style: "display:inline-block; color:blue; cursor:pointer;", 
                            Properties: [
                                { Name: "onmouseover", Value: function () { this.style.color = "red"; } },
                                { Name: "onmouseout", Value: function () { this.style.color = "blue"; } }
                            ]
                        },
                        {
                            Type: "div", Style: "margin-" + RV_Float + ":1rem; color:blue; cursor:pointer;" +
                                "display:" + (!instanceId ? "none" : "inline-block") + ";",
                            Properties: [
                                { Name: "onmouseover", Value: function () { this.style.fontWeight = "bold"; } },
                                { Name: "onmouseout", Value: function () { this.style.fontWeight = "normal"; } },
                                { Name: "onclick", Value: function () { that.show_state_data_need_instance(instance); } }
                            ],
                            Childs: [{ Type: "text", TextValue: "مشاهده جزییات" }]
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "attachmentArea" },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "attachedFilesArea" }
                    ]
                }
            ], _div);

            var instanceDiv = elems["instanceDiv"];
            var descriptionArea = elems["descriptionArea"];
            var actionArea = elems["actionArea"];
            var removeButton = elems["removeButton"];
            var attachmentArea = elems["attachmentArea"];
            var attachedFilesArea = elems["attachedFilesArea"];

            descriptionArea.innerHTML = !instance.Filled ? "تکمیل نشده" :
                "تکمیل شده در تاریخ" + (FillingDate == "" ? "" : " (" + FillingDate + ") ");

            if (instance.Filled) actionArea.innerHTML = "به بازبینی نیاز دارد";

            actionArea.onclick = function () {
                if (!instance.Filled || actionArea.__Processing) return;

                GlobalUtilities.confirm("در صورت ادامه، فرم به حالت تکمیل نشده خواهد رفت. آیا می خواهید ادامه دهید؟", function (result) {
                    if (!result) return;

                    actionArea.__Processing = true;

                    WFAPI.SetStateDataNeedInstanceAsNotFilled({
                        InstanceID: instanceId,
                        ResponseHandler: function (responseText) {
                            var result = JSON.parse(responseText);

                            if (result.ErrorText) {
                                alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                                actionArea.__Processing = false;
                            }
                            else {
                                instance.Filled = false;
                                descriptionArea.innerHTML = "تکمیل نشده";
                                actionArea.parentNode.removeChild(actionArea);
                                if (params.OnUnfill) params.OnUnfill({ InstanceID: instanceId });
                            }
                        }
                    });
                });
            }

            removeButton.onclick = function () {
                if (removeButton.__Removing) return;

                GlobalUtilities.confirm("آیا می خواهید فرم را حذف کنید؟", function (result) {
                    if (!result) return;

                    removeButton.__Removing = true;

                    WFAPI.RemoveStateDataNeedInstance({
                        InstanceID: instanceId,
                        ResponseHandler: function (responseText) {
                            var result = JSON.parse(responseText);

                            if (result.ErrorText) {
                                alert(result.ErrorText);
                                removeButton.__Removing = false;
                            }
                            else {
                                instanceDiv.parentNode.removeChild(instanceDiv);
                                if (params.OnRemove) params.OnRemove({ InstanceID: instanceId });
                            }
                        }
                    });
                });
            }

            //initialize uploader
            var mediaManager = new MediaManager({ ContainerDiv: attachedFilesArea });

            var _clarify = function (_attachedFile) {
                _attachedFile.FileName = Base64.decode(_attachedFile.FileName || "");
                _attachedFile.DownloadLink = DocsAPI.GetDownloadLink({ FileID: _attachedFile.FileID || "" });
                _attachedFile.Extension = Base64.decode(_attachedFile.Extension || "");
                return _attachedFile;
            }

            for (var i = 0, lnt = attachments.length; i < lnt; ++i)
                attachments[i] = _clarify(attachments[i]);

            var mediaManagerParams = {
                Removable: true, Acceptable: false,
                OnRemove: function (p) {
                    GlobalUtilities.confirm(RVDic.Confirms.DoYouWantToRemoveAttachedFile, function (result) {
                        if (!result) return;

                        p = p || {};
                        var file = p.File || {};

                        DocsAPI.RemoveFile({
                            FileID: file.FileID || "", OwnerID: file.OwnerID || "", ParseResults: true,
                            ResponseHandler: function (result) {
                                if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                                else if (p.ContainerDiv) p.ContainerDiv.parentNode.removeChild(p.ContainerDiv);
                            }
                        });
                    });
                },
                OnAccept: function () { }
            };

            mediaManager.add_items(attachments, mediaManagerParams);

            var uploader = null;
            
            var _uploadParams = {
                UploadDataSource: DocsAPI.GetUploadLink({ OwnerID: instanceId, OwnerType: "WorkFlow" }),
                Removable: true,
                OnUpload: function (file, jsonResponse) {
                    var attachedFile = jsonResponse.AttachedFile;
                    if (attachedFile) mediaManager.add_item(_clarify(attachedFile), mediaManagerParams);
                    uploader.remove(file);
                },
                OnRemove: function (file, jsonResponse, callback) { }
            };
            //end of initialize uploader
        },

        show_option: function (option) {
            var that = this;
            
            if (option.__ShowedDiv) return (option.__ShowedDiv.Showed = GlobalUtilities.show(option.__ShowedDiv));
            
            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-9 large-8 row rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0rem auto; padding:1rem;", Name: "container",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "margin-bottom:1rem; text-align:center; font-weight:bold;",
                            Childs: [{ Type: "text", TextValue: Base64.decode(option.Label) }]
                        },
                        {
                            Type: "div", Style: "display:none; padding:0.5rem;", Name: "formsArea",
                            Class: "small-12 medium-12 large-12 rv-bg-color-trans-white rv-border-radius-half",
                            Childs: [
                                {
                                    Type: "div", Class: "smll-12 medium-12 large-12",
                                    Style: "margin-bottom:0.5rem; color:rgb(100,100,100);",
                                    Childs: [{ Type: "text", TextValue: RVDic.WF.FillTheFormsBelow + ":" }]
                                },
                                { Type: "div", Class: "small-12 medium-12 large-12 rv-trim-vertical-margins", Name: "forms" }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 rv-bg-color-trans-white rv-border-radius-half",
                            Style: "display:none; padding:0.5rem;", Name: "nodeDiv",
                            Childs: [
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12",
                                    Style: "margin-bottom:0.5rem;", Name: "nodeTypeDescription"
                                },
                                { Type: "div", Class: "small-12 medium-12 large-12", Name: "nodeSelectArea" }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 rv-bg-color-trans-white rv-border-radius-half",
                            Style: "display:none; padding:0.5rem;", Name: "attachmentTitle"
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 rv-bg-color-trans-white rv-border-radius-half",
                            Style: "display:none; padding:0.5rem;", Name: "attachmentsArea"
                        },
                        {Type: "div", Class: "small-1 medium-1 large-1"},
                        {
                            Type: "div", Class: "small-4 medium-4 large-4 rv-air-button rv-circle", Name: "sendButton",
                            Style: "text-align:center; font-weight:bold; cursor:pointer; margin:1rem auto 0rem auto;",
                            Childs: [{ Type: "text", TextValue: RVDic.Send }]
                        },
                        { Type: "div", Class: "small-2 medium-2 large-2" },
                        {
                            Type: "div", Class: "small-4 medium-4 large-4 rv-air-button rv-circle", Name: "cancelButton",
                            Style: "text-align:center; font-weight:bold; cursor:pointer; margin:1rem auto 0rem auto;",
                            Childs: [{ Type: "text", TextValue: RVDic.Cancel }]
                        },
                        { Type: "div", Class: "small-1 medium-1 large-1" }
                    ]
                }
            ]);

            option.__ShowedDiv = elems["container"];

            option.__ShowedDiv.Showed = GlobalUtilities.show(elems["container"]);

            elems["cancelButton"].onclick = function () { option.__ShowedDiv.Showed.Close(); };
            
            if ((option.Forms || []).length) {
                jQuery(elems["formsArea"]).fadeIn(0);

                jQuery.each(option.Forms || [], function (ind, val) {
                    that.add_form(elems["forms"], val, { OutStateID: option.OutStateID });
                });
            }
            
            var nodeSelect = null;
            
            if ((option.NodeRequired === true) || option.DirectorNodeTypeID) {
                jQuery(elems["nodeDiv"]).fadeIn(0);

                if (option.NodeTypeDescription)
                    GlobalUtilities.append_markup_text(elems["nodeTypeDescription"], Base64.decode(option.NodeTypeDescription));

                nodeSelect = GlobalUtilities.append_autosuggest(elems["nodeSelectArea"], {
                    InputClass: "rv-input",
                    InputStyle: "width:100%; font-size:0.7rem;",
                    InnerTitle: RVDic.SelectN.replace("[n]", Base64.decode(option.DirectorNodeType)) + "...",
                    AjaxDataSource: CNAPI.GetNodesDataSource({ NodeTypeID: option.DirectorNodeTypeID }),
                    ResponseParser: function (responseText) {
                        var items = JSON.parse(responseText).Nodes || [];
                        var arr = [];
                        for (var i = 0, lnt = items.length; i < lnt; ++i) {
                            var tt = Base64.decode(items[i].Name) +
                                (!items[i].AdditionalID ? "" : " - " + Base64.decode(items[i].AdditionalID));
                            arr.push([tt, items[i].NodeID]);
                        }
                        return arr;
                    }
                });
            }
            
            if (option.AttachmentTitle || (option.AttachmentRequired === true)) {
                jQuery(elems["attachmentTitle"]).fadeIn(0);

                elems["attachmentTitle"].innerHTML = "";

                GlobalUtilities.create_nested_elements([
                    {
                        Type: "div",
                        Style: "display:" + (option.AttachmentTitle ? "inline-block" : "none") + ";" +
                            "margin-" + RV_RevFloat + ":0.5rem; color:rgb(100,100,100);",
                        Childs: [{ Type: "text", TextValue: RVDic.WF.OptionAttachmentSubject + ":" }]
                    },
                    {
                        Type: "div",
                        Style: "display:" + (option.AttachmentTitle ? "inline-block" : "none") + ";" +
                            "margin-" + RV_RevFloat + ":0.5rem;",
                        Childs: [{ Type: "text", TextValue: Base64.decode(option.AttachmentTitle) }]
                    },
                    {
                        Type: "div", Class: "rv-air-button-base rv-air-button-black rv-border-radius-quarter",
                        Style: "display:" + (option.AttachmentRequired === true ? "inline-block" : "none") + ";" +
                            "font-size:0.7rem; cursor:default;",
                        Childs: [{ Type: "text", TextValue: RVDic.WF.FileAttachmentIsCompulsory }]
                    }
                ], elems["attachmentTitle"]);
            }
            
            //Add AttachedFiles
            var attArea = null;

            var attachmentRequired = option.AttachmentRequired === true;
            var attachmentTitle = Base64.decode(option.AttachmentTitle);
            var forms = option.Forms || [];
            var afs = option.TemplateFiles || [];

            if ((option.TemplateFiles || []).length) {
                jQuery(elems["attachmentsArea"]).fadeIn(0);

                var elm = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-12 medium-12 large-12",
                        Style: "margin-bottom:0.5rem; color:rgb(100,100,100);",
                        Childs: [{ Type: "text", TextValue: RVDic.TemplateFiles + ":" }]
                    },
                    { Type: "div", Class: "small-12 medium-12 large-12", Name: "attArea" }
                ], elems["attachmentsArea"]);

                attArea = elm["attArea"];

                var mdManager = new MediaManager({ ContainerDiv: attArea });

                jQuery.each(option.TemplateFiles || [], function (ind, val) {
                    if (!val.Decoded) {
                        val.FileName = Base64.decode(val.FileName);
                        val.DownloadLink = DocsAPI.GetDownloadLink({ FileID: val.FileID });
                        val.Extension = Base64.decode(val.Extension);
                    }

                    val.Decoded = true;
                });

                mdManager.add_items(option.TemplateFiles || [], { Removable: false, Acceptable: false });
            }
            //end of Add AttachedFiles

            elems["sendButton"].onclick = function () {
                if (that.__Sending) return;

                for (var i = 0, lnt = (option.Forms || []).length; i < lnt; ++i)
                    if (option.Forms[i].Filled !== true) return alert("لطفا فرم ها را تکمیل کنید");

                var nodeId = "";
                if (nodeSelect != null) {
                    var index = nodeSelect.selectedIndex;

                    if (index >= 0) nodeId = nodeSelect.values[index];
                    else return alert("لطفا " + nodeType + " مورد نظر را انتخاب کنید");
                }

                var description = GlobalUtilities.trim(that.Objects.Description.get_data());
                if (!description && that.Objects.DescriptionNeeded) {
                    option.__ShowedDiv.Showed.Close();
                    return alert("لطفا نظر خود را وارد کنید");
                }

                if (attachmentRequired && (that.get_attached_files_count() <= 0)) {
                    option.__ShowedDiv.Showed.Close();
                    return alert("لطفا فایل های درخواست شده را پیوست فرمایید");
                }

                if (that.Options.FormInstanceIDToBeFilled &&
                    (!that.Objects.FormViewer || that.Objects.FormViewer.has_empty_necessary_element())) {
                    option.__ShowedDiv.Showed.Close();
                    return alert(RVDic.MSG.FillNecessaryFieldsOfTheForm);
                }

                that.__Sending = true;

                WFAPI.SendToNextState({
                    HistoryID: that.Objects.HistoryID, StateID: option.OutStateID, NodeID: nodeId,
                    Description: Base64.encode(description), ParseResults: true,
                    ResponseHandler: function (result) {
                        that.__Sending = false;

                        if (result.ErrorText)
                            return alert(RVDic.WF.MSG[result.ErrorText] || RVDic.MSG[result.ErrorText] || result.ErrorText);

                        option.__ShowedDiv.Showed.Close();

                        if (that.Objects.HistoryViewer) that.Objects.HistoryViewer.add_history(result.History, { AddToTop: true });
                        that.show();
                    }
                });
            }
        },

        add_form: function (_div, form, params) {
            params = params || {};

            var that = this;

            var formId = form.FormID || "";
            var instanceId = form.InstanceID || "";
            var title = Base64.decode(form.Title || "");
            var filled = form.Filled === true;
            var fillingDate = form.FillingDate || "";
            var creator = form.Creator || {};
            creator.UserID = creator.UserID || "";
            creator.FullName = Base64.decode(creator.FullName || "");
            creator.ProfileImageURL = creator.ProfileImageURL || "";

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12 row rv-bg-color-softer-soft rv-border-radius-half",
                    Style: "margin:0rem; margin-bottom:0.5rem; padding:0.5rem;",
                    Childs: [
                        {
                            Type: "div", Class: "small-7 medium-8 large-9", Style: "padding-" + RV_RevFloat + ":1rem;",
                            Childs: [
                                {
                                    Type: "middle",
                                    Childs: [
                                        { Type: "text", TextValue: title },
                                        {
                                            Type: "div", Name: "descriptionArea",
                                            Class: "rv-air-button-base rv-air-button-white rv-border-radius-quarter",
                                            Style: "margin-" + RV_Float + ":0.5rem; font-size:0.7rem; display:inline-block; cursor:default;"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-5 medium-4 large-3 rv-circle",
                            Style: "background-color:white; padding:0.2rem;",
                            Childs: [
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12 rv-air-button rv-circle",
                                    Style: "font-size:0.7rem;", Name: "actionArea"
                                }
                            ]
                        }
                    ]
                }
            ], _div);

            var descriptionArea = elems["descriptionArea"];
            var actionArea = elems["actionArea"];

            descriptionArea.innerHTML = filled ? "تکمیل شده در تاریخ" + " (" + fillingDate + ") " : "تکمیل نشده";
            actionArea.innerHTML = filled ? "به بازبینی نیاز دارد" : "تکمیل فرم";

            var _set_on_form_fill = function (_instId) {
                FGAPI.SetOnFormFill(_instId, function () {
                    form.Filled = true;
                    descriptionArea.innerHTML = "تکمیل شده";
                    actionArea.innerHTML = "به بازبینی نیاز دارد";
                });
            }

            if (instanceId != "") _set_on_form_fill(instanceId);

            actionArea.onclick = function () {
                if (form.Filled !== true) {
                    var _fill_form = function () {
                        var _newFormArea = GlobalUtilities.create_nested_elements([
                            {
                                Type: "div", Style: "text-align:center;", Name: "dc",
                                Childs: [
                                    { Type: "label", Childs: [{ Type: "text", TextValue: "فرم ایجاد شد. لطفا برای تکمیل فرم " }] },
                                    {
                                        Type: "label", Style: "margin:0px 2px 0px 2px; color:blue; cursor:pointer;",
                                        Properties: [
                                            {
                                                Name: "onclick",
                                                Value: function () {
                                                    window.open(RVAPI.FormPageURL({ InstanceID: form.InstanceID }));
                                                    actionArea.Dialog.Close();
                                                }
                                            }
                                        ],
                                        Childs: [{ Type: "text", TextValue: "اینجا" }]
                                    },
                                    { Type: "label", Childs: [{ Type: "text", TextValue: " را کلیک کنید" }] }
                                ]
                            }
                        ]);

                        actionArea.Dialog = GlobalUtilities.dialog(_newFormArea["dc"], null, { Width: 380 });
                    }

                    if (form.InstanceID)
                        return window.open(RVAPI.FormPageURL({ InstanceID: form.InstanceID }));

                    if (actionArea.__Creating) return;
                    actionArea.__Creating = true;

                    GlobalUtilities.block(actionArea);

                    WFAPI.CreateHistoryFormInstance({
                        HistoryID: that.Objects.HistoryID || "",
                        OutStateID: params.OutStateID || "", FormID: formId,
                        ResponseHandler: function (responseText) {
                            var result = JSON.parse(responseText);

                            if (result.ErrorText)
                                alert(result.ErrorText);
                            else {
                                form.InstanceID = result.InstanceID || "";
                                _set_on_form_fill(form.InstanceID);
                                _fill_form();
                            }

                            actionArea.__Creating = false;
                            GlobalUtilities.unblock(actionArea);
                        }
                    });

                    return;
                } //end of 'if (form.Filled !== true) {'

                if (actionArea.__Processing) return;

                GlobalUtilities.confirm("در صورت ادامه، فرم از حالت تکمیل شده، خارج می شود. آیا مایلید ادامه دهید؟", function (result) {
                    if (!result) return;

                    actionArea.__Processing = true;

                    FGAPI.SetFormInstanceAsNotFilled({
                        InstanceID: form.InstanceID,
                        ResponseHandler: function (responseText) {
                            var result = JSON.parse(responseText);

                            if (result.ErrorText) {
                                alert(result.ErroText);
                                actionArea.__Processing = false;
                                return;
                            }

                            actionArea.__Processing = false;

                            form.Filled = false;
                            descriptionArea.innerHTML = "تکمیل نشده";
                            actionArea.innerHTML = "تکمیل فرم";
                        }
                    });
                });
            }
        },

        show_state_data_need_instance: function (instance) {
            var that = this;

            var _div = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-9 large-8 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0 auto; padding:1rem;", Name: "_div"
                }
            ])["_div"];

            GlobalUtilities.loading(_div);
            GlobalUtilities.show(_div);

            GlobalUtilities.load_files(["API/FGAPI.js", "WorkFlowManager/StateDataNeedInstanceViewer.js"], {
                OnLoad: function () {
                    new StateDataNeedInstanceViewer(_div, {
                        InstanceID: instance.InstanceID,
                        OnFill: function () {
                            instance.Filled = true;
                            elems["descriptionArea"].innerHTML = "تکمیل شده";
                        }
                    });
                }
            });
        }
    }
})();