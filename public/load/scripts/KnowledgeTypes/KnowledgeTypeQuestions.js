(function () {
    if (window.KnowledgeTypeQuestions) return;

    window.KnowledgeTypeQuestions = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;
        params = params || {};

        this.Interface = {
            QuestionsArea: null,
            RelatedNodesArea: null,
            TitleArea: null
        };

        this.Objects = {
            NewQuestionInput: null,
            KnowledgeTypeID: params.KnowledgeTypeID,
            CurrentNodeID: null,
            Questions: [],
            RelatedNodes: {}
        };

        var that = this;

        GlobalUtilities.load_files([
            { Root: "API/", Ext: "js", Childs: ["CNAPI", "KnowledgeAPI"] }
        ], { OnLoad: function () { that._preinit(params); } });
    }

    KnowledgeTypeQuestions.prototype = {
        _preinit: function (params) {
            var that = this;

            KnowledgeAPI.GetQuestions({
                KnowledgeTypeID: that.Objects.KnowledgeTypeID, ParseResults: true,
                ResponseHandler: function (result) {
                    that.Objects.Questions = result.Questions || [];

                    jQuery.each(that.Objects.Questions, function (ind, val) {
                        val.QuestionBody = Base64.decode(val.QuestionBody);
                    });

                    jQuery.each(result.RelatedNodes || [], function (ind, val) {
                        val.Name = Base64.decode(val.Name);
                        val.Questions = val.Questions || [];
                        
                        jQuery.each(val.Questions || [], function (i, v) {
                            v.QuestionBody = Base64.decode(v.QuestionBody);
                        });
                    });

                    that._initialize(GlobalUtilities.extend(params, { RelatedNodes: result.RelatedNodes || [] }));
                }
            });
        },

        _initialize: function (params) {
            var that = this;
            
            that.ContainerDiv.innerHTML = "";

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12 row", Style: "margin:0rem;",
                    Childs: [
                        {
                            Type: "div", Class: "small-8 medium-8 large-8 row",
                            Style: "margin:0rem; padding-" + RV_RevFloat + ":0.5rem;",
                            Childs: [
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12", Name: "selectedTitle",
                                    Style: "margin:0 0.5rem 1rem 0.5rem; display:none;"
                                },
                                {
                                    Type: "div", Name: "questionsArea",
                                    Class: "small-12 medium-12 large-12 rv-trim-vertical-margins"
                                },
                                { Type: "div", Class: "small-12 medium-12 large-12", Name: "newQuestionArea", Style: "margin-top:0.5rem;" },
                                {
                                    Type: "div", Style: "margin-top:1rem;", Name: "sortButton",
                                    Class: "small-4 medium-4 large-4 rv-air-button-base rv-air-button-white rv-circle SoftBorder",
                                    Properties: [{ Name: "onclick", Value: function () { that.sort_dialog(); }}],
                                    Childs: [{ Type: "text", TextValue: RVDic.Sort }]

                                },
                                { Type: "div", Class: "small-3 medium-3 large-3" },
                                {
                                    Type: "div", Style: "margin-top:1rem;", Name: "newQuestion",
                                    Class: "small-5 medium-5 large-5 rv-air-button rv-circle",
                                    Properties: [{ Name: "onclick", Value: function () { _onenter(); }}],
                                    Childs: [{ Type: "text", TextValue: RVDic.AddN.replace("[n]", RVDic.NewQuestion) }]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-4 medium-4 large-4", Name: "relateNodesQuestions",
                            Style: "padding-" + RV_Float + ":0.5rem;",
                            Childs: [
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12",
                                    Style: "margin-bottom:0.5rem;", Name: "relatedNodeTypeSelect"
                                },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12",
                                    Style: "margin-bottom:0.5rem;", Name: "relatedNodeSelect"
                                },
                                { Type: "div", Class: "small-12 medium-12 large-12", Name: "relatedNodesArea" }
                            ]
                        }
                    ]
                }
            ], that.ContainerDiv);

            that.Interface.QuestionsArea = elems["questionsArea"];
            that.Interface.RelatedNodesArea = elems["relatedNodesArea"];
            that.Interface.TitleArea = elems["selectedTitle"];

            var newQuestionArea = elems["newQuestionArea"];
            var relateNodesQuestionsArea = elems["relateNodesQuestions"];
            var relatedNodeTypeSelectArea = elems["relatedNodeTypeSelect"];
            var relatedNodeSelectArea = elems["relatedNodeSelect"];
            
            var _onenter = function () {
                var questionBody = GlobalUtilities.trim(that.Objects.NewQuestionInput.InputElement.value);
                if (!questionBody) return;

                var nodeId = that.Objects.CurrentNodeID;

                KnowledgeAPI.AddQuestion({
                    KnowledgeTypeID: that.Objects.KnowledgeTypeID, NodeID: nodeId,
                    QuestionBody: Base64.encode(questionBody), ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.ErrorText) return alert(RVDic.MSG[result.ErrorText] || result.ErrorText);

                        var question = result.Question;
                        question.QuestionBody = Base64.decode(question.QuestionBody);

                        if (nodeId)
                            that.Objects.RelatedNodes[nodeId].Questions = that.Objects.RelatedNodes[nodeId].Questions || [];

                        var arr = (!nodeId ? that.Objects.Questions : that.Objects.RelatedNodes[nodeId].Questions) || [];
                        arr.push(question);

                        that.Objects.NewQuestionInput.clear();

                        that.add_item(question, { NodeID: nodeId });
                        that.set_questions_count({ NodeID: nodeId });
                    }
                });
            };

            that.Objects.NewQuestionInput = GlobalUtilities.append_autosuggest(elems["newQuestionArea"], {
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.7rem;",
                InnerTitle: RVDic.NewQuestion + "...",
                AjaxDataSource: KnowledgeAPI.SearchQuestions(),
                ResponseParser: function (responseText) {
                    var results = JSON.parse(responseText).Results || [];
                    var arr = [];
                    for (var i = 0, lnt = results.length; i < lnt; ++i)
                        arr.push([Base64.decode(results[i]), GlobalUtilities.generate_new_guid()]);
                    return arr;
                },
                OnEnter: function () { setTimeout(_onenter, 10); }
            });

            var relatedNodeSelect = GlobalUtilities.append_autosuggest(relatedNodeSelectArea, {
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.7rem;",
                ResponseParser: function (responseText) {
                    var nodes = JSON.parse(responseText).Nodes || [];
                    var arr = [];
                    for (var i = 0, lnt = nodes.length; i < lnt; ++i)
                        arr.push([Base64.decode(nodes[i].Name || ""), nodes[i].NodeID]);
                    return arr;
                },
                OnSelect: function () {
                    var nodeId = this.values[this.selectedIndex];
                    var nodeName = this.keywords[this.selectedIndex];
                    that.add_related_node({ NodeID: nodeId, Name: nodeName });
                    relatedNodeSelect.empty();
                }
            });

            var relatedNodeTypeSelect = GlobalUtilities.append_autosuggest(relatedNodeTypeSelectArea, {
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.7rem;",
                InnerTitle: RVDic.RelatedNodeTypeSelect + "...",
                AjaxDataSource: CNAPI.GetNodeTypesDataSource(),
                ResponseParser: function (responseText) {
                    var nodeTypes = JSON.parse(responseText).NodeTypes || [];
                    var arr = [];
                    for (var i = 0, lnt = nodeTypes.length; i < lnt; ++i)
                        arr.push([Base64.decode(nodeTypes[i].TypeName || ""), nodeTypes[i].NodeTypeID]);
                    return arr;
                },
                OnSelect: function () {
                    var nodeTypeId = this.values[this.selectedIndex];
                    var nodeType = this.keywords[this.selectedIndex];

                    relatedNodeSelect.bindURL(CNAPI.GetNodesDataSource({ NodeTypeID: nodeTypeId }));
                    GlobalUtilities.set_inner_title(relatedNodeSelect.InputElement,
                        RVDic.SelectN.replace("[n]", nodeType) + "...");
                }
            });

            //Show initial data
            that.show_questions();
            jQuery.each(params.RelatedNodes || [], function (ind, val) { that.add_related_node(val); });
            //end of Show initial data
        },

        set_title: function (params) {
            params = params || {};
            var that = this;

            that.Interface.TitleArea.innerHTML = "";
            
            that.Interface.TitleArea.style.display = params.NodeName ? "flex" : "none";

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "rv-air-button rv-circle",
                    Style: "display:inline-block; font-size:0.7rem; padding:0.3rem 3rem;",
                    Properties: [{ Name: "onclick", Value: function () { that.show_questions(); }}],
                    Childs: [{ Type: "text", TextValue: RVDic.Return }]
                },
                { Type: "div", Name: "relatedNode", Style: "display:inline-block; margin-" + RV_Float + ":1rem; margin-top:0.3rem;" }
            ], that.Interface.TitleArea);

            if (params.NodeName) {
                elems["relatedNode"].innerHTML = "";

                GlobalUtilities.create_nested_elements([
                    { Type: "text", TextValue: "(" },
                    {
                        Type: "span", Style: "color:gray;",
                        Childs: [{ Type: "text", TextValue: RVDic.RelatedNode + ":" }]
                    },
                    { Type: "span", Style: "padding:0px 2px 0px 2px;" },
                    { Type: "text", TextValue: params.NodeName + ")" }
                ], elems["relatedNode"]);
            }
        },

        show_questions: function (nodeId) {
            var that = this;
            
            that.Objects.CurrentNodeID = !nodeId ? null : nodeId;
            
            var questions = !nodeId ? that.Objects.Questions || [] : that.Objects.RelatedNodes[nodeId].Questions || [];
            
            that.Interface.QuestionsArea.innerHTML = "";
            
            jQuery.each(questions, function (ind, val) { that.add_item(val, { NodeID: nodeId }); });
            
            that.set_title({ NodeName: (that.Objects.RelatedNodes[nodeId] || {}).Name });
        },

        _remove_question: function (question, params, containerDiv) {
            question = question || {};
            params = params || {};
            var that = this;

            GlobalUtilities.confirm(RVDic.Confirms.RemoveQuestion, function (r) {
                if (!r) return;

                KnowledgeAPI.RemoveQuestion({
                    ID: question.ID, ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.ErrorText) return;

                        jQuery(containerDiv).fadeOut(500, function () { this.remove(); });

                        var nodeId = params.NodeID;

                        var arr = !nodeId ? that.Objects.Questions || [] :
                            (that.Objects.RelatedNodes[nodeId] || {}).Questions || [];

                        var index = -1;
                        for (var i = 0, lnt = arr.length; i < lnt; ++i) {
                            if (arr[i].ID == question.ID) {
                                index = i;
                                break;
                            }
                        }

                        if (index >= 0) {
                            for (var i = index + 1, lnt = arr.length; i < lnt; ++i) arr[i - 1] = arr[i];
                            arr.pop();
                        }

                        that.set_questions_count({ NodeID: nodeId });
                    }
                });
            });
        },

        _move_question: function (question, moveDown, params, containerDiv) {
            question = question || {};
            params = params || {};
            moveDown = moveDown === true;
            var that = this;

            var nodeId = params.NodeID;

            var arr = !nodeId ? that.Objects.Questions || [] : (that.Objects.RelatedNodes[nodeId] || {}).Questions || [];

            var index = -1;
            for (var i = 0, lnt = arr.length; i < lnt; ++i) {
                if (arr[i].ID == question.ID) {
                    index = i;
                    break;
                }
            }

            var other = (moveDown && i < arr.length - 1) || (!moveDown && index > 0) ? index + (moveDown ? 1 : -1) : -1;

            if (other < 0) return;

            KnowledgeAPI.MoveQuestion({
                ID: question.ID, MoveDown: moveDown, ParseResults: true,
                ResponseHandler: function (result) {
                    if (result.ErrorText) return;
                    GlobalUtilities.move_element(containerDiv, moveDown);

                    var t = arr[index];
                    arr[index] = arr[other];
                    arr[other] = t;
                }
            });
        },

        add_item: function (question, params) {
            question = question || {};
            params = params || {};
            var that = this;

            var questionBody = question.QuestionBody;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Name: "questionContainer",
                    Class: "small-12 medium-12 large-12 row rv-bg-color-white-softer rv-border-radius-quarter SoftBorder",
                    Style: "position:relative; padding:0.3rem; margin:0.2rem 0rem; padding-" + RV_Float + ":3.5rem;",
                    Childs: [
                        {
                            Type: "div", Style: "position:absolute; top:0.3rem;" + RV_Float + ":0.3rem;",
                            Childs: [
                                {
                                    Type: "i", Class: "fa fa-times fa-lg rv-icon-button", Tooltip: RVDic.Remove,
                                    Attributes: [{ Name: "aria-hidden", Value: true }],
                                    Properties: [{ Name: "onclick", Value: function () { that._remove_question(question, params, elems["questionContainer"]); } }]
                                }
                            ]
                        },
                        {
                            Type: "div", Style: "position:absolute; top:0.3rem;" + RV_Float + ":1.8rem;",
                            Childs: [
                                {
                                    Type: "i", Class: "fa fa-pencil fa-lg rv-icon-button", Name: "editButton", Tooltip: RVDic.Edit,
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "questionBody",
                            Childs: [{ Type: "text", TextValue: questionBody }]
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "editArea", Style: "display:none;" },
                        {
                            Type: "div", Class: "small-7 medium-8 large-9", Style: "margin-top:1rem;",
                            Childs: [
                                {
                                    Type: "div", Style: "display:inline-block; font-weight:bold;",
                                    Childs: [{ Type: "text", TextValue: RVDic.Weight + ":" }]
                                },
                                {
                                    Type: "div", Name: "weightArea",
                                    Style: "display:inline-block; margin-" + RV_Float + ":0.5rem;"
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-5 medium-4 large-3", Style: "margin-top:1rem;", Name: "optionsArea",
                            Childs: [{ Type: "div", Style: "font-weight:bold;" }]
                        }
                    ]
                }
            ], that.Interface.QuestionsArea);

            that.set_weight(elems["weightArea"], question);
            that.set_options(elems["optionsArea"], question);

            var container = elems["questionContainer"];
            var editButton = elems["editButton"];
            var questionBodyArea = elems["questionBody"];
            var editArea = elems["editArea"];

            container.QuestionObject = question;

            var bodyInput = GlobalUtilities.append_autosuggest(elems["editArea"], {
                InputClass: "rv-input",
                InputStyle: "width:100%; font-size:0.7rem;",
                InnerTitle: RVDic.Question + "...",
                AjaxDataSource: KnowledgeAPI.SearchQuestions(),
                ResponseParser: function (responseText) {
                    var results = JSON.parse(responseText).Results || [];
                    var arr = [];
                    for (var i = 0, lnt = results.length; i < lnt; ++i)
                        arr.push([Base64.decode(results[i]), GlobalUtilities.generate_new_guid()]);
                    return arr;
                }
            });

            editButton.onclick = function () {
                var set_things = function () {
                    GlobalUtilities.set_text(questionBodyArea, GlobalUtilities.convert_numbers_to_persian(questionBody));
                    bodyInput.set_item("", questionBody);

                    editArea.style.display = editButton.__Editing ? "flex" : "none";
                    questionBodyArea.style.display = editButton.__Editing ? "none" : "flex";

                    editButton.setAttribute("class", editButton.__Editing ?
                        "fa fa-floppy-o fa-lg rv-icon-button" : "fa fa-pencil fa-lg rv-icon-button");
                    GlobalUtilities.append_tooltip(editButton, editButton.__Editing ? RVDic.Save : RVDic.Edit);
                };

                if (this.__Editing === true) {
                    var newBody = GlobalUtilities.trim(bodyInput.InputElement.value);
                    if (!newBody) return;

                    GlobalUtilities.block(container);

                    KnowledgeAPI.ModifyQuestion({
                        ID: question.ID, QuestionBody: Base64.encode(newBody), ParseResults: true,
                        ResponseHandler: function (result) {
                            GlobalUtilities.unblock(container);
                            if (result.ErrorText) return;
                            questionBody = newBody;
                            editButton.__Editing = false;
                            set_things();
                        }
                    });
                }
                else this.__Editing = true;

                set_things();
            };
        },

        set_weight: function (container, question) {
            question = question || {};
            var that = this;

            var weight = question.Weight;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Tooltip: RVDic.DoubleClickToEdit,
                    Style: "margin-" + RV_RevFloat + ":0.5rem; cursor:pointer;", Name: "viewArea"
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Name: "editArea", Style: "display:none;",
                    Childs: [
                        {
                            Type: "number", Class: "rv-input", Name: "_input",
                            Params: { OnEscape: function () { _on_edit(true); } },
                            Style: "width:100%; font-size:0.7rem;"
                        }
                    ]
                }
            ], container);

            var viewArea = elems["viewArea"];
            var editArea = elems["editArea"];
            var input = elems["_input"];

            var _set_data = function () {
                var hasValue = !isNaN(weight) && (weight != null) && (weight > 0);
                viewArea.innerHTML = hasValue ? GlobalUtilities.convert_numbers_to_persian(String(weight)) : RVDic.NotSet;
                viewArea.style.color = hasValue ? "green" : "red";
                viewArea.style.fontWeight = hasValue ? "bold" : "normal";
                if (hasValue) input.value = weight;
            }

            var __Editing = false;

            var _on_edit = function (cancel) {
                var set_things = function () {
                    _set_data();
                    viewArea.style.display = __Editing ? "none" : "block";
                    editArea.style.display = __Editing ? "block" : "none";

                    if (__Editing) jQuery(input).focus().select();
                }

                if (__Editing === true) {
                    if (cancel) {
                        __Editing = false;
                        return set_things();
                    }

                    var newWeight = +GlobalUtilities.trim(input.value);

                    if (isNaN(newWeight) || (newWeight < 0)) weight = 0;

                    GlobalUtilities.block(container);

                    KnowledgeAPI.SetQuestionWeight({
                        ID: question.ID, Weight: +newWeight, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText)
                                alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else {
                                weight = newWeight;
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
            GlobalUtilities.set_onenter(input, _on_edit);
            _set_data();
        },

        set_options: function (container, question) {
            question = question || {};
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                { Type: "div", Class: "small-12 medium-12 large-12 rv-air-button rv-circle", Name: "btn" }
            ], container);

            var optionsCount = (question.Options || []).length;

            var set_button_title = function () {
                //XSS Check: OK
                elems["btn"].innerHTML = RVDic.Options + (!optionsCount ? "" :
                    " (<span style='font-weight:bold;'>" + GlobalUtilities.convert_numbers_to_persian(String(optionsCount)) + "</span>)");
            };

            set_button_title();

            elems["btn"].onclick = function () {
                if (elems["btn"].ShowedDiv) return GlobalUtilities.show(elems["btn"].ShowedDiv);

                var _div = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-10 medium-8 large-6 rv-border-radius-1 SoftBackgroundColor",
                        Style: "margin:0rem auto; padding:1rem", Name: "_div"
                    }
                ])["_div"];

                var _div = elems["btn"].ShowedDiv = _div;

                GlobalUtilities.loading(_div);
                GlobalUtilities.show(_div);

                GlobalUtilities.load_files(["KnowledgeTypes/KnowledgeAnswerOptions.js"], {
                    OnLoad: function () {
                        new KnowledgeAnswerOptions(_div, question, {
                            OnAfterAdd: function () { set_button_title(++optionsCount); },
                            OnAfterRemove: function () { set_button_title(--optionsCount); }
                        });
                    }
                });
            };
        },

        set_questions_count: function (params) {
            params = params || {};
            var node = this.Objects.RelatedNodes[params.NodeID];
            if (node && node.CountDiv) {
                node.CountDiv.innerHTML = "";
                if ((node.Questions || []).length > 0) node.CountDiv.innerHTML =
                    GlobalUtilities.convert_numbers_to_persian(node.Questions.length > 99 ? "99+" : node.Questions.length);
            }
        },

        add_related_node: function (node, params) {
            node = node || {};
            params = params || {};
            var that = this;

            if (that.Objects.RelatedNodes[node.NodeID]) return;
            else that.Objects.RelatedNodes[node.NodeID] = node;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Name: "container",
                    Class: "small-12 medium-12 large-12 rv-border-radius-quarter WarmBorder",
                    Style: "position:relative; padding:0.3rem 1.5rem; margin-bottom:0.4rem; font-size:0.7rem;",
                    Childs: [
                        {
                            Type: "div", Style: "position:absolute; top:0.3rem;" + RV_Float + ":0.3rem;",
                            Childs: [
                                {
                                    Type: "i", Class: "fa fa-times rv-icon-button", Tooltip: RVDic.Remove,
                                    Attributes: [{ Name: "aria-hidden", Value: true }], Name: "removeButton"
                                }
                            ]
                        },
                        {
                            Type: "div", Name: "_count",
                            Style: "position:absolute; top:0.3rem;" + RV_RevFloat + ":0.3rem;" +
                                "width:1.5rem; color:red; text-align:center; font-weight:bold; direction:ltr;"
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 rv-link Ellipsis", Name: "nodeName", Tooltip: node.Name,
                            Childs: [{ Type: "text", TextValue: node.Name }]
                        }
                    ]
                }
            ], that.Interface.RelatedNodesArea);

            node.CountDiv = elems["_count"];

            that.set_questions_count({ NodeID: node.NodeID });

            var processing = false;

            elems["nodeName"].onclick = function () {
                that.set_title({ NodeName: node.Name });
                that.show_questions(node.NodeID);
            };

            elems["removeButton"].onclick = function () {
                if (processing) return;

                GlobalUtilities.confirm(RVDic.Confirms.RemoveKnowledgeTypeQuestionsRelatedNode, function (r) {
                    if (!r) return;

                    processing = true;

                    KnowledgeAPI.RemoveRelatedNodeQuestions({
                        KnowledgeTypeID: that.Objects.KnowledgeTypeID, NodeID: node.NodeID, ParseResults: true,
                        ResponseHandler: function (result) {
                            processing = false

                            if (result.ErrorText) return;

                            jQuery(elems["container"]).fadeOut(500, function () { this.remove(); });

                            that.Objects.RelatedNodes[node.NodeID] = null;

                            if (that.Objects.CurrentNodeID == node.NodeID) {
                                that.Objects.CurrentNodeID = null;
                                that.set_title();
                                that.show_questions();
                            }
                        }
                    });
                });
            };
        },

        sort_dialog: function () {
            var that = this;

            if (that.LoadingSortDialog) return;
            that.LoadingSortDialog = true;

            GlobalUtilities.load_files(["Public/SortDialog.js"], {
                OnLoad: function () {
                    new SortDialog({
                        Container: that.Interface.QuestionsArea,
                        Title: RVDic._HelpSortQuestions,
                        CheckContainerItemValidity: function (item) { return !!item.QuestionObject; },
                        GetItemID: function (item) { return item.QuestionObject.ID; },
                        GetItemTitle: function (item) { return item.QuestionObject.QuestionBody; },
                        APIFunction: function (data, done) {
                            KnowledgeAPI.SetQuestionsOrder({
                                IDs: (data.SortedIDs || []).join("|"), ParseResults: true,
                                ResponseHandler: function (result) {
                                    if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                                    done(!result.ErrorText);
                                }
                            });
                        }
                    });


                    that.LoadingSortDialog = false;
                }
            });
        }
    }
})();