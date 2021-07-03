(function () {
    if (window.CKE_RVCodeHighlighter) return;

    window.CKE_RVCodeHighlighter = function (containerDiv, params) {
        this.Container = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);

        if (!this.Container) return;
        params = params || {};

        this.Objects = { Editor: params.Editor || "" }

        var that = this;
        that._init();
    }

    CKE_RVCodeHighlighter.prototype = {
        _init: function () {
            var that = this;
            
            $(that.Container).on('click', '.cke_button__rvcodehighlighter', function (event) {
                var codeboxButton = this;

                that.Objects.Editor.insertHtml('<pre><code dir="ltr"> </code></pre></br> ');

                that.Objects.Editor.document.on('click', function (e) {
                    $(codeboxButton).removeClass("cke_button_on").addClass("cke_button_off");
                });
            });
        }
    }
})();
        