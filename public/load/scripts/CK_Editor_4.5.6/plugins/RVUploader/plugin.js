CKEDITOR.plugins.add('RVUploader',
{
    init: function (editor) {
        editor.ui.addButton('RVUploader',
        {
            label: 'پیوست کردن',
            icon: this.path + 'images/Upload20.png'
        });
    }
});