(function () {
    if (window.CKE_RVTag) return;

    window.CKE_RVTag = function (containerDiv, params) {
        this.Container = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);

        if (!this.Container) return;
        params = params || {};

        this.Objects = { Editor: params.Editor || "" };
        var that = this;

        that._init(params);
    }

    CKE_RVTag.prototype = {
        _init: function (params) {
            var that = this;

            var tagButton = null;
            var container = null;
            var popupMenu = null;

            var _stick = function () {
                if (!tagButton || !container) return;

                if (popupMenu) popupMenu.Show();
                else popupMenu = GlobalUtilities.popup_menu(tagButton, container, { Align: "bottom" });

                popupMenu.Container.style.zIndex = GlobalUtilities.zindex.dialog();

                jQuery(tagButton).removeClass("cke_button_off").addClass("cke_button_on");
            };

            var _hide = function () {
                popupMenu.Hide();
                jQuery(tagButton).removeClass("cke_button_on").addClass("cke_button_off");
            }

            jQuery(that.Container).on('click', '.cke_button__rvtag', function (event) {
                if (!tagButton) tagButton = this;

                if (container) return !GlobalUtilities.is_visible(container) ? _stick() : _hide();

                var elems = GlobalUtilities.create_nested_elements([
                    { Type: "div", Class: "rv-border-radius-quarter", Name: "container", Style: "width:20rem;" }
                ]);

                container = elems["container"];
                
                jQuery(tagButton).removeClass("cke_button_off").addClass("cke_button_on");

                var _insertTag = function (tag) {
                    that.Objects.Editor.insertHtml('<a data-RV_TagID="' + tag.ID + '"' + 'data-RV_TagType="' +
                        tag.Type + '"' + 'data-RV_TagValue="' + Base64.encode(tag.Value) + '"' + '" href="' +
                        AdvancedTextArea.get_url(tag) + '">' + tag.Value + '</a><span>&nbsp;</span>');

                    _hide();
                }

                GlobalUtilities.loading(container);

                _stick();

                GlobalUtilities.load_files([
                    { Root: "API/", Ext: "js", Childs: ["CNAPI", "UsersAPI"] },
                    "CK_Editor_" + window.CKE_VERSION + "/RaaivanPlugins/RVTag.js"
                ], {
                    OnLoad: function () {
                        new RVTag(container, GlobalUtilities.extend(params, { OnSelect: function (tag) { _insertTag(tag); } }));
                    }
                });

                jQuery(document).bind('click', function (event) {
                    if (!jQuery(event.target).closest(container).length &&
                        !jQuery(event.target).closest(tagButton).length && GlobalUtilities.is_visible(container)) _hide();
                });

                that.Objects.Editor.document.on('click', function (e) { _hide(); });
            });
        }
    }
})();