CKEDITOR.plugins.add('RVTag',
{
    init: function (editor) {
        var a = function () { }

        editor.addCommand('RVTagDialog', { exec: function (editor) { } });

        editor.ui.addButton('RVTag',
        {
            label: 'تگ زدن',
            command: 'RVTagDialog',
            icon: this.path + 'images/tag24.png'
        });
    }
});