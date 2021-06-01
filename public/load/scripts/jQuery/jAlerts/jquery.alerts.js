// jQuery Alert Dialogs Plugin
//
// Version 1.1
//
// Cory S.N. LaViska
// A Beautiful Site (http://abeautifulsite.net/)
// 14 May 2009
//
// Website: http://abeautifulsite.net/blog/2008/12/jquery-alert-dialogs/
//
// Usage:
//		jAlert( message, [title, callback] )
//		jConfirm( message, [title, callback] )
//		jPrompt( message, [value, title, callback] )
// 
// History:
//
//		1.00 - Released (29 December 2008)
//
//		1.01 - Fixed bug where unbinding would destroy all resize events
//
// License:
// 
// This plugin is dual-licensed under the GNU General Public License and the MIT License and
// is copyright 2008 A Beautiful Site, LLC.
//

(function ($) {

    $.alerts = {

        // These properties can be read/written by accessing $.alerts.propertyName from your scripts at any time

        verticalOffset: -75,                // vertical offset of the dialog from center screen, in pixels
        horizontalOffset: 0,                // horizontal offset of the dialog from center screen, in pixels/
        repositionOnResize: true,           // re-centers the dialog on window resize
        overlayOpacity: .3,                // transparency level of overlay
        overlayColor: '#AAA',               // base color of overlay
        draggable: true,                    // make the dialogs draggable (requires UI Draggables plugin)
        okButton: '&nbsp;OK&nbsp;',         // text for the OK button
        cancelButton: '&nbsp;Cancel&nbsp;', // text for the Cancel button
        dialogClass: null,                  // if specified, this class will be applied to all dialogs

        // Public methods

        //Ramin's
        alert: function (message, title, callback, params) {
            if (title == null) title = 'Alert';
            return $.alerts._show(title, message, null, 'alert', function (result) { if (callback) callback(result); }, params);
        },

        dialog: function (_div, title, params) {
            if (title == null) title = '';
            return $.alerts._show(title, _div, null, 'dialog', null, params);
        },
        //end of Ramin's

        confirm: function (message, title, callback) {
            if (title == null) title = 'Confirm';
            return $.alerts._show(title, message, null, 'confirm', function (result) {
                if (callback) callback(result);
            });
        },

        // Private methods

        //Ramin's
        _show: function (title, msg, value, type, callback, params) {
            params = params || {};
            //_show: function (title, msg, value, type, callback) {
            //end of Ramin's

            var __IDS = {
                Container: "a" + GlobalUtilities.generate_new_guid(),
                Title: "a" + GlobalUtilities.generate_new_guid(),
                Content: "a" + GlobalUtilities.generate_new_guid(),
                Message: "a" + GlobalUtilities.generate_new_guid(),
                Panel: "a" + GlobalUtilities.generate_new_guid(),
                OK: "a" + GlobalUtilities.generate_new_guid(),
                Cancel: "a" + GlobalUtilities.generate_new_guid(),
                Overlay: "a" + GlobalUtilities.generate_new_guid()
            }

            $.alerts._hide(__IDS);
            $.alerts._overlay('show', type == 'dialog' ? GlobalUtilities.zindex.dialog() : GlobalUtilities.zindex.alert(), __IDS);

            $('BODY').append(
			  '<div id="' + __IDS.Container + '" class="popup_container">' +
			    '<h1 id="' + __IDS.Title + '" class="popup_title"></h1>' +
			    '<div id="' + __IDS.Content + '" class="popup_content">' +
			      '<div id="' + __IDS.Message + '" class="popup_message"></div>' +
				'</div>' +
			  '</div>');

            if ($.alerts.dialogClass) $("#" + __IDS.Container).addClass($.alerts.dialogClass);

            if ((title || "") == "" && params.CloseButton !== true) $("#" + __IDS.Title).remove();

            // IE6 Fix
            var pos = ($.browser.msie && parseInt($.browser.version) <= 6) ? 'absolute' : 'fixed';

            $("#" + __IDS.Container).css({
                position: pos,
                zIndex: type == 'dialog' ? GlobalUtilities.zindex.dialog() : GlobalUtilities.zindex.alert(),
                padding: 0,
                margin: 0
            });

            $("#" + __IDS.Title).text(title);
            //Ramin's
            if (type != "dialog") {
                $("#" + __IDS.Content).addClass(type);
                $("#" + __IDS.Message).text(msg);
                $("#" + __IDS.Message).html($("#" + __IDS.Message).text().replace(/\n/g, '<br />'));

                GlobalUtilities.block($("#" + __IDS.Message), { Opacity: 0 });
            }
            else if (params.CloseButton === true) {
                var _ttCont = $("#" + __IDS.Title)[0];

                _ttCont.innerHTML = "";

                _ttCont.style.paddingLeft = "4px";
                _ttCont.style.paddingRight = "4px";

                GlobalUtilities.create_nested_elements([
                    { Type: "div", Style: "float:right;", Childs: [{ Type: "text", TextValue: title}] },
                    { Type: "div", Style: "float:left; margin-top:4px;",
                        Childs: [
                            { Type: "img", Style: "width:16px; height:16px; cursor:pointer;",
                                Attributes: [{ Name: "src", Value: "../../images/Delete.png"}],
                                Properties: [
                                    { Name: "onmouseover", Value: function () { this.setAttribute("src", "../../images/Delete-over.png"); } },
                                    { Name: "onmouseout", Value: function () { this.setAttribute("src", "../../images/Delete.png"); } },
                                    { Name: "onclick", Value: function () { $.alerts._hide(__IDS); } }
                                ]
                            }
                        ]
                    },
                    { Type: "div", Style: "clear:both;" }
                ], _ttCont);
            }
            $("#" + __IDS.Container)[0].style.fontFamily = "tahoma";
            //$("#popup_message").text(msg);
            //$("#popup_message").html($("#popup_message").text().replace(/\n/g, '<br />'));
            //end of Ramin's

            $("#" + __IDS.Container).css({
                minWidth: $("#" + __IDS.Container).outerWidth(),
                maxWidth: $("#" + __IDS.Container).outerWidth()
            });

            //Ramin's
            if (params.Width) {
                $("#" + __IDS.Container)[0].style.width = params.Width + "px";
                $("#" + __IDS.Container)[0].style.maxWidth = params.Width + "px";
            }
            //end of Ramin's

            $.alerts._reposition(__IDS);
            $.alerts._maintainPosition(true, __IDS);

            //Ramin's
            var __buttonStyle = 'display: inline-block; zoom: 1; *display: inline; vertical-align: baseline; margin: 0 2px; outline: none;' +
	            'cursor: pointer; text-align: center; text-decoration: none; font: 13px/100% Tahoma; padding: 4px; width:54px;' +
                'text-shadow: 0 1px 1px rgba(0,0,0,.3); background-color:rgb(76, 143, 253); -webkit-box-shadow: 0 1px 2px rgba(0,0,0,.2);' +
                '-moz-box-shadow: 0 1px 2px rgba(0,0,0,.2); box-shadow: 0 1px 2px rgba(0,0,0,.2); border-style:solid; color:white; ' +
                'font-weight:bold; font-size:x-small;';
            //end of Ramin's

            switch (type) {
                //Ramin's                                                                                          
                case 'dialog':
                    msg.style.direction = "rtl";
                    $("#" + __IDS.Title).addClass("SoftShadow SoftBorder SoftBackgroundColor");

                    var __popupContent = $("#" + __IDS.Content)[0];
                    __popupContent.innerHTML = "";
                    __popupContent.appendChild(msg);

                    $.alerts._reposition(__IDS);

                    if (params.CloseOnEscape !== false) {
                        GlobalUtilities.add_to_escape_queue(__popupContent, function () {
                            $.alerts._hide(__IDS);
                            if (params.OnEscape) params.OnEscape();
                        });
                    }

                    break;
                //end of Ramin's                                                                                        
                case 'alert':
                    //Ramin's
                    var _hide = function () {
                        $.alerts._hide(__IDS);
                        callback(true);
                        if (params.TM) clearTimeout(params.TM);
                    }

                    if (params.DisableButton !== true) {
                        $("#" + __IDS.Message).after('<div id="' + __IDS.Panel + '" class="popup_panel">' +
                            '<input type="button" style="' + __buttonStyle + '" value="' +
                            $.alerts.okButton + '" id="' + __IDS.OK + '" /></div>');
                        
                        $("#" + __IDS.OK).click(function () { _hide(__IDS); });
                        $("#" + __IDS.OK).focus().keypress(function (e) {
                            if (e.keyCode == 13 || e.keyCode == 27) $("#" + __IDS.OK).trigger('click');
                        });
                    }

                    if (params.Timeout) params.TM = setTimeout(_hide, params.Timeout);

                    /*
                    $("#popup_message").after('<div id="popup_panel"><input type="button" value="' + $.alerts.okButton + '" id="popup_ok" /></div>');
                    $("#popup_ok").click(function () {
                    $.alerts._hide();
                    callback(true);
                    });
                    $("#popup_ok").focus().keypress(function (e) {
                    if (e.keyCode == 13 || e.keyCode == 27) $("#popup_ok").trigger('click');
                    });
                    */
                    //end of Ramin's
                    break;
                case 'confirm':
                    //Rammin's
                    $("#" + __IDS.Message).after('<div id="' + __IDS.Panel + '" class="popup_panel"><input type="button" style="' + __buttonStyle +
                        '" value="' + $.alerts.okButton + '" id="' + __IDS.OK + '" /> <input type="button" style="' + __buttonStyle +
                        '" value="' + $.alerts.cancelButton + '" id="' + __IDS.Cancel + '" /></div>');
                    //$("#popup_message").after('<div id="popup_panel"><input type="button" value="' + $.alerts.okButton +
                    //    '" id="popup_ok" /> <input type="button" value="' + $.alerts.cancelButton + '" id="popup_cancel" /></div>');
                    //end of Ramin's
                    $("#" + __IDS.OK).click(function () {
                        $.alerts._hide(__IDS);
                        if (callback) callback(true);
                    });
                    $("#" + __IDS.Cancel).click(function () {
                        $.alerts._hide(__IDS);
                        if (callback) callback(false);
                    });
                    $("#" + __IDS.OK).focus();
                    $("#" + __IDS.OK + ", #" + __IDS.Cancel).keypress(function (e) {
                        if (e.keyCode == 13) $("#" + __IDS.OK).trigger('click');
                        if (e.keyCode == 27) $("#" + __IDS.Cancel).trigger('click');
                    });
                    break;
            }

            // Make draggable
            if ($.alerts.draggable) {
                try {
                    $("#" + __IDS.Container).draggable({ handle: $("#" + __IDS.Title) });
                    $("#" + __IDS.Title).css({ cursor: 'move' });
                } catch (e) { /* requires jQuery UI draggables */ }
            }

            return __IDS;
        },

        _hide: function (IDS) {
            $("#" + IDS.Container).remove();
            $.alerts._overlay('hide', null, IDS);
            $.alerts._maintainPosition(false, IDS);
        },

        _overlay: function (status, zindex, IDS) {
            switch (status) {
                case 'show':
                    $.alerts._overlay('hide', null, IDS);
                    $("BODY").append('<div id="' + IDS.Overlay + '"></div>');
                    $("#" + IDS.Overlay).css({
                        position: 'fixed',
                        zIndex: zindex,
                        top: '0px',
                        left: '0px',
                        bottom: '0px',
                        right: '0px',
                        width: '100%',
                        margin: 'auto',
                        background: $.alerts.overlayColor,
                        opacity: $.alerts.overlayOpacity
                    });
                    break;
                case 'hide':
                    $("#" + IDS.Overlay).remove();
                    break;
            }
        },

        _reposition: function (IDS) {
            var top = (($(window).height() / 2) - ($("#" + IDS.Container).outerHeight() / 2)) + $.alerts.verticalOffset;
            var left = (($(window).width() / 2) - ($("#" + IDS.Container).outerWidth() / 2)) + $.alerts.horizontalOffset;
            if (top < 0) top = 0;
            if (left < 0) left = 0;

            // IE6 fix
            if ($.browser.msie && parseInt($.browser.version) <= 6) top = top + $(window).scrollTop();

            $("#" + IDS.Container).css({
                top: top + 'px',
                left: left + 'px'
            });
            $("#" + IDS.Overlay).height($(document).height());
        },

        _maintainPosition: function (status, IDS) {
            var _repos = function () { $.alerts._reposition(IDS); }

            if ($.alerts.repositionOnResize) {
                switch (status) {
                    case true:
                        $(window).bind('resize', _repos);
                        break;
                    case false:
                        $(window).unbind('resize', _repos);
                        break;
                }
            }
        }

    }

    // Shortuct functions
    //Ramin's
    jAlert = function (message, title, callback, params) { $.alerts.alert(message, title, callback, params); }
    //jAlert = function (message, title, callback) { $.alerts.alert(message, title, callback); }

    jDialog = function (_div, title, params) { return $.alerts.dialog(_div, title, params); }
    //end of Ramin's

    jConfirm = function (message, title, callback) {
        $.alerts.confirm(message, title, callback);
    };

})(jQuery);