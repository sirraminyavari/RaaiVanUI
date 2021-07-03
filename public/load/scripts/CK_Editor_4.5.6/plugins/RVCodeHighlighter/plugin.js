CKEDITOR.plugins.add('RVCodeHighlighter',
{
    init: function (editor) {
        var commandFunction = function () { }
        
        editor.addCommand('RVCodeHighlighterCommand', { exec: commandFunction });

        editor.ui.addButton('RVCodeHighlighter',
        {
            label: 'جعبه کد',
            command: 'RVCodeHighlighterCommand',
            icon: this.path + 'images/codesnippet.png'
        });
    }
});