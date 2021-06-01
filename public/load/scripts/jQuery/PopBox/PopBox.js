(function () {
    $.fn.popbox = function (options) {
        var settings = $.extend({
            content: null,
            container: jQuery(this).get(0),
            openbutton: null,
            selector: this.selector,
            box: null,
            arrow: ".arrow",
            arrow_border: ".arrow-border",
            OnShow: null,
            OnHide: null
        }, options);

        var elems = GlobalUtilities.create_nested_elements([
            { Type: "div", Class: "popbox", Name: "popbox",
                Childs: [
                    { Type: "div", Class: "collapse",
                        Childs: [
                            { Type: "div", Class: "box", Name: "box",
                                Childs: [
                                    { Type: "div", Class: "arrow" },
                                    { Type: "div", Class: "arrow-border" },
                                    { Type: "div", Style: "padding:4px 8px 8px 8px;", Name: "content" }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]);

        elems["content"].appendChild(settings['content']);
        settings['box'] = $(elems["box"]);

        var methods = {
            open: function (event) {
                if (settings['box'].css('display') != 'block') settings["container"].appendChild(elems['popbox']);

                event.preventDefault();

                var pop = $(this);
                var box = settings['box'];
                
                box.find(settings['arrow']).css({ 'left': box.width() / 2 - 10 });
                box.find(settings['arrow_border']).css({ 'left': box.width() / 2 - 10 });

                var top = 10;
                
                if (box.css('display') != 'block') {
                    box.css({ 'display': 'block', 'top': top, 'left': (($(settings["container"]).width() / 2) - box.width() / 2) });

                    if (settings.OnShow) settings.OnShow(function () {
                        box.find(settings['arrow']).css({ 'left': box.width() / 2 - 10 });
                        box.find(settings['arrow_border']).css({ 'left': box.width() / 2 - 10 });
                        box.css({ 'display': 'block', 'top': top, 'left': (($(settings["container"]).width() / 2) - box.width() / 2) });
                    });
                }
            },

            close: function () {
                $(settings['box']).fadeOut("fast");
                if (settings['box'].css('display') == 'block' && settings.OnHide) settings.OnHide();
            }
        };

        $(document).bind('keyup', function (event) { if (event.keyCode == 27) methods.close(); });
        $(document).bind('click', function (event) {
            if (!$(event.target).closest(settings['openbutton']).length &&
                !$(event.target).closest(settings['box']).length) methods.close();
        });

        return this.each(function () {
            $(settings['openbutton'], this).bind('click', function (event) {
                if (settings['box'].css('display') == 'block') methods.close();
                else methods.open(event);
            });
        });
    }
}).call(this);