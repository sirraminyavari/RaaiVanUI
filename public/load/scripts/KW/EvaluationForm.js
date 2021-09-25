(function () {
    if (window.EvaluationForm) return;

    var _fix_css = (function () {
        var fixed = false;

        return function () {
            if (fixed) return;
            fixed = true;

            var style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = '.k-slider-track{background-color:rgb(220,220,220);}';
            document.getElementsByTagName('head')[0].appendChild(style);
        }
    })();

    window.EvaluationForm = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;
        params = params || {};

        this.Objects = {
            NodeID: params.NodeID,
            Creator: params.Creator || {},
            EvaluatorID: params.EvaluatorID,
            PreEvaluated: params.PreEvaluated,
            TextOptions: params.TextOptions,
            Items: [],
            DescriptionInput: null,
            TextList: null,
            Weighted: true,
            WeightSum: 0,
            Answers: null
        };

        this.Options = {
            ForceEvaluatorsDescribe: params.ForceEvaluatorsDescribe,
            ScoreScale: 10,
            OnClose: params.OnClose,
            OnConfirm: params.OnConfirm,
            OnRefuse: params.OnRefuse
        };

        var that = this;

        GlobalUtilities.load_files([
            { Root: "API/", Ext: "js", Childs: ["KnowledgeAPI"] },
            {
                Root: "Kendo/",
                Childs: [
                    "kendo.common.css",
                    "kendo.blueopal.css",
                    "kendo.core.js",
                    "kendo.userevents.js",
                    "kendo.draganddrop.js",
                    "kendo.slider.js"
                ]
            }
        ], { OnLoad: function () { that._preinit(); }, LoadSequential: true });
    }

    EvaluationForm.prototype = {
        _preinit: function () {
            var that = this;

            _fix_css();
            
            KnowledgeAPI.GetEvaluationFormQuestions({
                KnowledgeID: that.Objects.NodeID, ParseResults: true,
                ResponseHandler: function (result) {
                    that.Options.ScoreScale = result.ScoreScale || that.Options.ScoreScale;
                    
                    KnowledgeAPI.GetFilledEvaluationForm({
                        KnowledgeID: that.Objects.NodeID,
                        UserID: that.Objects.EvaluatorID || ((window.RVGlobal || {}).CurrentUser || {}).UserID,
                        ParseResults: true,
                        ResponseHandler: function (evalData) {
                            that.Objects.Answers = evalData;
                            that._initialize(result.Questions || []);
                        }
                    });
                }
            });
        },

        _initialize: function (questions) {
            var that = this;

            that.ContainerDiv.innerHTML = "";

            if (questions.length == 0) {
                if (that.Options.OnClose) that.Options.OnClose({ Questions: that.Objects.Items });
                return alert(RVDic.MSG.NoQuestionFound);
            }

            var isDevoluted = !!that.Objects.EvaluatorID && !!(that.Objects.Creator || {}).UserID &&
                that.Objects.EvaluatorID != that.Objects.Creator.UserID;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "text-align:center; font-weight:bold; margin-bottom:1rem;",
                    Childs: [
                        { Type: "text", TextValue: RVDic.EvaluationForm },
                        {
                            Type: "div", Class: "rv-air-button rv-circle", Name: "selfEvaluationButton",
                            Style: "display:" + (that.Objects.PreEvaluated ? "inline-block" : "none") + ";" +
                                "margin-" + RV_Float + ":0.5rem; font-weight:normal; font-size:0.7rem;",
                            Childs: [{ Type: "text", TextValue: RVDic.KW.ViewSelfEvaluationForm }]
                        }
                    ]
                },
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "container" },
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Style: "margin:1rem 0rem 1rem 0rem;",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Style: "font-weight:bold;",
                            Childs: [
                                { Type: "text", TextValue: RVDic.Description },
                                {
                                    Type: "div",
                                    Style: "font-weight:bold; color:red; margin:0rem 0.3rem;" + 
                                        "display:" + (that.Options.ForceEvaluatorsDescribe ? "inline-block" : "none") + ";",
                                    Childs: [{ Type: "text", TextValue: "*" }]
                                },
                            ]
                        },
                        { Type: "hr", Class: "small-12 medium-12 large-12" },
                        (!((that.Objects.TextOptions || {}).Evaluation || []).length ? null : {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "textOptions", Style: "margin-bottom:1rem;"
                        }),
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "descriptionInput" }
                    ]
                },
                {
                    Type: "div", Class: "small-12 medium-10 large-8 row", Style: "margin:1.5rem auto 0 auto;",
                    Childs: [
                        {
                            Type: "div", Class: "small-5 medium-5 large-5 rv-air-button rv-circle",
                            Style: "font-weight:500;" + (isDevoluted ? "margin:0 auto;" : ""),
                            Properties: [
                                {
                                    Name: "onclick",
                                    Value: function () {
                                        if (that.Options.ForceEvaluatorsDescribe && !that.Objects.DescriptionInput.get_data())
                                            return alert(RVDic.DescriptionIsEmpty);

                                        GlobalUtilities.confirm(RVDic.Confirms.ConfirmEvaluationForm, function (r) { if (r) that.confirm(); });
                                    }
                                }
                            ],
                            Childs: [{ Type: "text", TextValue: RVDic.Confirm }]
                        },
                        (isDevoluted ? null : { Type: "div", Class: "small-2 medium-2 large-2" }),
                        (isDevoluted ? null : {
                            Type: "div", Class: "small-5 medium-5 large-5 rv-air-button rv-circle", Style: "font-weight:500;",
                            Properties: [
                                {
                                    Name: "onclick",
                                    Value: function () {
                                        GlobalUtilities.confirm(RVDic.Confirms.RefuseEvaluationForm, function (r) { if (r) that.refuse(); });
                                    }
                                }
                            ],
                            Childs: [{ Type: "text", TextValue: RVDic.Refuse }]
                        })
                    ]
                }
            ], that.ContainerDiv);

            if (elems["textOptions"]) {
                GlobalUtilities.load_files(["SingleDataContainer/NewSingleDataContainer.js"], {
                    OnLoad: function () {
                        that.Objects.TextList = new NewSingleDataContainer(elems["textOptions"], {
                            InputStyle: "width:100%; font-size:0.8rem;",
                            InnerTitle: RVDic.KW.TextOptionsEvaluation + "...",
                            NoButtons: true,
                            ArrayDataSource: that.Objects.TextOptions.Revision.map(function (val) { return [val, val] })
                        });

                        (that.Objects.Answers.TextOptions || []).forEach(function (val) {
                            that.Objects.TextList.add_item(Base64.decode(val), Base64.decode(val));
                        });
                    }
                });
            }

            for (var i = 0, lnt = questions.length; i < lnt; ++i) {
                if (that.Objects.Weighted) {
                    var w = questions[i].Weight && (questions[i].Weight > 0) ? questions[i].Weight : 0;

                    if (w <= 0) {
                        that.Objects.Weighted = false;
                        that.Objects.WeightSum = 0;
                    }
                    else that.Objects.WeightSum += w;
                }

                that.add_item(elems["container"], questions[i]);
            }

            var defaultText = RVDic.Description + (!that.Options.ForceEvaluatorsDescribe ? "" :
                " (" + RVDic.Necessary + ")") + "...";

            that.Objects.DescriptionInput = new AdvancedTextArea({
                ContainerDiv: elems["descriptionInput"],
                DefaultText: defaultText,
                QueryTemplate: "RelatedThings",
                ItemTemplate: { ItemsTitle: "Items", ID: "ItemID", Name: "Name", Type: "Type", ImageURL: "ImageURL" }
            });

            if ((that.Objects.Answers || {}).Description)
                that.Objects.DescriptionInput.set_data(Base64.decode(that.Objects.Answers.Description));

            elems["selfEvaluationButton"].onclick = function () {
                var _div = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-10 medium-9 large-8 rv-border-radius-1 SoftBackgroundColor",
                        Style: "margin:0rem auto; padding:1rem;", Name: "_div"
                    }
                ])["_div"];

                GlobalUtilities.loading(_div);
                GlobalUtilities.show(_div);

                GlobalUtilities.load_files(["KW/FilledEvaluationForm.js"], {
                    OnLoad: function (result) {
                        new FilledEvaluationForm(_div, { NodeID: that.Objects.NodeID, UserID: that.Objects.Creator.UserID });
                    }
                });
            };
        },

        add_item: function (container, question) {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "rv-border-radius-half rv-bg-color-trans-white DashedAutoHideBorder",
                    Style: "padding:0.5rem; margin-bottom:0.3rem;",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Style: "text-align:justify;",
                            Childs: [{ Type: "text", TextValue: Base64.decode(question.QuestionBody) }]
                        },
                        {
                            Type: "div", Class: "small-11 medium-10 large-10 rv-circle",
                            Style: "margin:0.5rem auto 0rem auto; padding:0rem 2rem; background-color:white;",
                            Childs: [
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12",
                                    Style: "width:540px; margin:0.3rem auto 1rem auto;", Name: "_div"
                                }
                            ]
                        }
                    ]
                }
            ], container);

            var retJson = { Data: question, Get: null };

            if ((question.Options || []).length == 0) {
                var slider = $(elems["_div"]).kendoSlider({
                    max: that.Options.ScoreScale,
                    change: function (e) { /* alert("Change: " + e.value); */ }
                }).data("kendoSlider");

                retJson.Get = function () {
                    return {
                        Value: slider.value(),
                        Weight: question.Weight,
                        WeightedValue: slider.value() * (that.Objects.Weighted ? question.Weight : 1)
                    };
                };

                var ans = ((that.Objects.Answers || {}).Answers || []).find(function (u) { return u.QuestionID == question.QuestionID; });
                if ((ans || {}).Score) slider.value(ans.Score);

                //retJson.Set = function (val) { slider.value(val); }
            }
            else {
                var _currentValue = 0;
                var _ops = [];

                var _add_option = function (op) {
                    var _div = GlobalUtilities.create_nested_elements([
                        {
                            Type: "div", Class: "rv-bg-color-trans-soft rv-border-radius-quarter", Name: "container",
                            Style: "cursor:pointer; padding:0.3rem; margin-top:0.3rem; text-align:justify;",
                            Properties: [
                                {
                                    Name: "onclick",
                                    Value: function () {
                                        _currentValue = op.Value;

                                        for (var i = 0, lnt = _ops.length; i < lnt; ++i)
                                            _ops[i].style.fontWeight = "normal";

                                        _div.style.fontWeight = "bold";
                                    }
                                }
                            ],
                            Childs: [{ Type: "text", TextValue: Base64.decode(op.Title) }]
                        }
                    ], elems["_div"])["container"];

                    _div.innerHTML = "";

                    GlobalUtilities.create_nested_elements([
                        {
                            Type: "span", Style: "margin-" + window.RV_RevFloat + ":0.6rem; color:red;",
                            Childs: [{ Type: "text", TextValue: "-" }]
                        },
                        { Type: "text", TextValue: GlobalUtilities.convert_numbers_to_persian(Base64.decode(op.Title)) }
                    ], _div);

                    _div.AnswerOption = op;
                    
                    _ops.push(_div);
                };

                question.Options.forEach(function (u) { _add_option(u); });

                var ans = ((that.Objects.Answers || {}).Answers || []).find(function (u) { return u.QuestionID == question.QuestionID; });
                var selectedOption = !ans ? null : _ops.find(function (o) { return (o.AnswerOption || {}).Value == ans.Score; });
                if (selectedOption) jQuery(selectedOption).click();
                
                var _coefficient = that.Options.ScoreScale / 10;

                retJson.Get = function () {
                    return {
                        Value: _currentValue * _coefficient,
                        Weight: question.Weight,
                        WeightedValue: _currentValue * _coefficient * (that.Objects.Weighted ? question.Weight : 1)
                    };
                };
            }


            that.Objects.Items.push(retJson);
        },

        confirm: function () {
            var that = this;

            var _coefficient = that.Options.ScoreScale / 10;

            var _sum = 0;
            var _qAnswers = "";
            for (var i = 0, lnt = that.Objects.Items.length; i < lnt; ++i) {
                var val = that.Objects.Items[i].Get();
                _sum += val.WeightedValue;
                _qAnswers += (_qAnswers == "" ? "" : "|") +
                    that.Objects.Items[i].Data.QuestionID + ":" + (val.Value / _coefficient);
            }
            if (_sum != 0) _sum /= ((that.Objects.Weighted ? that.Objects.WeightSum : that.Objects.Items.length) * _coefficient);

            var textArr = !that.Objects.TextList ? null :
                (that.Objects.TextList.get_items() || []).map(function (val) { return Base64.encode(val.Title); });

            KnowledgeAPI.SaveEvaluationForm({
                NodeID: that.Objects.NodeID, Answers: _qAnswers, Score: _sum,
                TextOptions: (textArr || []).join('|'),
                Description: Base64.encode(that.Objects.DescriptionInput.get_data()),
                UserID: that.Objects.EvaluatorID,
                ParseResults: true,
                ResponseHandler: function (result) {
                    if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                    else if (that.Options.OnConfirm) that.Options.OnConfirm(result, { Value: _sum, Coefficient: _coefficient });
                }
            });
        },

        refuse: function () {
            var that = this;

            KnowledgeAPI.RefuseEvaluation({
                NodeID: that.Objects.NodeID,
                Description: Base64.encode(that.Objects.DescriptionInput.get_data()),
                ParseResults: true,
                ResponseHandler: function (result) {
                    if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                    else if (that.Options.OnRefuse) that.Options.OnRefuse(result);
                }
            });
        }
    }
})();