(function () {
    if (window.TemplateViewer) return;

    window.TemplateViewer = function (container, params) {
        this.Container = typeof (container) == "object" ? container : document.getElementById(container);
        if (!this.Container) return;
        params = params || {};

        this.Objects = {
            TemplateID: params.TemplateID,
            TemplateName: params.TemplateName,
            TemplateContent: params.TemplateContent,
            Instances: params.Instances,
            DependencyInstances: params.DependencyInstances,
            Parser: null
        };

        var that = this;

        GlobalUtilities.load_files(["Templates/TemplateParser.js"], {
            OnLoad: function () {
                that.Objects.Parser = new TemplateParser(that.Objects.TemplateContent);

                that.initialize();
            }
        });
    };

    TemplateViewer.prototype = {
        initialize: function () {
            var that = this;

            that.Container.innerHTML = "";

            var instances = that.Objects.Instances || [];
            var dependencies = that.Objects.DependencyInstances || [];

            var elems = GlobalUtilities.create_nested_elements([
                (!instances.length ? null : {
                    Type: "div", Class: "rv-trim-vertical-margins", Name: "instances", Style: "margin-bottom:1rem;"
                }),
                (!dependencies.length ? null : {
                    Type: "div", Style: "margin-bottom:1rem; font-weight:bold; color:rgb(80, 80, 80);",
                    Childs: [{ Type: "text", TextValue: RVDic.PrerequisiteTemplates }]
                }),
                (!dependencies.length ? null : {
                    Type: "div", Class: "rv-trim-vertical-margins", Name: "dependencies",
                    Style: "margin-bottom:1rem; padding-" + RV_Float + ":1rem;"
                }),
                {
                    Type: "div", Style: "display:flex; flex-flow:row; justify-content:center;",
                    Childs: [{
                        Type: "div", Class: "rv-air-button rv-circle", Style: "flex:0 0 auto; width:8rem;",
                        Childs: [{ Type: "text", TextValue: instances.length ? RVDic.ActivateAgain : RVDic.Activate }]
                    }]
                }
            ], that.Container);

            instances.forEach(inst => that.add_instance(elems["instances"], inst));

            dependencies.forEach(dep => that.add_dependency(elems["dependencies"], dep));
        },

        item_count: function (title, count) {
            return !count ? null : {
                Type: "div", Class: "rv-border-radius-quarter SoftBorder",
                Style: "margin:0.3rem; display:inline-block; text-align:center; padding:0.3rem; border-color:rgb(240,240,240);",
                Childs: [
                    {
                        Type: "div", Style: "font-size:0.7rem;",
                        Childs: [{ Type: "text", TextValue: title }]
                    },
                    {
                        Type: "div",
                        Childs: [{ Type: "text", TextValue: count }]
                    }
                ]
            };
        },

        add_instance: function (container, instance) {
            var that = this;

            var instanceId = instance.ActivatedID;

            var fullname = GlobalUtilities.trim((Base64.decode((instance.Activator || {}).FirstName) || " ") + " " +
                (Base64.decode((instance.Activator || {}).LastName) || " "));

            var hasCount = (instance.TemplateElementsCount != instance.ElementsCount) ||
                instance.NewTemplateElementsCount || instance.RemovedTemplateElementsCount || instance.NewCustomElementsCount;

            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "rv-border-radius-half",
                Style: "padding:0.5rem; margin-bottom:0.5rem; background-color:white;",
                Childs: [
                    {
                        Type: "div", Style: "display:flex; flex-flow:row;",
                        Childs: [
                            {
                                Type: "div", Style: "flex:1 1 auto;",
                                Childs: [
                                    { Type: "text", TextValue: Base64.decode(instance.ActivatedName) },
                                    {
                                        Type: "div",
                                        Style: "display:inline-block; margin-" + RV_Float + ":0.5rem;" +
                                            "color:rgb(150,150,150); font-size:0.6rem;",
                                        Childs: [{ Type: "text", TextValue: instance.ActivationDate_Jalali }]
                                    },
                                    (!hasCount ? null : {
                                        Type: "div", Class: "rv-link", Name: "toggleButton",
                                        Style: "display:inline-block; margin-" + RV_Float + ":0.5rem; font-size:0.6rem;",
                                        Childs: [{ Type: "text", TextValue: RVDic.ContainsChanges }]
                                    })
                                ]
                            },
                            {
                                Type: "div", Class: "RevDirection RevTextAlign", Style: "flex:0 0 auto;",
                                Childs: [
                                    {
                                        Type: "img", Class: "rv-circle", Style: "width:1rem; height:1rem;",
                                        Attributes: [{ Name: "src", Value: instance.Activator.ProfileImageURL }]
                                    },
                                    {
                                        Type: "span", Class: "rv-circle SoftBackgroundColor",
                                        Style: "padding:0.1rem 0.5rem; margin-" + RV_RevFloat + ":0.3rem; font-size:0.7rem;",
                                        Childs: [{ Type: "text", TextValue: fullname }]
                                    }
                                ]
                            }
                        ]
                    },
                    (!hasCount ? null : {
                        Type: "div", Style: "display:none;", Name: "details",
                        Childs: [
                            {
                                Type: "div", Style: "margin-top:0.5rem;",
                                Childs: [
                                    that.item_count(RVDic.FG.Template.TemplateElementsCount, instance.TemplateElementsCount),
                                    that.item_count(RVDic.FG.Template.ElementsCount, instance.ElementsCount),
                                    that.item_count(RVDic.FG.Template.NewTemplateElementsCount, instance.NewTemplateElementsCount),
                                    that.item_count(RVDic.FG.Template.RemovedTemplateElementsCount, instance.RemovedTemplateElementsCount),
                                    that.item_count(RVDic.FG.Template.NewCustomElementsCount, instance.NewCustomElementsCount)
                                ]
                            },
                            {
                                Type: "div", Style: "display:flex; justify-content:center; font-size:0.7rem; margin-top:0.5rem;",
                                Childs: [
                                    (!instance.NewTemplateElementsCount ? null : {
                                        Type: "div", Class: "rv-air-button rv-circle", Style: "flex:0 0 auto; width:8rem;",
                                        Childs: [{ Type: "text", TextValue: RVDic.Update }]
                                    }),
                                    (!instance.NewTemplateElementsCount ? null : { Type: "div", Style: "flex:0 0 auto; width:5%;" }),
                                    (!hasCount ? null : {
                                        Type: "div", Class: "rv-air-button rv-circle", Style: "flex:0 0 auto; width:8rem;",
                                        Childs: [{ Type: "text", TextValue: RVDic.Compare }]
                                    })
                                ]
                            }
                        ]
                    })
                ]
            }], container);

            if (elems["toggleButton"]) elems["toggleButton"].onclick = function () {
                jQuery(elems["details"]).animate({ height: "toggle" }, 500);
            };
        },

        add_dependency: function (container, dependency) {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div",
                Childs: [
                    {
                        Type: "div", Style: "margin-bottom:0.5rem;",
                        Childs: [{ Type: "text", TextValue: Base64.decode(dependency.Instances[0].TemplateName) }]
                    },
                    { Type: "div", Name: "instances" }
                ]
            }], container);

            dependency.Instances.forEach(inst => that.add_instance(elems["instances"], inst));
        }
    };
})();