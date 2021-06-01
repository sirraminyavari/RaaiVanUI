(function () {
    if (window.FAQCategoryAdmin) return;

    window.FAQCategoryAdmin = function (container, params) {
        this.Container = typeof (container) == "object" ? container : document.getElementById(container);
        if (!this.Container) return;
        params = params || {};

        this.Interface = {
            Questions: null,
            EmptyMessage: null
        };

        this.Objects = {
            Category: params.Category || {},
            Questions: {},
            OrderedQuestions: []
        };

        var that = this;

        GlobalUtilities.load_files(["API/QAAPI.js", "QA/QuestionMini.js"], {
            OnLoad: function () { that.initialize(); }
        });
    }

    FAQCategoryAdmin.prototype = {
        initialize: function () {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "text-align:center; font-weight:bold; font-size:1.5rem; margin-bottom:1rem;",
                    Childs: [{ Type: "text", TextValue: that.Objects.Category.Name }]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "text-align:center; margin-bottom:1rem;",
                    Childs: [
                        {
                            Type: "div", Class: "rv-air-button rv-circle", Name: "questionSelect",
                            Style: "margin:0.5rem; padding:0.4rem 1rem; display:inline-block;",
                            Childs: [
                                {
                                    Type: "i", Class: "fa fa-plus", Style: "margin-" + RV_RevFloat + ":0.5rem;",
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                },
                                { Type: "text", TextValue: RVDic.AddN.replace("[n]", RVDic.Question) }
                            ]
                        },
                        {
                            Type: "div", Class: "rv-air-button rv-circle", Name: "privacyButton",
                            Style: "margin:0.5rem; padding:0.4rem 1rem; display:inline-block;",
                            Childs: [
                                {
                                    Type: "i", Class: "fa fa-key", Style: "margin-" + RV_RevFloat + ":0.5rem;",
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                },
                                { Type: "text", TextValue: RVDic.Privacy }
                            ]
                        },
                        {
                            Type: "div", Class: "rv-air-button rv-circle", Name: "sortButton",
                            Style: "margin:0.5rem; padding:0.4rem 1rem; display:inline-block;",
                            Childs: [
                                {
                                    Type: "i", Class: "fa fa-sort", Style: "margin-" + RV_RevFloat + ":0.5rem;",
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                },
                                { Type: "text", TextValue: RVDic.Sort }
                            ]
                        }
                    ]
                },
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "questions" },
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Name: "emptyMessage",
                    Style: "text-align:center; color:rgb(100,100,100); display:none;",
                    Childs: [{ Type: "text", TextValue: RVDic.NothingToDisplay }]
                }
            ], that.Container);

            that.Interface.Questions = elems["questions"];
            that.Interface.EmptyMessage = elems["emptyMessage"];

            elems["questionSelect"].onclick = function () { that.select_question(); };
            elems["sortButton"].onclick = function () { that.sort_dialog(); };
            elems["privacyButton"].onclick = function () { that.privacy_dialog(); };
            
            GlobalUtilities.loading(that.Interface.Questions);

            QAAPI.GetFAQItems({
                CategoryID: that.Objects.Category.CategoryID, Count: 1000, ParseResults: true,
                ResponseHandler: function (result) {
                    var questions = (result || {}).Questions || [];

                    that.Interface.Questions.innerHTML = "";
                    if (questions.length == 0) jQuery(that.Interface.EmptyMessage).fadeIn(500);

                    for (var i = 0, lnt = questions.length; i < lnt; ++i)
                        that.add_question(result.Questions[i]);
                }
            });
        },

        add_question: function(question){
            var that = this;

            that.Objects.Questions = that.Objects.Questions || {};
            if (that.Objects.Questions[question.QuestionID]) return;
            that.Objects.Questions[question.QuestionID] = question;

            that.Objects.OrderedQuestions.push(question);

            jQuery(that.Interface.EmptyMessage).fadeOut(500);

            var removing = false;

            new QuestionMini(that.Interface.Questions, question, {
                HideSender: true, Checkbox: false, RemoveButton: true,
                Callback: function (qObj) {
                    question.Container = qObj.Container;

                    qObj.RemoveButton.onclick = function () {
                        if (removing) return;

                        GlobalUtilities.confirm(RVDic.Confirms.DoYouWantToRemoveN.replace("[n]", RVDic.Question), function (r) {
                            if (!r) return;

                            QAAPI.RemoveFAQItem({
                                CategoryID: that.Objects.Category.CategoryID, QuestionID: question.QuestionID,
                                ParseResults: true,
                                ResponseHandler: function (result) {
                                    if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                                    else if (result.Succeed) {
                                        that.Objects.Questions[question.QuestionID] = null;

                                        jQuery(qObj.Container).animate({ height: "toggle" }, 500, function () {
                                            jQuery(qObj.Container).remove();
                                        });

                                        var oQuestions = [];
                                        for (var i = 0, lnt = that.Objects.OrderedQuestions.length; i < lnt; ++i) {
                                            if (that.Objects.OrderedQuestions[i].QuestionID != question.QuestionID)
                                                oQuestions.push(that.Objects.OrderedQuestions[i]);
                                        }
                                        that.Objects.OrderedQuestions = oQuestions;
                                    }

                                    removing = true;
                                }
                            });
                        });
                    }
                }
            });
        },

        select_question: function () {
            var that = this;

            var _div = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-10 large-8 SoftBackgroundColor rv-border-radius-1",
                    Style: "padding:1rem; margin:0rem auto;", Name: "_div"
                }
            ])["_div"];

            var saved = false;
            var qs = null;

            var save = function (questions) {
                if (saved || questions.length == 0) return;
                saved = true;

                var ids = [];
                for (var i = 0, lnt = questions.length; i < lnt; ++i)
                    ids.push(questions[i].QuestionID);
                
                QAAPI.AddFAQItems({
                    CategoryID: that.Objects.Category.CategoryID, QuestionIDs: ids.join('|'), ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                        else if (result.Succeed) {
                            for (var i = 0, lnt = questions.length; i < lnt; ++i)
                                that.add_question(questions[i]);
                        }
                    }
                });
            };

            GlobalUtilities.loading(_div);

            var showed = GlobalUtilities.show(_div, {
                OnClose: function () {
                    var questions = [];
                    if (saved || !qs || (questions = qs.get_selected()).length == 0) return;

                    GlobalUtilities.confirm(RVDic.Confirms.DoYouWantToAddQuestions, function (r) {
                        if (r) save(questions);
                    });
                }
            });

            GlobalUtilities.load_files(["QA/QuestionSelect.js"], {
                OnLoad: function () {
                    qs = new QuestionSelect(_div, {
                        OnConfirm: function (questions) {
                            save(questions);
                            showed.Close();
                        }
                    });
                }
            });
        },

        sort_dialog: function () {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "SoftBackgroundColor rv-border-radius-1",
                    Style: "width:50vw; padding:1rem; margin:0rem auto;", Name: "_div",
                    Childs: [
                        {
                            Type: "div", Style: "margin-bottom:1rem; text-align:center; font-weight:bold;",
                            Childs: [{ Type: "text", TextValue: RVDic._HelpSortNames }]
                        },
                        { Type: "div", Name: "items", Style: "margin-bottom:1rem;" },
                        {
                            Type: "div", Class: "ActionButton", Name: "confirmButton",
                            Style: "width:8rem; margin:0rem auto;",
                            Childs: [{ Type: "text", TextValue: RVDic.Confirm }]
                        }
                    ]
                }
            ]);

            var _div = elems["_div"];

            GlobalUtilities.loading(elems["items"]);

            var onClose = null;

            var showed = GlobalUtilities.show(_div, { OnClose: function () { onClose(); } });

            GlobalUtilities.load_files([{ Root: "jQuery/Sortable/", Childs: ["jquery.sortable.css", "jquery.sortable.js"] }], {
                OnLoad: function () {
                    elems["items"].innerHTML = "";

                    var parts = [];

                    var add_part = function (id, title) {
                        parts.push({
                            Type: "div", Class: "WarmBackgroundColor rv-border-radius-half",
                            Style: "cursor:pointer; text-align:center; margin:0.5rem 0rem; padding:0.5rem;",
                            Attributes: [{ Name: "ItemID", Value: id }],
                            Childs: [{ Type: "text", TextValue: title }]
                        });
                    }

                    for (var i = 0, lnt = that.Objects.OrderedQuestions.length; i < lnt; ++i)
                        add_part(that.Objects.OrderedQuestions[i].QuestionID, Base64.decode(that.Objects.OrderedQuestions[i].Title));

                    GlobalUtilities.create_nested_elements(parts, elems["items"]);

                    jQuery(elems["items"]).sortable({
                        PlaceHolder: { Style: "margin:0.5rem 0rem; height:2rem; background-color:white;" }
                    });

                    var processing = false;
                    var confirmButtonClicked = false;

                    onClose = function () {
                        if (confirmButtonClicked || !_changed()) return;

                        GlobalUtilities.confirm(RVDic.Confirms.DoYouWantToSaveTheChanges, function (result) {
                            if (result) _do_save();
                        });
                    };

                    var _get_sorted_list = function () {
                        var sortedList = [];
                        var iter = elems["items"].firstChild;
                        var counter = 0;

                        while (iter) {
                            sortedList.push(iter.getAttribute("ItemID"));
                            ++counter;
                            iter = iter.nextSibling;
                        }

                        return sortedList;
                    }

                    var _changed = function () {
                        var sl = _get_sorted_list();
                        for (var i = 0, lnt = sl.length; i < lnt; ++i)
                            if (sl[i] != that.Objects.OrderedQuestions[i].QuestionID) return true;
                        return false;
                    }

                    var _do_save = function () {
                        if (processing) return;
                        processing = true;

                        GlobalUtilities.block(elems["confirmButton"]);

                        var dic = {};
                        for (var i = 0, lnt = that.Objects.OrderedQuestions.length; i < lnt; ++i)
                            dic[that.Objects.OrderedQuestions[i].QuestionID] = that.Objects.OrderedQuestions[i];

                        var sortedList = _get_sorted_list();

                        var newOrder = [];
                        for (var i = 0, lnt = sortedList.length; i < lnt; ++i)
                            newOrder.push(dic[sortedList[i]]);

                        QAAPI.SetFAQItemsOrder({
                            CategoryID: that.Objects.Category.CategoryID,
                            QuestionIDs: sortedList.join('|'), ParseResults: true,
                            ResponseHandler: function (result) {
                                if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                                else if (result.Succeed) {
                                    that.Objects.OrderedQuestions = newOrder;

                                    for (var i = 0, lnt = newOrder.length; i < lnt; ++i)
                                        that.Interface.Questions.appendChild(newOrder[i].Container);

                                    showed.Close();

                                    processing = false;
                                    GlobalUtilities.unblock(elems["confirmButton"]);
                                }
                            }
                        });
                    }

                    elems["confirmButton"].onclick = function () {
                        confirmButtonClicked = true;
                        if (!_changed()) showed.Close();
                        _do_save();
                    }
                }
            });
        },

        privacy_dialog: function () {
            var that = this;

            if (that.__PrivacyDialog) {
                that.__PrivacyDialogShowed = GlobalUtilities.show(that.__PrivacyDialog);
                return;
            }

            var _div = that.__PrivacyDialog = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-10 medium-8 large-6 rv-border-radius-1 SoftBackgroundColor",
                    Style: "margin:0rem auto; padding:1rem;", Name: "container"
                }
            ])["container"];

            GlobalUtilities.loading(_div);
            var showed = that.__PrivacyDialogShowed = GlobalUtilities.show(_div);

            GlobalUtilities.load_files(["PrivacyManager/PermissionSetting.js"], {
                OnLoad: function () {
                    _div.innerHTML = "";

                    var pv = new PermissionSetting(_div, {
                        ObjectID: that.Objects.Category.CategoryID,
                        Options: {
                            ConfidentialitySelect: false, PermissionTypes: ["View"], ObjectType: "FAQCategory",
                            OnSave: function () { showed.Close(); }
                        }
                    });
                }
            });
        }
    }
})();