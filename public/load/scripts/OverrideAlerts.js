(function () {
    if (window.OverrideAlerts) return;
    window.OverrideAlerts = true;
    
    GlobalUtilities.load_files([{ Root: "jQuery/jAlerts/", Childs: ["jquery.alerts.css", "jquery.alerts.min.js"] }], {
        LoadSequential: false,
        OnLoad: function () {
            window._alert = window.alert;

            $.alerts.verticalOffset = 0;

            window.alert = function (message, params, callback) {
                params = params || {};
                if (params.Original === true) { _alert(message); return; }
                $.alerts.okButton = "تایید";

                var _msg = '<div style="text-align:center; direction:rtl; margin-right:35px; font-family:tahoma;">' +
                    message + '</div>';

                setTimeout(function () {
                    jAlert(_msg, '', callback, { Timeout: typeof (params.Timeout) == "undefined" ? 3000 : params.Timeout });
                }, 100);
            }

            GlobalUtilities.confirm = function (message, callback) {
                $.alerts.okButton = "بله";
                $.alerts.cancelButton = "خیر";
                jConfirm('<div style="text-align:center; direction:rtl; margin-right:35px; font-family:tahoma;">' + message + '</div>', '',
                    function (result) { if (callback) callback(result); });
            }

            GlobalUtilities.dialog = function (containerDiv, title, params) {
                var dlg = jDialog(containerDiv, title, params);
                return { Close: function () { $.alerts._hide(dlg); }, Refresh: function () { $.alerts._reposition(dlg); } }
            }
        }
    });
})();