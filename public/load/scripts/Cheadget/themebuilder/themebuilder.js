(function () {
    window.RVCheadget = window.RVCheadget || {};
    if (RVCheadget.themebuilder) return;

    var themebuilder = function () {
        this.ContainerDiv = document.createElement("div");

        this.TemplateBody = null;

        var that = this;

        var elems = GlobalUtilities.create_nested_elements([
            {
                Type: "div", Name: "_div",
                Style: "position: fixed; z-index: " + GlobalUtilities.zindex.dialog() + "; padding: 0px; margin: 0px; font-family: tahoma; " +
                    "min-width:440px; max-width:440px; width:440px; top: 0px; left: 395.5px;" +
                    "border: 5px solid rgb(153, 153, 153); border-radius: 5px; background-color:white;",
                Childs: [
                    {
                        Type: "div", Name: "options",
                        Style: "width:400px; margin:8px auto 8px auto; display:none;", 
                        Childs: [
                            {
                                Type: "div", Class: "Float", Style: "width:300px;",
                                Childs: [
                                    {
                                        Type: "input", Name: "colorInput", Class: "TextInput",
                                        Style: "width:290px; text-align:center; direction:ltr;",
                                        Attributes: [
											{ Name: "type", Value: "text" },
											{ Name: "placeholder", Value: "Color code..." }
                                        ]
                                    }
                                ]
                            },
                            {
                                Type: "div", Class: "RevFloat ActionButton", Style: "width:90px; margin-top:2px;",
                                Properties: [{ Name: "onclick", Value: function () { that.build_theme(elems["colorInput"].value); } }],
                                Childs: [{ Type: "text", TextValue: RVDic.Go }]
                            },
                            { Type: "div", Style: "clear:both;" }
                        ]
                    },
                    { Type: "div", Name: "result", Style: "text-align:center;" }
                ]
            }
        ], document.body);

        GlobalUtilities.set_onenter(elems["colorInput"], function () {
            that.build_theme(elems["colorInput"].value);
        });

        that.ColorInput = elems["colorInput"];
        that.ResultArea = elems["result"];
        that.ContainerDiv = elems["_div"];

        GlobalUtilities.loading(elems["result"]);

        GlobalUtilities.load_files(["Cheadget/themebuilder/tinycolor.js"], {
            OnLoad: function () {
                jQuery.ajax({
                    url: "../../css/theme-template.css?timestamp=" + (new Date).getTime(),
                    type: "GET",
                    dataType: "text",
                    success: function (r) {
                        that.TemplateBody = r;
                        
                        elems["result"].innerHTML = "";
                        elems["options"].style.display = "block";

                        jQuery(that.ColorInput).focus();
                    }
                });
            }
        });

        that.show();
    }

    themebuilder.prototype = {
        show: function () {
            var that = this;

            jQuery(that.ColorInput).focus();

            that.ContainerDiv.style.top = ((jQuery(window).height() / 2) - (jQuery(that.ContainerDiv).outerHeight() / 2)) + "px";
            that.ContainerDiv.style.left = ((jQuery(window).width() / 2) - (jQuery(that.ContainerDiv).outerWidth() / 2)) + "px";

            that.ContainerDiv.style.display = "block";
            that.ContainerDiv.zIndex = GlobalUtilities.zindex.dialog();

            GlobalUtilities.add_to_escape_queue(that.ContainerDiv, function () { that.ContainerDiv.style.display = "none"; });
        },

        build_theme: function (color) {
            var that = this;

            that.ResultArea.innerHTML = "";

            var childs = [];

            var add_child = function (p) {
                p = p || {};

                childs.push({
                    Type: "div", Class: "Float",
                    Style: "padding:1px; margin:8px; width:50px; height:50px; border-radius:4px;" +
                        "border-width:1px; border-style:solid; border-color:transparent;" + (p.Style ? p.Style : ""),
                    Childs: [{ Type: "text", TextValue: p.Name }]
                });
            };

            var arr = {
                color: null, verysoft: null, soft: null, warm: null, verywarm: null, warmborder: null, softborder: null,
                actionbutton: null, verytransparentwarm: null, mediumtransparentwarm: null, transparentwarm: null
            };

            var c = tinycolor(color).toRgb();
            c.r = 255 - c.r;
            c.g = 255 - c.g;
            c.b = 255 - c.b;

            arr.color = tinycolor(color).toHexString();
            arr.reverse = tinycolor(c).toHexString();
            arr.verysoft = tinycolor(color).lighten(40).toHexString(); //lighten, brighten
            arr.soft = tinycolor(color).lighten(30).toHexString(); //lighten, brighten
            arr.warm = tinycolor(color).darken(5).toHexString();
            arr.verywarm = tinycolor(color).darken(15).toHexString();
            arr.warmborder = tinycolor(color).desaturate(30).toHexString();
            arr.softborder = tinycolor(color).saturate(20).toHexString();
            arr.actionbutton = arr.color; //tinycolor(tinycolor(color).analogous()[4]).toHexString()
            arr.highlytransparentwarm = tinycolor(arr.softborder).setAlpha(0.06).toRgbString();
            arr.verytransparentwarm = tinycolor(arr.softborder).setAlpha(0.1).toRgbString();
            arr.mediumtransparentwarm = tinycolor(arr.verytransparentwarm).setAlpha(0.5).toRgbString();
            arr.transparentwarm = tinycolor(arr.verytransparentwarm).setAlpha(0.7).toRgbString();
            
            add_child({ Name: "color", Style: "background-color:" + arr.color + ";" });
            add_child({ Name: "vsoft", Style: "background-color:" + arr.verysoft + ";" });
            add_child({ Name: "soft", Style: "background-color:" + arr.soft + ";" });
            add_child({ Name: "warm", Style: "background-color:" + arr.warm + ";" });
            add_child({ Name: "vwarm", Style: "background-color:" + arr.verywarm + ";" });
            add_child({ Name: "wborder", Style: "background-color:white; border-color:" + arr.warmborder + ";" });
            add_child({ Name: "sborder", Style: "background-color:white; border-color:" + arr.softborder + ";" });
            add_child({ Name: "acbtn", Style: "background-color:" + arr.actionbutton + "; border-color:" + arr.warmborder + "; color:white;" });
            add_child({ Name: "htwarm", Style: "background-color:" + arr.highlytransparentwarm + ";" });
            add_child({ Name: "vtwarm", Style: "background-color:" + arr.verytransparentwarm + ";" });
            add_child({ Name: "mtwarm", Style: "background-color:" + arr.mediumtransparentwarm + ";" });
            add_child({ Name: "twarm", Style: "background-color:" + arr.transparentwarm + ";" });

            var elems = GlobalUtilities.create_nested_elements([
                { Type: "div", Style: "text-align:center; margin-bottom:10px;", Name: "colorCode" },
                { Type: "div", Childs: childs },
                { Type: "div", Style: "clear:both;" },
                {
                    Type: "div", Class: "ActionButton", Style: "width:200px; margin:10px auto;",
                    Properties: [
                        {
                            Name: "onclick",
                            Value: function () {
                                jQuery(elems["txtArea"]).select();
                                document.execCommand('copy');
                            }
                        }
                    ],
                    Childs: [{ Type: "text", TextValue: "Copy css code to clipboard" }]
                },
                {
                    Type: "div", Style: "position:relative;",
                    Childs: [
                        {
                            Type: "textarea", Name: "txtArea",
                            Style: "position:absolute; top:-30px; right:200px; z-index:-1;" +
                                "resize:none; overflow:hidden; width:0px; height:0px;"
                        }
                    ]
                }
            ], that.ResultArea);

            elems["colorCode"].innerHTML = arr.color;

            var cssBody = that.TemplateBody;

            for (var key in arr) {
                for (var i = 0; i < 100; ++i)
                    cssBody = cssBody.replace("[" + key + "]", arr[key]);
            }

            elems["txtArea"].value = cssBody;

            that.show();
        }
    }

    RVCheadget.themebuilder = new themebuilder();
})();