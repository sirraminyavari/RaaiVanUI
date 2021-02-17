window.loadQaWorkFlow = () => {
    var tabsArea = document.getElementById("tabs");
    var wfArea = document.getElementById("wfArea");
    var faqArea = document.getElementById("faqArea");

    var tabs = [];

    var wfInited = false;
    var faqInited = false;

    tabs.push({
        Page: wfArea, Title: RVDic.WorkFlows, FixedPage: true,
        OnActive: function () {
            if (wfInited) return;
            wfInited = true;

            GlobalUtilities.loading(wfArea);

            GlobalUtilities.load_files(["QA/QAWorkFlows.js"], {
                OnLoad: function () { new QAWorkFlows(wfArea); }
            });
        }
    });

    tabs.push({
        Page: faqArea, Title: "FAQ", FixedPage: true,
        OnActive: function () {
            if (faqInited) return;
            faqInited = true;

            GlobalUtilities.loading(faqArea);

            GlobalUtilities.load_files(["QA/FAQAdmin.js"], {
                OnLoad: function () { new FAQAdmin(faqArea); }
            });
        }
    });

    GlobalUtilities.load_files(["TabsManager/TabsManager.js"], {
        OnLoad: function () {
            (new TabsManager({ ContainerDiv: tabsArea, Pages: tabs })).goto_page(0);
        }
    });
};