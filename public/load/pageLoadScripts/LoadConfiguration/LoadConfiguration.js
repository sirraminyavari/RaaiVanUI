window.loadConfiguration = () => {
    GlobalUtilities.load_files(["RVAdmin/AdminPanelInitializer.js"], {
        OnLoad: function () { new AdminPanelInitializer(document.getElementById("settingsArea")); }
    });
};