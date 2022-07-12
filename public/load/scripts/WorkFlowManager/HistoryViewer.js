(function () {
    if (window.HistoryViewer) return;

    window.HistoryViewer = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (this.ContainerDiv == null) return;

        params = params || {};

        this.OwnerID = params.OwnerID || "";

        this.__Initialized = false;
    }

    HistoryViewer.prototype = {
        _preshow: function () {
            var that = this;

            GlobalUtilities.load_files(["API/WFAPI.js", "API/DocsAPI.js", "MediaManager/MediaManager.js"], {
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

            WFAPI.GetOwnerHistory({
                OwnerID: this.OwnerID,
                ResponseHandler: function (responseText) {
                    var states = JSON.parse(responseText).States || [];

                    for (var i = 0, lnt = states.length; i < lnt; ++i) that.add_history(states[i]);
                    that.__Processing = false;
                }
            });
        },

        add_history: function (state, params) {
            params = params || {};
            state = state || {};

            if (state.ErrorText) return;

            var addToTop = params.AddToTop === true;

            var stateId = state.StateID || "";
            var stateTitle = Base64.decode(state.StateTitle || "");
            var description = Base64.decode(state.Description || "");
            if (description == "") description = "هیچ توضیحاتی وارد نشده است";
            var sendDate = state.SendDate || "";
            var director = state.Director || {};
            director.UserID = director.UserID || "";
            director.FullName = Base64.decode(director.FullName || "");
            director.ProfileImageURL = director.ProfileImageURL || "";
            director.NodeID = director.NodeID || "";
            director.NodeName = Base64.decode(director.NodeName || "");
            director.NodeType = Base64.decode(director.NodeType || "");

            var nodeInfo = director.NodeName == "" ? "" : " - " + director.NodeName + " (" + director.NodeType + ")";

            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-quarter SoftBorder",
                Style: "font-size:x-small; margin-bottom:0.3rem; padding:0.5rem", Name: "historyDiv",
                Childs: [
                    {
                        Type: "div", Class: "small-12 medium-12 large-12",
                        Style: "font-weight:bold; margin-bottom:0.5rem;",
                        Childs: [{ Type: "text", TextValue: stateTitle }]
                    },
                    {
                        Type: "div", Class: "small-12 medium-12 large-12",
                        Style: "position:relative; padding-" + RV_Float + ":3.5rem; min-height:2.6rem;",
                        Childs: [
                            {
                                Type: "div", Style: "position:absolute; width:3rem;top:0rem;" + RV_Float + ":0rem;",
                                Childs: [{
                                    Type: "img", Class: "rv-border-radius-quarter", Tooltip: director.FullName,
                                    Style: "width:2.5rem; height:2.5rem;", Name: "userImage",
                                    Link: RVAPI.UserPageURL({ UserID: director.UserID }),
                                    Attributes: [{ Name: "src", Value: director.ProfileImageURL }]
                                }]
                            },
                            { Type: "div", Class: "small-12 medium-12 large-12", Name: "descriptionArea" },
                            { Type: "div", Class: "small-12 medium-12 large-12", Name: "pollArea" },
                            { Type: "div", Class: "small-12 medium-12 large-12", Name: "formsArea" },
                            { Type: "div", Class: "small-12 medium-12 large-12", Name: "attachmentsArea" }
                        ]
                    },
                    {
                        Type: "div", Class: "small-12 medium-12 large-12 RevDirection RevTextAlign",
                        Childs: [{
                            Type: "div", Class: "Direction TextAlign",
                            Style: "display:inline-block; color:green; font-size:x-small;",
                            Childs: [{ Type: "text", TextValue: sendDate }]
                        }]
                    }
                ]
            }]);

            GlobalUtilities.append_markup_text(elems["descriptionArea"], description);
            
            var historyDiv = elems["historyDiv"];
            if (params.AddToTop === true)
                this.ContainerDiv.insertBefore(historyDiv, this.ContainerDiv.firstChild);
            else
                this.ContainerDiv.appendChild(historyDiv);

            if (state.PollID && state.PollName) {
                var showedPollDiv = null;

                var _show_poll = function () {
                    if (showedPollDiv) return GlobalUtilities.show(showedPollDiv);

                    showedPollDiv = GlobalUtilities.create_nested_elements([
                        {
                            Type: "div", Class: "small-10 medium-9 large-8 rv-border-radius-1 SoftBackgroundColor",
                            Style: "margin:0rem auto; padding:1rem;", Name: "_div"
                        }
                    ])["_div"];

                    GlobalUtilities.loading(showedPollDiv);
                    GlobalUtilities.show(showedPollDiv);

                    GlobalUtilities.load_files(["FormsManager/FormViewer.js"], {
                        OnLoad: function () {
                            new FormViewer(showedPollDiv, {
                                PollID: state.PollID, LimitOwnerID: state.HistoryID, ShowAllIfNoLimit: true,
                                PollAbstract: true, Editable: false, HideHeader: true, HideDescription: true, FillButton: false
                            });
                        }
                    });
                };

                GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-8 medium-6 large-4 rv-air-button rv-circle",
                        Style: "margin:0.5rem auto; padding:0.2rem 1rem;",
                        Properties: [{ Name: "onclick", Value: function () { _show_poll(); }}],
                        Childs: [{ Type: "text", TextValue: Base64.decode(state.PollName) }]
                    }
                ], elems["pollArea"]);
            }

            if ((state.Forms || []).length > 0) {
                GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-12 medium-12 large-12",
                        Style: "font-weight:bold; margin:1rem; margin-bottom:0.5rem; margin-" + RV_RevFloat + ":0rem;",
                        Childs: [{ Type: "text", TextValue: "فرم های تکمیل شده" }]
                    }
                ], elems["formsArea"]);
            }

            for (var i = 0, lnt = (state.Forms || []).length; i < lnt; ++i)
                this.add_form(elems["formsArea"], state.Forms[i]);

            //Add AttachedFiles
            var attArea = null;

            if ((state.AttachedFiles || []).length > 0) {
                var _el = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-12 medium-12 large-12",
                        Style: "font-weight:bold; margin:0.5rem 0rem;",
                        Childs: [{ Type: "text", TextValue: "فایل های پیوست" }]
                    },
                    { Type: "div", Class: "small-12 medium-12 large-12", Name: "attArea" }
                ], elems["attachmentsArea"]);

                attArea = _el["attArea"];
            }

            afs = state.AttachedFiles || [];
            var mdManager = new MediaManager({ ContainerDiv: attArea, NoInlineMedia: false });

            for (var i = 0, lnt = afs.length; i < lnt; ++i) {
                if (!afs[i].Decoded) {
                    afs[i].FileName = Base64.decode(afs[i].FileName || "");
                    afs[i].DownloadLink = DocsAPI.GetDownloadLink({ FileID: afs[i].FileID || "" });
                    afs[i].Extension = Base64.decode(afs[i].Extension || "");
                }
                
                afs[i].Decoded = true;
            }

            mdManager.add_items(afs, { Removable: false, Acceptable: false });
            //end of Add AttachedFiles
        },

        add_form: function (_div, form) {
            var instanceId = form.InstanceID || "";
            var title = Base64.decode(form.Title || "");
            var fillingDate = form.FillingDate || "";
            var creator = form.Creator || {};
            creator.UserID = creator.UserID || "";
            creator.FullName = Base64.decode(creator.FullName || "");
            creator.ProfileImageURL = creator.ProfileImageURL || "";

            var _el = GlobalUtilities.create_nested_elements([
                {
                    Type: "div",
                    Class: "small-12 medium-12 large-12 rv-border-radius-half rv-bg-color-trans-white WarmBorder SoftShadow",
                    Style: "position:relative; padding:0.3rem; margin-bottom:0.5rem;" +
                        "padding-" + RV_Float + ":3.3rem; min-height:2.7rem;",
                    Childs: [
                        {
                            Type: "div", Style: "position:absolute; top:0.3rem;" + RV_Float + ":0.3rem;",
                            Childs: [
                                {
                                    Type: "img", Class: "rv-border-radius-quarter",
                                    Style: "width:2rem; height:2rem; cursor:pointer;",
                                    Link: RVAPI.UserPageURL({ UserID: creator.UserID }), Tooltip: creator.FullName,
                                    Attributes: [{ Name: "src", Value: creator.ProfileImageURL }]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Link: RVAPI.FormPageURL({ InstanceID: instanceId }),
                            Properties: [{ Name: "onclick", Value: function () { window.open(RVAPI.FormPageURL({ InstanceID: instanceId })); } }],
                            Childs: [{ Type: "text", TextValue: title }]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 RevDirection RevTextAlign", 
                            Childs: [
                                {
                                    Type: "div", Class: "Direction TextAlign", Style: "display:inline-block; color:green;",
                                    Childs: [{ Type: "text", TextValue: fillingDate }]
                                }
                            ]
                        }
                    ]
                }
            ], _div);
        }
    }
})();