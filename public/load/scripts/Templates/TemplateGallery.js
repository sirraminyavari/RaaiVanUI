(function () {
    if (window.TemplateGallery) return;

    window.TemplateGallery = function (container, params) {
        this.Container = typeof (container) == "object" ? container : document.getElementById(container);
        if (!this.Container) return;
        params = params || {};

        this.Objects = {
            Tags: [],
            TemplatesWithoutTag: [],
            AllTemplates: []
        };

        var that = this;

        GlobalUtilities.load_files(["API/CNAPI.js", "Templates/TemplateViewer.js"], {
            OnLoad: function () {
                that.preinit();
            }
        });
    };

    TemplateGallery.prototype = {
        preinit: function () {
            var that = this;

            CNAPI.GetTemplates({
                ParseResults: true,
                ResponseHandler: function (result) {
                    that.parse(result);
                    that.initialize();
                }
            });
        },

        initialize: function () {
            var that = this;

            that.Container.innerHTML = "";

            var tags = [{ Type: "all", Templates: that.Objects.AllTemplates }].concat(that.Objects.Tags);

            if (that.Objects.TemplatesWithoutTag.length)
                tags.push({ Type: "others", Templates: that.Objects.TemplatesWithoutTag });
            
            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Style: "font-size:1.2rem; font-weight:bold; text-align:center; margin-bottom:1rem;",
                    Childs: [{ Type: "text", TextValue: RVDic.TemplatesGallery }]
                },
                {
                    Type: "div", Style: "display:flex; flex-flow:row;",
                    Childs: [
                        {
                            Type: "div", Name: "tags",
                            Style: "flex:0 0 auto; width:12rem; padding-" + RV_RevFloat + ":0.5rem;",
                            Childs: tags.map(tag => {
                                var title = tag.Type == "all" ? RVDic.All :
                                    (tag.Type == "others" ? RVDic.Other : Base64.decode(tag.Name));

                                var elemName = tag.NodeID || tag.Type;

                                return {
                                    Type: "div", Class: "rv-border-radius-quarter rv-bg-color-trans-white", Name: elemName,
                                    Style: "padding:0.3rem; cursor:pointer;" +
                                        (["all", "others"].some(t => t == tag.Type) ? "color:rgb(80,80,80);" : ""),
                                    Properties: [{ Name: "onclick", Value: () => show_templates(elems[elemName], tag) }],
                                    Childs: [{ Type: "text", TextValue: title }]
                                };
                            })
                        },
                        {
                            Type: "div", Class: "rv-circle",
                            Style: "flex:0 0 auto; background-color:white; padding:0.15rem; margin-" + RV_RevFloat + ":0.5rem;"
                        },
                        {
                            Type: "div", Style: "flex:1 1 auto;",
                            Childs: [{ Type: "div", Class: "small-12 medium-12 large-12 row", Name: "templates" }]
                        }
                    ]
                }
            ], that.Container);

            //activate, upgrade, activate again

            var show_templates = function (tagContainer, tag) {
                [].forEach.call(elems["tags"].childNodes, (e) => {
                    e.style.fontWeight = e == tagContainer ? "bold" : "normal";
                });

                jQuery(elems["templates"]).fadeOut(200, () => {
                    elems["templates"].innerHTML = "";

                    (tag.Templates || [])
                        .forEach(tmp => that.add_template(elems["templates"], tmp));

                    jQuery(elems["templates"]).fadeIn(500);
                });
            };

            jQuery(elems["tags"].childNodes[0]).click();
        },

        add_template: function (container, template) {
            var that = this;
            
            GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-12 medium-6 large-4", Style: "padding:0.5rem;",
                Childs: [{
                    Type: "div", Class: "rv-border-radius-half SoftBorder SurroundingShadow",
                    Style: "display:flex; flex-flow:column; height:100%; padding:0.5rem;" +
                        "border-color:rgb(240,240,240); background-color:white; cursor:pointer;",
                    Properties: [{ Name: "onclick", Value: () => that.select_template(template) }],
                    Childs: [
                        {
                            Type: "div",
                            Style: "flex:0 0 auto; text-align:center; font-weight:500; text-align:center; color:rgb(100,100,100);",
                            Childs: [{ Type: "text", TextValue: Base64.decode(template.TypeName) }]
                        },
                        (!(template.Tags || []).length ? null : {
                            Type: "div", Style: "flex:1 1 auto;"
                        }),
                        (!(template.Tags || []).length ? null : {
                            Type: "div", Style: "flex:0 0 auto; margin-top:1rem; text-align:center;",
                            Childs: template.Tags.map(tag => ({
                                Type: "div", Class: "rv-air-button-base rv-air-button-black rv-border-radius-quarter",
                                Style: "display:inline-block; padding:0.1rem 0.2rem; font-size:0.6rem; margin:0.1rem;",
                                Childs: [{ Type: "text", TextValue: Base64.decode(tag.Name) }]
                            }))
                        })
                    ]
                }]
            }], container);
        },

        select_template: function (template) {
            var that = this;

            var templateId = template.NodeTypeID;

            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-10 medium-8 large-6 rv-border-radius-1 SoftBackgroundColor",
                Style: "margin:0 auto; padding:1rem;", Name: "container",
                Childs: [
                    {
                        Type: "div", Style: "text-align:center; font-size:1.2rem; font-weight:bold; margin-bottom:1rem;",
                        Childs: [{ Type: "text", TextValue: Base64.decode(template.TypeName) }]
                    },
                    { Type: "div", Class: "rv-trim-vertical-margins", Name: "content" }
                ]
            }]);

            GlobalUtilities.loading(elems["content"]);
            GlobalUtilities.show(elems["container"]);

            CNAPI.GetTemplateJSON({
                NodeTypeID: templateId, ParseResults: true,
                ResponseHandler: function (templateContent) {
                    CNAPI.GetTemplateStatus({
                        Template: JSON.stringify(templateContent), ParseResults: true,
                        ResponseHandler: function (dt) {
                            var keys = Object.keys(dt || {})
                                .filter(key => !!dt[key] && dt[key].length && dt[key][0].TemplateID);

                            var instances = dt[templateId] || [];
                            var dependencyInstances =
                                keys.filter(k => k != templateId).map(k => ({ TemplateID: k, Instances: dt[k] }));

                            new TemplateViewer(elems["content"], {
                                TemplateID: templateId,
                                TemplateName: Base64.decode(template.TypeName),
                                TemplateContent: templateContent,
                                Instances: instances,
                                DependencyInstances: dependencyInstances
                            });
                        }
                    });
                }
            });
        },

        add_status_item: function (container, template) {
            var that = this;
            template = template || {};

            var x = {
                "ActivatedName": "2LPYp9iy2YXYp9mG",
                "ActivationDate": "2021-05-26",
                "ActivationDate_Jalali": "1400/03/05",
                "Activator": {
                    "UserID": "7ad9883c-0442-407a-8cc1-5b4c1ee6a225",
                    "UserName": "cmFtaW4=",
                    "FirstName": "2LHYp9mF24zZhg==",
                    "LastName": "24zYp9mI2LHbjA==",
                    "IncompleteProfile": false,
                    "ProfileImageURL": "../../Images/unknown.jpg",
                    "ImageURL": "../../Images/unknown.jpg"
                },
                "TemplateElementsCount": 9,
                "ElementsCount": 9,
                "NewTemplateElementsCount": 0,
                "RemovedTemplateElementsCount": 0,
                "NewCustomElementsCount": 0
            };

            GlobalUtilities.create_nested_elements([{

            }], container);

            container.innerHTML = JSON.stringify(template);
        },

        parse: function (data) {
            var that = this;
            data = data || {};

            var tags = data.Tags || [],
                templateTags = data.TemplateTags || [],
                templates = data.Templates || [];

            tags.forEach(tg => {
                tg.Templates = Object.keys(templateTags)
                    .map(key => ({
                        TemplateID: key,
                        TagIDs: templateTags[key] || []
                    }))
                    .filter(x => {
                        return x.TagIDs.some(tId => tId == tg.NodeID) &&
                            templates.some(t => t.NodeTypeID == x.TemplateID);
                    })
                    .map(x => templates.filter(t => t.NodeTypeID == x.TemplateID)[0]);
            });

            templates.forEach(tmp => {
                tmp.Tags = !templateTags[tmp.NodeTypeID] ? [] :
                    templateTags[tmp.NodeTypeID]
                        .map(id => tags.filter(tg => tg.NodeID == id))
                        .map(arr => !arr.length ? null : arr[0])
                        .filter(tg => !!tg);
            });

            that.Objects.Tags = tags.filter(t => (t.Templates || []).length);

            that.Objects.TemplatesWithoutTag = templates
                .filter(tmp => !tags.some(tg => tg.Templates.some(tt => tt.NodeTypeID == tmp.NodeTypeID)));

            that.Objects.AllTemplates = templates;
        }
    };
})();