(function () {
    if (window.CaptchaImage) return;

    window.CaptchaImage = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;
        params = params || {};

        this.Interface = {
            Input: null
        };

        this.Options = {
            OnEnter: params.OnEnter
        };
        
        var that = this;

        GlobalUtilities.load_files(["API/RVAPI.js"], { OnLoad: function () { that.initialize(); } });
    };

    CaptchaImage.prototype = {
        initialize: function () {
            var that = this;

            that.ContainerDiv.innerHTML = "";

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12 row",
                    Style: "margin:0rem auto; padding-" + RV_Float + ":2rem; position:relative;",
                    Childs: [
                        {
                            Type: "div", Style: "position:absolute; top:0rem; " + RV_Float + ":0rem;",
                            Childs: [
                                {
                                    Type: "i", Class: "fa fa-refresh fa-2x rv-icon-button",
                                    Tooltip: RVDic.Reload, TooltipAlign: RV_Float,
                                    Attributes: [{ Name: "aria-hidden", Value: true }],
                                    Properties: [{ Name: "onclick", Value: function () { set_captcha(); } }]
                                }
                            ]
                        },
                        { Type: "div", Class: "small-12 medium-12 large-12", Name: "captchaImage" },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Style: "margin-top:0.5rem;",
                            Childs: [
                                {
                                    Type: "number", Class: "rv-input", Name: "textInput",
                                    Style: "width:100%; text-align:center;", InnerTitle: RVDic.Captcha
                                }
                            ]
                        }
                    ]
                }
            ], that.ContainerDiv);

            that.Interface.Input = elems["textInput"];

            if (that.Options.OnEnter) GlobalUtilities.set_onenter(that.Interface.Input, function () {
                that.Options.OnEnter({ Value: that.get() });
            });

            var set_captcha = that.set_captcha = function () {
                elems["captchaImage"].innerHTML = "";
                GlobalUtilities.loading(elems["captchaImage"]);

                var _img = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "SoftBorder", Name: "_img",
                        Style: "background-color:white; padding:0.5rem; width:100%; text-align:center;" +
                            GlobalUtilities.border_radius("0.2rem"),
                        Childs: [
                            {
                                Type: "img",
                                Attributes: [{ Name: "src", Value: RVAPI.CaptchaImage({ Width: 180, Height: 40 }) }],
                                Properties: [
                                    {
                                        Name: "onload",
                                        Value: function () {
                                            elems["captchaImage"].innerHTML = "";
                                            elems["captchaImage"].appendChild(_img);
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ])["_img"];
            }

            set_captcha();
        },

        set_captcha: function () { },

        get: function () {
            return GlobalUtilities.trim((this.Interface.Input || {}).value);
        },

        reset: function () {
            if (this.Interface.Input) this.Interface.Input.value = "";
            this.set_captcha();
        }
    }
})();