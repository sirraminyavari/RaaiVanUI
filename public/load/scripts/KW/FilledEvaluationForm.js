(function () {
    if (window.FilledEvaluationForm) return;

    window.FilledEvaluationForm = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;
        params = params || {};

        this.Objects = {
            NodeID: params.NodeID,
            AdditionalID: params.AdditionalID,
            NodeName: params.NodeName,
            Evaluator: params.Evaluator,
            Creator: params.Creator,
            WFVersionID: params.WFVersionID
        };
        
        var that = this;

        GlobalUtilities.load_files(["API/KnowledgeAPI.js"], {
            OnLoad: function () { that._preinit(); }, LoadSequential: true
        });
    }

    FilledEvaluationForm.prototype = {
        _preinit: function () {
            var that = this;
            
            KnowledgeAPI.GetFilledEvaluationForm({
                KnowledgeID: that.Objects.NodeID, UserID: (that.Objects.Evaluator || {}).UserID,
                WFVersionID: that.Objects.WFVersionID, ParseResults: true,
                ResponseHandler: function (result) {
                    that._initialize(result);
                }
            });
        },

        _initialize: function (params) {
            params = params || {};
            var that = this;

            that.ContainerDiv.innerHTML = "";

            if (!(params.Answers || []).length) return alert(RVDic.MSG.NothingToDisplay);

            var sum = 0;
            params.Answers.forEach(function (ans) { sum += ans.Score ? ans.Score : 0; });
            var avg = Number((sum / params.Answers.length).toFixed(2));

            var users = [
                { Title: RVDic.Evaluator, User: that.Objects.Evaluator },
                { Title: RVDic.Creator, User: that.Objects.Creator }
            ].filter(function (itm) { return !!(itm.User || {}).PageURL; });
            
            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "text-align:center; font-size:1.2rem; font-weight:bold; margin-bottom:1rem;",
                    Childs: [
                        { Type: "text", TextValue: RVDic.EvaluationForm },
                        {
                            Type: "div", Class: "rv-air-button rv-border-radius-quarter",
                            Style: "display:inline-block; font-size:0.7rem; margin-" + RV_Float + ":0.5rem; cursor:default;",
                            Childs: [{ Type: "text", TextValue: params.EvaluationDate }]
                        }
                    ]
                },
                (!that.Objects.NodeName ? null : {
                    Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-half",
                    Style: "margin-bottom:1rem; background-color:white; padding:0.5rem;",
                    Childs: [
                        {
                            Type: "div", Style: "display:inline-block; color:rgb(100,100,100); font-weight:bold; margin-" + RV_RevFloat + ":0.5rem;",
                            Childs: [{Type: "text", TextValue: RVDic.Title + ":"}]
                        },
                        { Type: "text", TextValue: Base64.decode(that.Objects.NodeName) },
                        (!that.Objects.AdditionalID ? null : {
                            Type: "div", Class: "rv-air-button-base rv-air-button-black rv-border-radius-quarter",
                            Style: "display:inline-block; margin-" + RV_Float + ":0.5rem; padding:0.1rem 0.3rem; font-size:0.6rem;",
                            Childs: [{ Type: "text", TextValue: that.Objects.AdditionalID }]
                        })
                    ]
                }),
                (!users.length ? null : {
                    Type: "div", Class: "small-12 medium-12 large-12 row", Style: "margin:0; margin-bottom:1rem;",
                    Childs: users.map(function (itm, ind) {
                        return {
                            Type: "div", Class: (users.length == 1 ? "small-12 medium-12 large-12" : "small-6 medium-6 large-6"),
                            Style: (users.length == 1 ? "" : "padding-" + (ind == 0 ? RV_RevFloat : RV_Float) + ":0.25rem;"),
                            Childs: [{
                                Type: "div", Class: "rv-border-radius-half",
                                Style: "display:flex; flex-flow:row; align-items:center; background-color:white; padding:0.5rem;",
                                Childs: [
                                    {
                                        Type: "div",
                                        Style: "flex:0 0 auto; padding-" + RV_RevFloat + ":0.5rem; color:rgb(100,100,100); font-weight:bold;",
                                        Childs: [{ Type: "text", TextValue: itm.Title + ":" }]
                                    },
                                    {
                                        Type: "img", Class: "rv-border-radius-quarter", Link: itm.User.PageURL,
                                        Style: "width:2rem; height:2rem; flex:0 0 auto;",
                                        Attributes: [{ Name: "src", Value: itm.User.ImageURL }]
                                    },
                                    {
                                        Type: "div", Style: "flex:1 1 auto; padding-" + RV_Float + ":0.5rem;",
                                        Childs: [{ Type: "text", TextValue: itm.User.FullName }]
                                    }
                                ]
                            }]
                        };
                    })
                }),
                {
                    Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-1", Name: "desc",
                    Style: "background-color:white; padding:1rem; margin-bottom:1rem;" + 
                        (params.Description ? "" : "display:none;")
                },
                { Type: "div", Class: "small-12 medium-12 large-12 rv-trim-vertical-margins", Name: "items" },
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "text-align:center; margin-top:1rem; font-weight:bold;",
                    Childs: [
                        {
                            Type: "div", Style: "display:inline-block;",
                            Childs: [{ Type: "text", TextValue: RVDic.Score + ":" }]
                        },
                        {
                            Type: "div", Style: "display:inline-block; color:red; margin-" + RV_Float + ":0.5rem;",
                            Childs: [{ Type: "text", TextValue: avg || "0" }]
                        }
                    ]
                }
            ], that.ContainerDiv);

            if (params.Description) GlobalUtilities.append_markup_text(elems["desc"], Base64.decode(params.Description));

            jQuery.each(params.Answers, function (ind, val) { that.add_item(elems["items"], val); });
        },

        add_item: function (container, answer) {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "rv-border-radius-half rv-bg-color-white-softer SoftShadow",
                    Style: "padding:0.8rem; margin-bottom:0.3rem; position:relative; padding-" + RV_RevFloat + ":3rem;",
                    Childs: [
                        {
                            Type: "div",
                            Style: "position:absolute; top:0.1rem; bottom:0rem;" + RV_RevFloat + ":0rem;" +
                                "width:3rem; text-align:center; font-size:0.8rem; font-weight:bold;",
                            Childs: [{
                                Type: "middle", Class: "rv-circle rv-air-button-base rv-air-button-black",
                                Style: "display:" + (!answer.Score && (answer.Score !== 0) ? "none" : "inline-block") + ";" +
                                    "width:2rem; height:2rem; line-height:2rem; cursor:default; padding:0rem;",
                                Childs: [{ Type: "text", TextValue: Number(Number(answer.Score).toFixed(2)) || "0" }]
                            }]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Style: "text-align:justify;",
                            Childs: [{ Type: "text", TextValue: Base64.decode(answer.Title) }]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Name: "textValue",
                            Style: "margin-" + RV_Float + ":0.5rem;" +
                                "display:" + (answer.TextValue ? "inline-block" : "none") + ";"
                        }
                    ]
                }
            ], container);
            
            if (answer.TextValue) GlobalUtilities.append_markup_text(elems["textValue"], Base64.decode(answer.TextValue));
        }
    }
})();