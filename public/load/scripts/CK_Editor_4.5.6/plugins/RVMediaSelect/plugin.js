CKEDITOR.plugins.add('RVMediaSelect',
{
    init: function (editor) {
        var commandFunction = function () { }
        
        editor.addCommand('RVMediaSelectCommand', { exec: commandFunction });

        editor.ui.addButton('RVMediaSelect',
        {
            label: 'انتخاب فایل چند رسانه ای',
            command: 'RVMediaSelectCommand',
            icon: this.path + 'images/media.png'
        });
    }
});