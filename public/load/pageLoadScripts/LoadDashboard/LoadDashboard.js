window.loadDashboard = () => {
    GlobalUtilities.loading("contentArea");

    GlobalUtilities.load_files(["Notifications/DashboardsCountViewer.js"], {
        OnLoad: function () { new DashboardsCountViewer("contentArea"); }
    });
};