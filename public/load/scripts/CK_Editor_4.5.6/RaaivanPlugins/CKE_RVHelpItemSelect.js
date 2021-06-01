(function () {
    if (window.CKE_RVHelpItemSelect) return;

    window.CKE_RVHelpItemSelect = function (containerDiv, params) {
        this.Container = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.Container) return;
        params = params || {};

        this.Objects = { Editor: params.Editor || "" };

        this.Options = {
            OnItemSelect: params.OnItemSelect
        };

        var that = this;
        
        that._init(params);
    }

    CKE_RVHelpItemSelect.prototype = {
        _init: function (params) {
            var that = this;

            jQuery(that.Container).on('click', '.cke_button__rvhelpitemselect', function (event) {
                var _div = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-10 medium-8 large-6 row rv-border-radius-1 SoftBackgroundColor",
                        Style: "margin:0rem auto; padding:1rem;", Name: "_div"
                    }
                ])["_div"];

                var showed = GlobalUtilities.show(_div);

                var index = that.architecture();

                new TreeView(_div, {
                    Items: index,
                    Item: function (itm) {
                        var titleArr = that._title(itm.Name);

                        return {
                            Name: Base64.encode(itm.Name),
                            Title: Base64.encode(titleArr[titleArr.length - 1]),
                            Childs: itm.Sub
                        };
                    },
                    OnClick: function (e, item, done) {
                        var titleArr = that._title(item.Name);

                        var str = "";

                        for (var i = 0; i < titleArr.length; ++i) {
                            str += titleArr[i] + (i == titleArr.length - 1 ? "" :
                                "<span style='margin:0.4rem;'>" + (RV_RTL ? ">" : "<") + "</span>");
                        }
                            
                        that.Objects.Editor.insertHtml('<span class="rv-border-radius-quarter" data-RV_TagID="' + item.Name + '" ' +
                            'data-RV_TagType="HelpItem" data-RV_TagValue="val" style="background-color:rgb(220,220,220); ' +
                            'padding:0.3rem; font-size:0.7rem; font-weight:bold;">' + str + '</span><span>&nbsp;</span>');
                        
                        showed.Close();
                    }
                });
            });
        },

        _title: function (name) {
            return (HelpUtils.get_title || function (name) { return name; })(name);
        },

        architecture: function () {
            return (HelpUtils.get_architecture || function () { return []; })();
        }
    }
})();