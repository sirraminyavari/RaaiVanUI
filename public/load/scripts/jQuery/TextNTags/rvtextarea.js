(function ($, _) {
    var KEY = { V: 86, Z: 90, BACKSPACE: 8, TAB: 9, RETURN: 13, ESC: 27, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, COMMA: 188, SPACE: 32, HOME: 36, END: 35, 'DELETE': 46 };
    
    var TextNTags = function (editor) {
        var templates = {
            wrapper: _.template('<div class="textntags-wrapper"></div>'),
            beautifier: _.template('<div class="textntags-beautifier"><div></div></div>')
        };

        var elContainer, elEditor, elBeautifier;
        var editorSelectionLength = 0;
        var editorInPasteMode = false;

        function initTextarea() {
            elEditor = $(editor).bind({
                keydown: onEditorKeyDown,
                keypress: (e) => { if (e.keyCode == KEY.RETURN) updateBeautifier(elEditor.val()); },
                keyup: onEditorKeyUp,
                input: () => updateBeautifier()
            });

            elContainer = elEditor.wrapAll($(templates.wrapper())).parent();
        }

        function initBeautifier() {
            elBeautifier = $(templates.beautifier());
            elBeautifier.prependTo(elContainer);
        }

        function initState(text) {
            elEditor.val(text || elEditor.val());
            updateBeautifier();
        }

        function updateBeautifier() {
            var beautifiedText = elEditor.val().replace(/</g, "&lt;")
                .replace(/\n/g, '<br />&shy;').replace(/ {2}/g, ' &nbsp;') + '&shy;';

            elBeautifier.find('div').html(beautifiedText);
            elEditor.css('height', elBeautifier.outerHeight() + 'px');
        }

        function onEditorKeyDown(e) {
            var sStart = elEditor[0].selectionStart, sEnd = elEditor[0].selectionEnd;
            
            editorSelectionLength = sEnd - sStart;

            if (e.ctrlKey) {
                if (e.keyCode == KEY.V) editorInPasteMode = true;
                else if (e.keyCode == KEY.Z) return false; // forbid undo
            }

            return true;
        }

        function onEditorKeyUp(e) {
            if (editorInPasteMode) {
                editorInPasteMode = false;

                if (editorSelectionLength > 0) return;

                updateBeautifier();
            }
        }

        // Public methods
        return {
            init: function () {
                initTextarea();
                initBeautifier();
                initState();
            },
            val: function (callback) {
                if (!elEditor) return;
                
                if (_.isString(callback)) initState(callback);
                else if (_.isFunction(callback)) callback.call(this, elEditor.val());

                return elEditor.val();
            },
            reset: function () {
                elEditor.val('');
                updateBeautifier();
            }
        };
    };

    $.fn.rvtextarea = function (methodOrSettings) {
        var outerArguments = arguments;
        
        return this.each(function () {
            var ms = methodOrSettings, instance = $.data(this, 'rvtextarea') || $.data(this, 'rvtextarea', new TextNTags(this));

            if (_.isFunction(instance[ms])) {
                return instance[ms].apply(this, Array.prototype.slice.call(outerArguments, 1));
            } else if (typeof ms === 'object' || !ms) {
                return instance.init.call(this, ms);
            } else {
                $.error('Method ' + ms + ' does not exist');
            }
        });
    };
})(jQuery, _);