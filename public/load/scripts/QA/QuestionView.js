(function () {
    if (window.QuestionView) return;

    "use strict";

    window.QuestionView = function (container, params) {
        this.Container = typeof (container) == "object" ? container : document.getElementById(container);
        if (!this.Container) return;
        params = params || {};

        this.Objects = {
            QuestionID: params.QuestionID,
            BestAnswerID: null,
            Answers: {},
            FeedbacksEnabled: false,
            BestAnswerEnabled: false,
            NewAnswerEnabled: false,
            Options: {}
        };

        var that = this;

        GlobalUtilities.load_files(["API/QAAPI.js", "QA/QATags.js"], {
            OnLoad: function () { that.preinit(); }
        });
    }

    QuestionView.prototype = {
        preinit: function () {
            var that = this;
            
            QAAPI.GetQuestion({
                QuestionID: that.Objects.QuestionID, ParseResults: true,
                ResponseHandler: function (result) {
                    if (result.ErrorText == "AccessDenied") {
                        that.Container.innerHTML = "";

                        return GlobalUtilities.create_nested_elements([
                            {
                                Type: "div", Class: "small-12 medium-12 large-12",
                                Style: "text-align:center; margin-top:8rem; font-size:x-large; font-weight:bold;",
                                Childs: [{ Type: "text", TextValue: Base64.decode(result.Title) }]
                            },
                            {
                                Type: "div", Class: "small-12 medium-12 large-12",
                                Style: "text-align:center; margin-top:1.5rem; font-size:x-large; color:blue;",
                                Childs: [{ Type: "text", TextValue: RVDic.MSG.AccessDenied }]
                            }
                        ], that.Container);
                    }

                    that.initialize(result);
                }
            });
        },

        initialize: function (question) {
            var that = this;

            that.Objects.BestAnswerID = question.BestAnswerID;
            that.Objects.FeedbacksEnabled = !!question.FeedbacksEnabled;
            that.Objects.BestAnswerEnabled = !!question.BestAnswerEnabled;
            that.Objects.NewAnswerEnabled = !!question.NewAnswerEnabled;

            var options = that.Objects.Options = question.WorkFlowOptions || {};

            var followStatus = !!question.FollowStatus;

            var follow_class = function () { return "fa fa-star" + (followStatus ? "" : "-o") + " fa-2x"; }
            var follow_class_over = function () { return "fa fa-star" + (followStatus ? "-o" : "") + " fa-2x"; }

            var hideTags = !question.Editable && ((question.Tags || []).length == 0);

            that.Container.innerHTML = "";
            
            var likesTop = 0;
            var followTop = options.DisableQuestionLikes ? 0 : likesTop + 5;
            var faqTop = question.FAQEnabled ? followTop + 2.5 : 0;
            var removeTop = (!faqTop ? followTop : faqTop) + 2;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12 row align-center",
                    Style: "margin:0rem;", Name: "workflow"
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "padding-" + RV_Float + ":4rem; position:relative;",
                    Childs: [
                        {
                            Type: "div", Name: "likes",
                            Style: "position:absolute; top:" + likesTop + "rem; " + RV_Float + ":0rem;" +
                                "width:3rem; text-align:center;" + (options.DisableQuestionLikes ? "display:none;" : "")
                        },
                        {
                            Type: "div",
                            Style: "position:absolute; top:" + followTop + "rem; " + RV_Float + ":0rem; width:3rem;" +
                                "text-align:center;" + (that.Objects.FeedbacksEnabled ? "" : "display:none;"),
                            Childs: [
                                {
                                    Type: "i", Class: follow_class(), Name: "follow",
                                    Style: "cursor:pointer; color:#FFDF00;",
                                    Attributes: [{ Name: "aria-hidden", Value: true }],
                                    Properties: [
                                        { Name: "onmouseover", Value: function () { this.setAttribute("class", follow_class_over()); } },
                                        { Name: "onmouseout", Value: function () { this.setAttribute("class", follow_class()); } }
                                    ]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "rv-air-button rv-circle", Name: "faq",
                            Style: "position:absolute; top:" + faqTop + "rem; " + RV_Float + ":0rem; width:3rem;" +
                                "text-align:center; font-size:0.7rem; font-weight:bold;" +
                                (question.FAQEnabled ? "" : "display:none;"),
                            Childs: [{ Type: "text", TextValue: "FAQ" }]
                        },
                        {
                            Type: "div",
                            Style: "position:absolute; top:" + removeTop + "rem; " + RV_Float + ":0rem; width:3rem;" +
                                "text-align:center;" + (question.Removable ? "" : "display:none;"),
                            Childs: [
                                {
                                    Type: "i", Class: "fa fa-times fa-2x rv-icon-button", Name: "remove",
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "padding-" + RV_Float + ":4rem; position:relative;",
                            Childs: [
                                {
                                    Type: "div", Style: "position:absolute; top:0rem; " + RV_Float + ":0rem;",
                                    Childs: [
                                        {
                                            Type: "img", Class: "rv-circle", Style: "width:3rem; height:3rem;",
                                            Link: RVAPI.UserPageURL({ UserID: question.Sender.UserID }),
                                            Attributes: [{ Name: "src", Value: question.Sender.ProfileImageURL }]
                                        }
                                    ]
                                },
                                { Type: "div", Class: "small-12 medium-12 large-12", Name: "title" },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12", Name: "description",
                                    Style: "margin-top:1.5rem; font-size:1rem;"
                                },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12", Name: "tags",
                                    Style: "margin:1.5rem 0rem 1rem 0rem;" + (hideTags ? "display:none;" : "")
                                },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12",
                                    Style: "padding-" + RV_Float + ":4rem;", Name: "comments" +
                                        (options.DisableComments ? "display:none;" : "")
                                },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12",
                                    Style: "padding:0rem 0.5rem; font-weight:bold; margin-top:1rem;" +
                                        "font-size:1.2rem; color:rgb(100,100,100);",
                                    Childs: [{ Type: "text", TextValue: RVDic.Answers }]
                                },
                                { Type: "hr" },
                                { Type: "div", Class: "small-12 medium-12 large-12", Name: "answers" },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12",
                                    Style: "display:none;", Name: "relatedQuestions"
                                }
                            ]
                        }
                    ]
                }
            ], that.Container);
            
            if (!options.DisableQuestionLikes) {
                that.show_likes(elems["likes"], {
                    LikedID: question.QuestionID,
                    LikedType: "Question",
                    LikesCount: question.LikesCount,
                    DislikesCount: question.DislikesCount,
                    LikeStatus: question.LikeStatus
                });
            }
            
            if (question.FAQEnabled) elems["faq"].onclick = function () { that.faq_button_click(); };

            that.set_title(elems["title"], question);
            that.set_description(elems["description"], question);
            
            new QATags(elems["tags"], {
                QuestionID: question.QuestionID,
                Tags: question.Tags || [],
                Mini: true,
                Editable: question.Editable
            });
            
            if (!options.DisableComments)
                that.show_comments(elems["comments"], question.QuestionID, question.Comments);
            
            that.show_answers(elems["answers"], question, question.Answers);
            
            var processing = false;

            elems["follow"].onclick = function () {
                if (processing) return;
                processing = true;

                RVAPI[followStatus ? "Unfollow" : "Follow"]({
                    FollowedID: question.QuestionID, ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.Succeed) {
                            followStatus = !followStatus;
                            elems["follow"].setAttribute("class", follow_class());
                        }

                        processing = false;
                    }
                });
            }

            var removing = false;

            elems["remove"].onclick = function () {
                if (removing) return;

                var msg = RVDic.Confirms.DoYouWantToRemoveN.replace("[n]", RVDic.Question);

                GlobalUtilities.confirm(msg, function (r) {
                    if (!r) return;

                    removing = true;

                    QAAPI.RemoveQuestion({
                        QuestionID: question.QuestionID, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else if (result.Succeed) {
                                alert(RVDic.MSG[result.Succeed] || result.Succeed);
                                setTimeout(function () {
                                    window.location.href = RVAPI.QuestionsPageURL();
                                }, 4000);
                            }

                            processing = false;
                        }
                    });
                });
            }
            
            that.related_questions(elems["relatedQuestions"], question);

            that.workflow_options(elems["workflow"], question);
        },

        workflow_options: function (container, params) {
            params = params || {};
            var that = this;
            
            if (!params.IsWorkFlowAdmin) return;

            var options = that.Objects.Options || {};
            var arr = [];

            var _add_button = function (name, title) {
                arr.push({
                    Type: "div", Class: "small-10 medium-6 large-4", Style: "padding:0rem 1rem 2rem 1rem;",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 ActionButton", Name: name,
                            Childs: [{ Type: "text", TextValue: title }]
                        }
                    ]
                });
            };
            
            if (!params.Status || (params.Status == "Pending")) _add_button("register", RVDic.Confirm);
            if (params.Status == "Registered") {
                _add_button("publish", RVDic.Publish);
                if (options.AnswerBy == "SelectedUsers") _add_button("selectUsers", RVDic.KnowledgablePeople);
            }

            var elems = GlobalUtilities.create_nested_elements(arr, container);

            var __Processing = false;

            if (elems["register"]) {
                elems["register"].onclick = function () {
                    if (__Processing) return;
                    __Processing = true;

                    QAAPI.InitialConfirmQuestion({
                        QuestionID: that.Objects.QuestionID, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else if (result.Succeed) {
                                alert(RVDic.MSG[result.Succeed] || result.Succeed, null, function () {
                                    window.location.href = window.location.href;
                                });

                                /*
                                params.Status = "Registered";

                                jQuery(container).fadeOut(500, function () {
                                    container.innerHTML = "";
                                    that.workflow_options(container, params);
                                    jQuery(container).fadeIn(500);
                                });
                                */
                            }
                            __Processing = false;
                        }
                    });
                };
            }

            if (elems["publish"]) {
                elems["publish"].onclick = function () {
                    if (__Processing) return;
                    __Processing = true;

                    QAAPI.ConfirmQuestion({
                        QuestionID: that.Objects.QuestionID, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else if (result.Succeed) {
                                alert(RVDic.MSG[result.Succeed] || result.Succeed, null, function () {
                                    window.location.href = window.location.href;
                                });

                                /*
                                params.Status = "Accepted";
                                params.PublicationDate = (new Date()).toString();

                                jQuery(container).fadeOut(500, function () {
                                    container.innerHTML = "";
                                    that.workflow_options(container, params);
                                    jQuery(container).fadeIn(500);
                                });
                                */
                            }
                            __Processing = false;
                        }
                    });
                };
            }

            if (elems["selectUsers"])
                elems["selectUsers"].onclick = function () { that.knowledgable_people(); };
        },

        knowledgable_people: function () {
            var that = this;

            var selectedUsers = {};

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-10 large-8 row rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0rem auto; padding:1rem;", Name: "_div"
                }
            ]);

            var _div = elems["_div"];

            GlobalUtilities.loading(_div);
            GlobalUtilities.show(_div);

            var parse_results = function (result) {
                _div.innerHTML = "";

                var el = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-12 medium-12 large-12",
                        Style: "text-align:center; font-weight:bold; padding-bottom:1rem;",
                        Childs: [{ Type: "text", TextValue: RVDic.KnowledgablePeople }]
                    },
                    {
                        Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-half SoftBorder",
                        Style: "padding:0.5rem; margin-bottom:0.5rem;",
                        Childs: [
                            {
                                Type: "div", Class: "small-12 medium-12 large-12", Style: "margin-bottom:0.5rem;",
                                Childs: [{ Type: "text", TextValue: RVDic.SelectedUsers + ":" }]
                            },
                            {
                                Type: "div", Class: "small-12 medium-12 large-12 row",
                                Style: "margin:0rem;", Name: "selected"
                            }
                        ]
                    },
                    {
                        Type: "div", Class: "small-12 medium-8 large-6", Style: "padding-bottom:1rem;",
                        Childs: [
                            {
                                Type: "input", Class: "rv-input", InnerTitle: RVDic.UserSelect,
                                Style: "width:100%;", Name: "_input",
                                Attributes: [{ Name: "type", Value: "text" }]
                            }
                        ]
                    },
                    {
                        Type: "div", Class: "small-12 medium-12 large-12 row",
                        Style: "margin:0rem;", Name: "suggested"
                    },
                    {
                        Type: "div", Style: "display:none; margin-top:0.5rem;", Name: "more",
                        Class: "small-12 medium-12 large-12 rv-air-button rv-border-radius-1",
                        Childs: [{ Type: "text", TextValue: RVDic.More }]
                    }
                ], _div);

                var _add_selected_user = function (usr) {
                    if (selectedUsers[usr.UserID]) return;
                    selectedUsers[usr.UserID] = usr;

                    that.add_user(el["selected"], usr, {
                        RemoveButton: true,
                        OnRemove: function () { selectedUsers[usr.UserID] = null; }
                    });
                };

                for (var i = 0; i < (result.Users || []).length; ++i)
                    _add_selected_user(result.Users[i]);

                var _add_suggested_user = function (usr) {
                    if (selectedUsers[usr.UserID]) return;

                    that.add_user(el["suggested"], usr, {
                        RemoveButton: false,
                        OnAdd: function () { _add_selected_user(usr); }
                    });
                };

                var _add_default_users = function () {
                    el["suggested"].innerHTML = "";

                    for (var i = 0; i < (result.Suggested || []).length; ++i)
                        _add_suggested_user(result.Suggested[i]);
                };

                _add_default_users();

                var count = 20;
                var lowerBoundary = 1;

                var _search_users = function (p, callback) {
                    p = p || {};

                    var more = p.More;

                    if (!more) lowerBoundary = 1;

                    var value = GlobalUtilities.trim(el["_input"].value);

                    UsersAPI.GetUsers({
                        SearchText: Base64.encode(value), Count: count, LowerBoundary: lowerBoundary, ParseResults: true,
                        ResponseHandler: function (r) {
                            var usrs = r.Users || [];

                            if (callback) callback();

                            jQuery(el["more"])[(usrs.length == 0) || (usrs.length < count) ? "fadeOut" : "fadeIn"](0);

                            lowerBoundary += usrs.length;

                            if (!more) {
                                if (usrs.length == 0)
                                    return (el["suggested"].innerHTML = RVDic.NoUserFound);

                                el["suggested"].innerHTML = "";
                            }

                            for (var i = 0; i < usrs.length; ++i)
                                _add_suggested_user(usrs[i]);
                        }
                    });
                };

                GlobalUtilities.set_onchange(el["_input"], function () {
                    var value = GlobalUtilities.trim(el["_input"].value);

                    if (!value) return _add_default_users();

                    el["suggested"].innerHTML = "";
                    GlobalUtilities.loading(el["suggested"]);

                    _search_users();
                });

                el["more"].onclick = function () {
                    var btn = this;

                    if (btn.__Processing) return;
                    btn.__Processing = true;

                    btn.innerHTML = "";
                    GlobalUtilities.loading(btn);

                    _search_users({ More: true }, function () {
                        btn.innerHTML = RVDic.More;
                        btn.__Processing = false;
                    });
                };
            };

            GlobalUtilities.load_files(["API/UsersAPI.js"], {
                OnLoad: function () {
                    QAAPI.GetKnowledgableUsers({
                        QuestionID: that.Objects.QuestionID, Suggestions: true, ParseResults: true,
                        ResponseHandler: function (result) { parse_results(result); }
                    });
                }
            });
        },

        add_user: function (container, user, params) {
            params = params || {};
            var that = this;

            if (!user) return;

            user.FirstName = Base64.decode(user.FirstName);
            user.LastName = Base64.decode(user.LastName);
            user.UserName = Base64.decode(user.UserName);

            var hasRemoveButton = params.RemoveButton !== false;
            var selectable = !hasRemoveButton;

            var __processing = false;

            var _on_select = function () {
                if (__processing) return;
                __processing = true;

                QAAPI.AddKnowledgableUser({
                    QuestionID: that.Objects.QuestionID, UserID: user.UserID, ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                        else if (result.Succeed) {
                            jQuery(elems["container"]).fadeOut(500, function () {
                                jQuery(elems["container"]).remove();
                                if (params.OnAdd) params.OnAdd(user);
                            });
                        }

                        __processing = false;
                    }
                });
            };

            var _on_remove = function () {
                if (__processing) return;
                __processing = true;

                QAAPI.RemoveKnowledgableUser({
                    QuestionID: that.Objects.QuestionID, UserID: user.UserID, ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                        else if (result.Succeed) {
                            jQuery(elems["container"]).fadeOut(500, function () {
                                jQuery(elems["container"]).remove();
                                if (params.OnRemove) params.OnRemove(user);
                            });
                        }

                        __processing = false;
                    }
                });
            };

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-6 large-4",
                    Style: "padding:" + (params.RemoveButton === false ? "0.2" : "0.6") + "rem;", Name: "container",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 row rv-border-radius-1 WarmBorder",
                            Style: "margin:0rem; position:relative; padding:0.4rem; height:100%; cursor:pointer;",
                            Properties: !selectable ? null : [{ Name: "onclick", Value: function () { _on_select(); } }],
                            Childs: [
                                {
                                    Type: "div", Class: "rv-circle rv-icon-button SoftBorder",
                                    Style: "position:absolute; width:1.5rem; height:1.5rem; cursor:pointer;" +
                                        "top:-0.8rem; " + RV_Float + ":-0.8rem;" +
                                        "text-align:center; background-color:white;" +
                                        (!hasRemoveButton ? "display:none;" : ""),
                                    Childs: [
                                        {
                                            Type: "i", Class: "fa fa-times fa-lg",
                                            Style: "line-height:1.3rem;",
                                            Attributes: [{ Name: "aria-hidden", Value: true }],
                                            Properties: [{ Name: "onclick", Value: function () { _on_remove(); } }]
                                        }
                                    ]
                                },
                                {
                                    Type: "div", Class: "small-3 medium-3 large-3",
                                    Childs: [
                                        {
                                            Type: "img", Class: "rv-circle", Style: "width:80%;",
                                            Link: RVAPI.UserPageURL({ UserID: user.UserID }), Params: { Confirmation: true },
                                            Attributes: [{ Name: "src", Value: user.ProfileImageURL || user.ImageURL }]
                                        }
                                    ]
                                },
                                {
                                    Type: "div", Class: "small-9 meidum-9 large-9",
                                    Childs: [
                                        {
                                            Type: "middle", Class: "TextAlign",
                                            Childs: [{ Type: "text", TextValue: user.FirstName + " " + user.LastName + " - " + user.UserName }]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ], container);
        },

        set_title: function (container, params) {
            params = params || {};
            var editable = params.Editable === true;
            var title = Base64.decode(params.Title || "");
            var that = this;

            var _el = GlobalUtilities.create_nested_elements([
                {
                    Type: "div",
                    Tooltip: (editable ? RVDic.DoubleClickToEdit : null), Name: "viewArea",
                    Style: "font-weight:bold; font-size:1.5rem; color:rgb(80,80,80);" +
                        "display:inline-block; text-align:justify;" + (editable ? "cursor:pointer;" : "")
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "display:none;", Name: "editArea",
                    Childs: [
                        {
                            Type: "input", Class: "rv-input", Name: "titleInput", Style: "width:100%;",
                            Attributes: [{ Name: "type", Value: "text" }]
                        }
                    ]
                }
            ], container);

            var viewArea = _el["viewArea"];
            var editArea = _el["editArea"];
            var titleInput = _el["titleInput"];

            var _set_data = function () {
                GlobalUtilities.set_text(viewArea, GlobalUtilities.convert_numbers_to_persian(GlobalUtilities.secure_string(title)));
                titleInput.value = title;
            }

            var __Editing = false;

            var _on_edit = function () {
                if (!editable) return;

                var set_things = function () {
                    _set_data();
                    viewArea.style.display = __Editing ? "none" : "inline-block";
                    editArea.style.display = __Editing ? "block" : "none";

                    if (__Editing) jQuery(titleInput).focus().select();
                }

                if (__Editing === true) {
                    var newTitle = GlobalUtilities.trim(titleInput.value);
                    if (!newTitle) return;

                    GlobalUtilities.block(container);

                    QAAPI.EditQuestionTitle({
                        QuestionID: that.Objects.QuestionID, Title: Base64.encode(newTitle), ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText)
                                alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else {
                                title = Base64.decode(result.Title) || newTitle;
                                __Editing = false;
                                set_things();
                            }

                            GlobalUtilities.unblock(container);
                        }
                    });
                }
                else __Editing = true;

                set_things();
            } //end of _on_edit

            viewArea.ondblclick = _on_edit;
            if (title == "") _on_edit();
            GlobalUtilities.set_onenter(titleInput, _on_edit);
            _set_data();
        },

        set_description: function (container, params) {
            params = params || {};
            var editable = params.Editable === true;
            var description = Base64.decode(params.Description || "");
            var that = this;

            var inputCreated = false;

            var _el = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "position:relative;" + (editable ? "padding-" + RV_RevFloat + ":3rem;" : ""),
                    Childs: [
                        {
                            Type: "div", Style: "position:absolute; top:0.1rem;" + RV_RevFloat + ":0.5rem;" +
                               "width:2rem; text-align:center;" + (editable ? "" : "display:none;"),
                            Childs: [
                                {
                                    Type: "i", Class: "fa fa-pencil fa-2x rv-icon-button", Name: "editButton",
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                }
                            ]
                        },
                        {
                            Type: "div", Style: "position:absolute; top:2.5rem;" + RV_RevFloat + ":0.5rem;" +
                               "width:2rem; text-align:center; display:none;",
                            Childs: [
                                {
                                    Type: "i", Class: "fa fa-times fa-2x rv-icon-button", Name: "cancelButton",
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                }
                            ]
                        },
                        {
                            Type: "div", Name: "viewArea",
                            Style: "text-align:justify; margin-bottom:1rem;" +
                                (editable ? "min-height:2rem;" : "")
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "display:none; margin-bottom:1.5rem;", Name: "editArea"
                        }
                    ]
                }
            ], container);

            var viewArea = _el["viewArea"];
            var editArea = _el["editArea"];
            var editButton = _el["editButton"];
            var cancelButton = _el["cancelButton"];

            var descriptionInput = null;

            var _set_data = function () {
                GlobalUtilities.append_markup_text(viewArea, description, { IsHTML: true });
                if (descriptionInput) descriptionInput.set_data(description);
            }

            var __Editing = false;

            var set_things = function () {
                _set_data();
                viewArea.style.display = __Editing ? "none" : "inline-block";
                editArea.style.display = __Editing ? "block" : "none";

                editButton.setAttribute("class",
                    "fa fa-" + (__Editing ? "save" : "pencil") + " fa-2x rv-icon-button");
                jQuery(cancelButton.parentNode)[__Editing ? "fadeIn" : "fadeOut"](0);

                editButton.parentNode.style.top = __Editing ? "2.5rem" : "0.1rem";
                cancelButton.parentNode.style.top = __Editing ? "0.1rem" : "2.5rem";
            }

            var _on_edit = function () {
                if (!editable) return;

                if (__Editing === true) {
                    var newDescription = GlobalUtilities.trim(descriptionInput.get_data());
                    if (!newDescription) return;

                    GlobalUtilities.block(container);

                    QAAPI.EditQuestionDescription({
                        QuestionID: that.Objects.QuestionID, Description: Base64.encode(newDescription),
                        ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText)
                                alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else {
                                description = Base64.decode(result.Description) || newDescription;
                                __Editing = false;
                                set_things();
                            }

                            GlobalUtilities.unblock(container);
                        }
                    });
                }
                else {
                    __Editing = true;

                    if (!descriptionInput && !inputCreated) {
                        inputCreated = true;

                        GlobalUtilities.append_rich_text_editor(editArea, {
                            Focus: true, EnableTagging: true,
                            EnableUploader: false, EnableCodeHighlighter: true
                        }, function (editor) {
                            descriptionInput = editor;
                            editor.set_data(description);
                        });
                    }
                }

                set_things();
            } //end of _on_edit

            editButton.onclick = _on_edit;
            _set_data();

            cancelButton.onclick = function () {
                __Editing = false;
                set_things();
            }
        },

        set_answer_body: function (container, params, onremove) {
            params = params || {};
            var editable = params.Editable === true;
            var removable = params.Removable === true;
            var bodyText = Base64.decode(params.BodyText);
            var that = this;

            var _el = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "position:relative;" + (editable || removable ? "padding-" + RV_RevFloat + ":3rem; min-height:3.2rem;" : ""),
                    Childs: [
                        {
                            Type: "div", Style: "position:absolute; top:0.1rem;" + RV_RevFloat + ":0.5rem;" +
                               "width:2rem; text-align:center;" + (editable ? "" : "display:none;"),
                            Childs: [
                                {
                                    Type: "i", Class: "fa fa-times fa-2x rv-icon-button", Name: "removeButton",
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                }
                            ]
                        },
                        {
                            Type: "div", Style: "position:absolute; top:2.5rem;" + RV_RevFloat + ":0.5rem;" +
                               "width:2rem; text-align:center;" + (editable ? "" : "display:none;"),
                            Childs: [
                                {
                                    Type: "i", Class: "fa fa-pencil fa-2x rv-icon-button", Name: "editButton",
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                }
                            ]
                        },
                        { Type: "div", Name: "viewArea", Style: "text-align:justify;" },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "display:none; margin-bottom:1.5rem;", Name: "editArea"
                        }
                    ]
                }
            ], container);

            var viewArea = _el["viewArea"];
            var editArea = _el["editArea"];
            var editButton = _el["editButton"];
            var removeButton = _el["removeButton"];

            var bodyTextInput = null;
            var inputCreated = false;

            var _set_data = function () {
                GlobalUtilities.append_markup_text(viewArea, bodyText, { IsHTML: true });
                if (bodyTextInput) bodyTextInput.set_data(bodyText);
            }

            var __Editing = false;

            var set_things = function () {
                _set_data();
                viewArea.style.display = __Editing ? "none" : "inline-block";
                editArea.style.display = __Editing ? "block" : "none";

                editButton.setAttribute("class",
                    "fa fa-" + (__Editing ? "save" : "pencil") + " fa-2x rv-icon-button");
            }

            var _on_edit = function () {
                if (!editable) return;

                if (__Editing === true) {
                    var newBodyText = GlobalUtilities.trim(bodyTextInput.get_data());
                    if (!newBodyText) return;

                    GlobalUtilities.block(container);

                    QAAPI.EditAnswer({
                        AnswerID: params.AnswerID, AnswerBody: Base64.encode(newBodyText),
                        ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText)
                                alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else {
                                bodyText = Base64.decode((result.Answer || {}).BodyText) || newBodyText;
                                __Editing = false;
                                set_things();
                            }

                            GlobalUtilities.unblock(container);
                        }
                    });
                }
                else {
                    __Editing = true;

                    if (!bodyTextInput && !inputCreated) {
                        inputCreated = true;

                        GlobalUtilities.append_rich_text_editor(editArea, {
                            Focus: true, EnableTagging: true,
                            EnableUploader: false, EnableCodeHighlighter: true
                        }, function (editor) {
                            bodyTextInput = editor;
                            editor.set_data(bodyText);
                        });
                    }
                }

                set_things();
            } //end of _on_edit

            editButton.onclick = _on_edit;
            _set_data();

            var removing = false;

            removeButton.onclick = !removable ? null : function () {
                if (removing) return;

                if (__Editing) {
                    __Editing = removing = false;
                    return set_things();
                }

                var msg = RVDic.Confirms.DoYouWantToRemoveN.replace("[n]", RVDic.Answer);

                GlobalUtilities.confirm(msg, function (r) {
                    if (!r) return;
                    removing = true;

                    QAAPI.RemoveAnswer({
                        AnswerID: params.AnswerID, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else if (result.Succeed && onremove) onremove();

                            removing = false;
                        }
                    });
                });
            }
        },

        show_likes: function (container, params) {
            var that = this;
            params = params || {};

            var likedId = params.LikedID;
            var likedType = params.LikedType;
            var likeStatus = params.LikeStatus;
            var likesCount = +params.LikesCount;
            var dislikesCount = +params.DislikesCount;

            if (isNaN(likesCount)) likesCount = 0;
            if (isNaN(dislikesCount)) dislikesCount = 0;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "i", Name: "likeButton",
                    Class: "fa fa-caret-up fa-3x rv-icon-button" + (likeStatus ? " rv-green" : ""),
                    Style: "line-height:0.8rem;" + (that.Objects.FeedbacksEnabled ? "" : "cursor:default;")
                },
                { Type: "br" },
                {
                    Type: "label", Name: "likesCount",
                    Style: "font-size:1.5rem; line-height:1rem; color:rgb(100,100,100);"
                },
                { Type: "br" },
                {
                    Type: "i", Name: "dislikeButton",
                    Class: "fa fa-caret-down fa-3x rv-icon-button" + (likeStatus === false ? " rv-red" : ""),
                    Style: "line-height:1.2rem;" + (that.Objects.FeedbacksEnabled ? "" : "cursor:default;")
                }
            ], container);

            var set_likes_count = function () {
                var cnt = likesCount - dislikesCount;

                var strCount = cnt >= 0 ? String(cnt) : "<span>" + String(-1 * cnt) + "</span><span>-</span>";

                elems["likesCount"].innerHTML = GlobalUtilities.convert_numbers_to_persian(strCount);
            }

            set_likes_count();

            var processing = false;

            var _do = function (like) {
                if (processing) return;
                processing = true;

                var apiFunction = like === likeStatus ? "Unlike" : (like ? "Like" : "Dislike");

                RVAPI[apiFunction]({
                    LikedID: likedId, LikedType: likedType, ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.Succeed) {
                            if (apiFunction == "Unlike") {
                                elems["likeButton"].setAttribute("class", "fa fa-caret-up fa-3x rv-icon-button");
                                elems["dislikeButton"].setAttribute("class", "fa fa-caret-down fa-3x rv-icon-button");

                                if (likeStatus === true)--likesCount;
                                if (likeStatus === false)--dislikesCount;
                                likeStatus = null;
                            }
                            else if (like) {
                                elems["likeButton"].setAttribute("class", "fa fa-caret-up fa-3x rv-icon-button rv-green");
                                elems["dislikeButton"].setAttribute("class", "fa fa-caret-down fa-3x rv-icon-button");

                                ++likesCount;
                                if (likeStatus === false)--dislikesCount;
                                likeStatus = true;
                            }
                            else {
                                elems["likeButton"].setAttribute("class", "fa fa-caret-up fa-3x rv-icon-button");
                                elems["dislikeButton"].setAttribute("class", "fa fa-caret-down fa-3x rv-icon-button rv-red");

                                --likesCount;
                                if (likeStatus === true)--likesCount;
                                likeStatus = false;
                            }

                            set_likes_count();
                        }

                        processing = false;
                    }
                });
            }

            if (that.Objects.FeedbacksEnabled) {
                elems["likeButton"].onclick = function () { _do(true); }
                elems["dislikeButton"].onclick = function () { _do(false); }
            }
        },

        show_comments: function (container, ownerId, comments) {
            var that = this;
            comments = comments || [];

            if (!that.Objects.FeedbacksEnabled && !comments.length) return;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Style: "padding:0.5rem;",
                    Class: "small-12 medium-12 large-12 SoftBackgroundColor rv-border-radius-1",
                    Childs: [
                        {
                            Type: "div", Name: "items",
                            Class: "small-12 medium-12 large-12 rv-trim-vertical-margins"
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "position:relative; padding-" + RV_RevFloat + ":2.5rem; margin:0.5rem 0rem;" +
                                (that.Objects.FeedbacksEnabled ? "" : "display:none;"),
                            Childs: [
                                { Type: "div", Name: "newComment" },
                                {
                                    Type: "div",
                                    Style: "position:absolute; top:0rem;" + RV_RevFloat + ":0rem;" +
                                        "width:2rem; text-align:center;",
                                    Childs: [
                                        {
                                            Type: "i", Name: "confirm", Style: "margin-top:0.2rem;",
                                            Class: "fa fa-paper-plane fa-2x rv-icon-button"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ], container);

            for (var i = 0, lnt = comments.length; i < lnt; ++i)
                that.show_comment(elems["items"], comments[i]);

            if (that.Objects.FeedbacksEnabled) {
                var commentInput = new AdvancedTextArea({
                    ContainerDiv: elems["newComment"], DefaultText: RVDic.WhatIsYourOpinion,
                    QueryTemplate: "RelatedThings",
                    ItemTemplate: {
                        ItemsTitle: "Items", ID: "ItemID", Name: "Name",
                        Type: "Type", ImageURL: "ImageURL"
                    }
                });

                var processing = false;

                elems["confirm"].onclick = function () {
                    if (processing) return;

                    var newCommentBody = GlobalUtilities.trim(commentInput.get_data());

                    if (!newCommentBody) return alert(RVDic.Checks.NCannotBeEmpty.replace("[n]", RVDic.Comment));

                    processing = true;
                    
                    QAAPI.SendComment({
                        OwnerID: ownerId, BodyText: Base64.encode(newCommentBody), ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else if (result.Comment) {
                                that.show_comment(elems["items"], result.Comment);
                                commentInput.set_data("");
                            }

                            processing = false;
                        }
                    });
                }
            } //end of 'if(that.Objects.FeedbacksEnabled){'
        },

        show_comment: function (container, comment) {
            var that = this;

            var likesCount = +comment.LikesCount;
            if (isNaN(likesCount)) likesCount = 0;

            var likeStatus = !!comment.LikeStatus;

            var bodyText = Base64.decode(comment.BodyText);

            var feadbackEnabled = !that.Objects.Options.DisableCommentLikes && that.Objects.FeedbacksEnabled;

            var fullname = GlobalUtilities.trim((Base64.decode((comment.Sender || {}).FirstName) || " ") + " " +
                (Base64.decode((comment.Sender || {}).LastName) || " "));
            
            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-half", Name: "container",
                    Style: "position:relative; padding:0.5rem; padding-" + RV_Float + ":3rem;" +
                        (feadbackEnabled ? "padding-" + RV_RevFloat + ":4.6rem;" : "") +
                        "margin-bottom:0.5rem; min-height:3rem; background-color:white;",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "viewArea",
                            Style: "text-align:justify; font-size:0.7rem;" +
                                (comment.Editable || comment.Removable ? "min-height:1.5rem;" : "")
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "min-height:1.5rem; display:none;", Name: "editArea"
                        },
                        (!comment.Editable && !comment.Removable ? null : {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "font-size:0.6rem; color:blue; margin-top:0.5rem;" +
                                (comment.Editable || comment.Removable ? "" : "display:none;"),
                            Childs: [
                                (!comment.Editable ? null : {
                                    Type: "label", Style: "cursor:pointer;", Name: "editButton",
                                    Childs: [{ Type: "text", TextValue: " " + RVDic.Edit + " " }]
                                }),
                                (!comment.Removable ? null : {
                                    Type: "label", Style: "margin:0rem 1rem; cursor:pointer;", Name: "removeButton",
                                    Childs: [{ Type: "text", TextValue: " " + RVDic.Remove + " " }]
                                })
                            ]
                        }),
                        {
                            Type: "div", Style: "position:absolute; top:0.5rem;" + RV_Float + ":0.5rem;",
                            Childs: [
                                {
                                    Type: "img", Class: "rv-circle", Style: "width:2rem; height:2rem;", Tooltip: fullname,
                                    Link: RVAPI.UserPageURL({ UserID: comment.Sender.UserID }),
                                    Attributes: [{ Name: "src", Value: comment.Sender.ProfileImageURL }]
                                }
                            ]
                        },
                        {
                            Type: "div",
                            Style: "position:absolute; top:0.3rem;" + RV_RevFloat + ":0.3rem;" +
                                "font-size:0.6rem; width:4rem; text-align:center;" +
                                (feadbackEnabled ? "" : "display:none;"),
                            Childs: [
                                {
                                    Type: "div",
                                    Class: "rv-air-button rv-circle" + (likeStatus ? " rv-green" : ""),
                                    Style: "width:100%;", Name: "like",
                                    Childs: [{ Type: "text", TextValue: RVDic.IsUseful }]
                                },
                                {
                                    Type: "div", Name: "likesCount",
                                    Style: "text-align:center; margin-top:0.3rem; font-size:0.7rem;",
                                    Childs: [{ Type: "text", TextValue: (!likesCount ? "" : likesCount) }]
                                }
                            ]
                        }
                    ]
                }
            ], container);

            if (feadbackEnabled) {
                var processing = false;

                elems["like"].onclick = function () {
                    if (processing) return;
                    processing = true;

                    var apiFunction = likeStatus ? "Unlike" : "Like";

                    RVAPI[apiFunction]({
                        LikedID: comment.CommentID, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.Succeed) {
                                if (apiFunction == "Unlike") {
                                    elems["like"].setAttribute("class", "rv-air-button rv-circle");

                                    --likesCount;
                                    likeStatus = false;
                                }
                                else {
                                    elems["like"].setAttribute("class", "rv-air-button rv-circle rv-green");

                                    ++likesCount;
                                    likeStatus = true;
                                }

                                elems["likesCount"].innerHTML = !likesCount ? "" :
                                    GlobalUtilities.convert_numbers_to_persian(String(likesCount));
                            }

                            processing = false;
                        }
                    });
                }
            } //end of 'if (that.Objects.FeedbacksEnabled) {'

            var viewArea = elems["viewArea"];
            var editArea = elems["editArea"];
            var editButton = elems["editButton"];
            var removeButton = elems["removeButton"];

            var bodyTextInput = null;

            var _set_data = function () {
                GlobalUtilities.append_markup_text(viewArea, bodyText);
                if (bodyTextInput) bodyTextInput.set_data(bodyText);
            };

            var __Editing = false;

            var set_things = function () {
                _set_data();
                viewArea.style.display = __Editing ? "none" : "inline-block";
                editArea.style.display = __Editing ? "block" : "none";

                editButton.innerHTML = " " + (__Editing ? RVDic.Save : RVDic.Edit) + " ";
                removeButton.innerHTML = " " + (__Editing ? RVDic.Cancel : RVDic.Remove) + " ";
            };

            var _on_edit = function () {
                if (__Editing === true) {
                    var newBodyText = GlobalUtilities.trim(bodyTextInput.get_data());
                    if (!newBodyText) return;

                    GlobalUtilities.block(elems["container"]);

                    QAAPI.EditComment({
                        CommentID: comment.CommentID, BodyText: Base64.encode(newBodyText),
                        ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText)
                                alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else {
                                bodyText = Base64.decode(result.BodyText) || newBodyText;
                                __Editing = false;
                                set_things();
                            }

                            GlobalUtilities.unblock(elems["container"]);
                        }
                    });
                }
                else {
                    __Editing = true;

                    if (!bodyTextInput) {
                        bodyTextInput = new AdvancedTextArea({
                            ContainerDiv: editArea, DefaultText: RVDic.WhatIsYourOpinion,
                            QueryTemplate: "RelatedThings",
                            ItemTemplate: {
                                ItemsTitle: "Items", ID: "ItemID", Name: "Name",
                                Type: "Type", ImageURL: "ImageURL"
                            }
                        });
                    }
                }

                set_things();
            } //end of _on_edit

            if (editButton) editButton.onclick = _on_edit;
            _set_data();

            var removing = false;

            if (removeButton) removeButton.onclick = !comment.Removable ? null : function () {
                if (removing) return;

                if (__Editing) {
                    __Editing = removing = false;
                    return set_things();
                }

                var msg = RVDic.Confirms.DoYouWantToRemoveN.replace("[n]", RVDic.Comment);

                GlobalUtilities.confirm(msg, function (r) {
                    if (!r) return;
                    removing = true;

                    QAAPI.RemoveComment({
                        CommentID: comment.CommentID, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else if (result.Succeed) {
                                jQuery(elems["container"]).animate({ height: "toggle" }, 500, function () {
                                    jQuery(elems["container"]).remove();
                                });
                            }

                            removing = false;
                        }
                    });
                });
            };
        },

        show_answers: function (container, question, answers) {
            var that = this;
            answers = answers || [];

            var elems = GlobalUtilities.create_nested_elements([
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "items" },
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "text-align:center; margin:2rem 0rem 5rem 0rem;" +
                        (that.Objects.NewAnswerEnabled ? "" : "display:none;"),
                    Childs: [
                        {
                            Type: "label", Class: "rv-air-button rv-circle",
                            Style: "padding:1rem 3rem; font-weight:bold;", Name: "yourAnswer",
                            Childs: [{ Type: "text", TextValue: RVDic.SendYourAnswer }]
                        }
                    ]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Name: "newAnswer",
                    Style: "margin-bottom:1rem; display:none;"
                },
                {
                    Type: "div", Class: "ActionButton", Name: "confirm",
                    Style: "width:8rem; margin:0rem auto; margin-bottom:2rem; display:none;",
                    Childs: [{ Type: "text", TextValue: RVDic.Send }]
                }
            ], container);

            for (var i = 0, lnt = answers.length; i < lnt; ++i)
                that.show_answer(elems["items"], answers[i]);

            var answerInput = null;

            elems["yourAnswer"].onclick = !that.Objects.NewAnswerEnabled ? null : function () {
                jQuery(elems["yourAnswer"].parentNode).animate({ height: "toggle" }, 500, function () {
                    jQuery(elems["newAnswer"]).fadeIn(500);
                    jQuery(elems["confirm"]).fadeIn(500);

                    GlobalUtilities.append_rich_text_editor(elems["newAnswer"], {
                        Focus: true, EnableTagging: true, EnableUploader: false, EnableCodeHighlighter: true
                    }, function (editor) {
                        answerInput = editor;
                        editor.set_data("");

                        GlobalUtilities.scroll_into_view(elems["newAnswer"]);
                    });
                });
            }

            if (that.Objects.NewAnswerEnabled) {
                var processing = false;

                elems["confirm"].onclick = function () {
                    if (processing || !answerInput) return;

                    var newAnswerBody = GlobalUtilities.trim(answerInput ? answerInput.get_data() : "");

                    var _div = document.createElement("div");
                    _div.innerHTML = newAnswerBody;

                    if (!(_div.innerText || _div.textContent))
                        return alert(RVDic.Checks.NCannotBeEmpty.replace("[n]", RVDic.Answer));

                    processing = true;

                    QAAPI.SendAnswer({
                        QuestionID: question.QuestionID, AnswerBody: Base64.encode(newAnswerBody),
                        ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else if (result.Answer) {
                                that.show_answer(elems["items"], result.Answer, { ScrollIntoView: true, Fade: true });
                                answerInput.set_data("");
                            }

                            processing = false;
                        }
                    });
                }
            } //end of 'if(that.Objects.NewAnswerEnabled){'
        },

        show_answer: function (container, answer, params) {
            params = params || {};
            var that = this;

            var isBestAnswer = function () {
                return String(answer.AnswerID || "a").toLowerCase() ==
                    String(that.Objects.BestAnswerID || "b").toLowerCase();
            };

            var best_answer_class = function () { return "fa fa-check fa-2x " + (isBestAnswer() ? "rv-green" : "rv-light-gray"); }
            var best_answer_class_over = function () { return "fa fa-check fa-2x " + (isBestAnswer() ? "rv-light-gray" : "rv-green"); }

            var likesTop = 0;
            var bestTop = that.Objects.Options.DisableAnswerLikes ? 0 : 5;
            
            var bestAnswerEditable = that.Objects.BestAnswerEnabled;
            var bestAnswerViewable = !that.Objects.Options.DisableBestAnswer;

            var fullname = GlobalUtilities.trim((Base64.decode((answer.Sender || {}).FirstName) || " ") + " " +
                (Base64.decode((answer.Sender || {}).LastName) || " "));
            
            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Name: "container",
                    Style: "margin:1rem 0rem; padding-" + RV_Float + ":8rem; position:relative;" +
                        "min-height:7.5rem; border-bottom-style:solid; border-bottom-width:0.1rem;" +
                        "border-bottom-color:rgb(230,230,230);" + (params.Fade ? "display:none;" : ""),
                    Childs: [
                        {
                            Type: "div", Name: "likes",
                            Style: "position:absolute; top:" + likesTop + "rem;" + RV_Float + ":0rem; width:3rem;" +
                                "text-align:center;" + (that.Objects.Options.DisableAnswerLikes ? "display:none;" : "")
                        },
                        {
                            Type: "div",
                            Style: "position:absolute; top:" + bestTop + "rem; " + RV_Float + ":0rem; width:3rem;" +
                                "text-align:center;" + (!bestAnswerViewable || (!isBestAnswer() && !bestAnswerEditable) ? "display:none;" : ""),
                            Childs: [
                                {
                                    Type: "i", Class: best_answer_class(), Name: "bestAnswer",
                                    Style: (!bestAnswerEditable ? "" : "cursor:pointer;"),
                                    Attributes: [{ Name: "aria-hidden", Value: true }],
                                    Properties: !bestAnswerEditable ? null : [
                                        { Name: "onmouseover", Value: function () { this.setAttribute("class", best_answer_class_over()); } },
                                        { Name: "onmouseout", Value: function () { this.setAttribute("class", best_answer_class()); } }
                                    ]
                                }
                            ]
                        },
                        {
                            Type: "div", Style: "position:absolute; top:0rem;" + RV_Float + ":4rem;",
                            Childs: [
                                {
                                    Type: "img", Class: "rv-circle", Style: "width:3rem; height:3rem;", Tooltip: fullname,
                                    Link: RVAPI.UserPageURL({ UserID: answer.Sender.UserID }),
                                    Attributes: [{ Name: "src", Value: answer.Sender.ProfileImageURL }]
                                }
                            ]
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "bodyText" },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "comments",
                            Style: "margin:1.5rem 0rem 1rem 0rem; padding-" + RV_Float + ":4rem;" +
                                (that.Objects.Options.DisableComments ? "display:none;" : "")
                        }
                    ]
                }
            ], container);

            if (!that.Objects.Options.DisableAnswerLikes) {
                that.show_likes(elems["likes"], {
                    LikedID: answer.AnswerID,
                    LikedType: "Answer",
                    LikesCount: answer.LikesCount,
                    DislikesCount: answer.DislikesCount,
                    LikeStatus: answer.LikeStatus
                });
            }

            that.set_answer_body(elems["bodyText"], answer, function () {
                jQuery(elems["container"]).animate({ height: "toggle" }, 500, function () {
                    jQuery(elems["container"]).remove();
                });
            });

            if (!that.Objects.Options.DisableComments)
                that.show_comments(elems["comments"], answer.AnswerID, answer.Comments);

            var processing = false;

            elems["bestAnswer"].onclick = !bestAnswerViewable ? null : function () {
                if (processing) return;
                processing = true;

                QAAPI.SetTheBestAnswer({
                    QuestionID: that.Objects.QuestionID, AnswerID: answer.AnswerID, ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.Succeed) {
                            that.Objects.BestAnswerID = answer.AnswerID;

                            for (var id in that.Objects.Answers)
                                that.Objects.Answers[id].check_best_answer();
                        }

                        processing = false;
                    }
                });
            }

            that.Objects.Answers[answer.AnswerID] = {
                check_best_answer: function () {
                    elems["bestAnswer"].setAttribute("class", best_answer_class());
                }
            }

            if (params.Fade) jQuery(elems["container"]).fadeIn(500);
            if (params.ScrollIntoView) GlobalUtilities.scroll_into_view(elems["container"]);
        },

        related_questions: function (container, question) {
            var that = this;
            
            GlobalUtilities.load_files(["QA/QuestionMini.js"], {
                OnLoad: function () { that._related_questions(container, question); }
            });
        },

        _related_questions: function (container, question) {
            var that = this;
            
            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Style: "font-weight:bold; margin:0rem 0.5rem;",
                    Childs: [{Type: "text", TextValue: RVDic.RelatedQuestions}]
                },
                { Type: "hr", Style: "color:rgb(200,200,200); background-color:rgb(100,100,100);" },
                { Type: "div", Style: "margin:1rem 0rem 5rem 0rem;", Name: "questions" }
            ], container);

            var count = 10;
            var found = null;
            var searched = null;

            var _do = function () {
                var used = {};
                var arr = [];
                
                for (var i = 0, lnt = Math.max(found.length, searched.length) ; i < lnt; ++i) {
                    if (arr.length >= count) break;

                    if ((found.length > i) && !used[found[i].QuestionID] &&
                        (found[i].QuestionID != question.QuestionID)) {
                        arr.push(found[i]);
                        used[found[i].QuestionID] = true;
                    }

                    if ((searched.length > i) && !used[searched[i].QuestionID] &&
                        (searched[i].QuestionID != question.QuestionID)) {
                        arr.push(searched[i]);
                        used[searched[i].QuestionID] = true;
                    }
                }

                if (arr.length > 0) jQuery(container).fadeIn(500);

                for (var i = 0, lnt = arr.length; i < lnt; ++i)
                    new QuestionMini(elems["questions"], arr[i], { HideSender: true });
            }
            
            QAAPI.FindRelatedQuestions({
                QuestionID: question.QuestionID, Count: count, ParseResults: true,
                ResponseHandler: function (result) {
                    found = (result || {}).Questions || [];
                    if (GlobalUtilities.get_type(searched) == "array") _do();
                }
            });

            QAAPI.GetQuestions({
                SearchText: question.Title, StartWithSearch: false, Count: count, ParseResults: true, 
                ResponseHandler: function (result) {
                    searched = (result || {}).Questions || [];
                    if (GlobalUtilities.get_type(found) == "array") _do();
                }
            });
        },

        faq_button_click: function () {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Style: "margin:0rem auto; padding:1rem;", Name: "container",
                    Class: "small-10 meidum-10 large-6 row align-center rv-border-radius-1 SoftBackgroundColor",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "font-weight:bold; font-size:1.5rem; text-align:center;",
                            Childs: [{ Type: "text", TextValue: RVDic.SelectN.replace("[n]", RVDic.FAQCategories) }]
                        },
                        {
                            Type: "div", Class: "small-10 medium-6 large-4 ActionButton",
                            Style: "margin:1rem 0rem;", Name: "confirm",
                            Childs: [{Type: "text", TextValue: RVDic.Confirm}]
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "tree" }
                    ]
                }
            ]);

            var treeView = null;
            var saving = false;

            elems["confirm"].onclick = function () {
                if (saving) return;

                var checkedItems = !treeView ? "" : treeView.get_checked_items_string('|');

                if (!checkedItems) return;
                else saving = true;

                QAAPI.AddQuestionToFAQCategories({
                    QuestionID: that.Objects.QuestionID, CategoryIDs: checkedItems, ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                        else if (result.Succeed) {
                            alert(RVDic.MSG[result.Succeed] || result.Succeed);
                            showed.Close();
                        }

                        saving = false;
                    }
                });
            };

            GlobalUtilities.loading(elems["tree"]);
            var showed = GlobalUtilities.show(elems["container"]);

            GlobalUtilities.load_files(["TreeViewContainer/TreeViewContainer.js"], {
                OnLoad: function () {
                    elems["tree"].innerHTML = "";

                    treeView = new TreeViewContainer(elems["tree"], {
                        Nodes: [],
                        Hotkeys: false,
                        Checkbox: true,
                        TreeStateCheckbox: false,
                        Modifiable: false,
                        HideScroll: true,
                        ProgressiveRender: true,
                        AjaxLoading: true,
                        AjaxURL: QAAPI.ResponseURL,
                        AjaxResponseParser: function (result) {
                            var cats = JSON.parse(result).Categories || [];
                            var items = [];
                            for (var i = 0, lnt = cats.length; i < lnt; ++i) {
                                items.push({
                                    ID: cats[i].CategoryID,
                                    Title: Base64.decode(cats[i].Name || ""),
                                    HasChild: cats[i].HasChild
                                });
                            }
                            return items;
                        },
                        StringConsts: { Command: "GetChildFAQCategories", StrNodeID: "CategoryID" }
                    });
                }
            });
        }
    }
})();