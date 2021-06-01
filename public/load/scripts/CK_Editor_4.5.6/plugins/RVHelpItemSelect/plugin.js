CKEDITOR.plugins.add('RVHelpItemSelect',
{
    init: function (editor) {
        var commandFunction = function () { }

        editor.addCommand('RVHelpItemSelectCommand', { exec: commandFunction });

        editor.ui.addButton('RVHelpItemSelect', {
            label: 'انتخاب سرفصل راهنما',
            command: 'RVHelpItemSelectCommand',
            icon: this.path + 'images/help.png'
        });
    }
});