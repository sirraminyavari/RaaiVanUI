(function () {
    if (window.RaaiVanHelpShowAll) return;

    window.RaaiVanHelpShowAll = function (container) {
        this.Container = typeof (container) == "object" ? container : document.getElementById(container);
        if (!this.Container) return;

        this.Objects = {
            CurrentContainer: this.Container
        };

        var that = this;

        GlobalUtilities.load_files(["RaaiVanHelp/HelpUtils.js"], { OnLoad: () => that.initialize() });

        //Remove all of the unnecessary dom elements
        var mainForm = document.getElementById("frmMainMaster");
        var mainContent = document.getElementById("masterContentSection");
        while ((mainForm || {}).nextSibling)
            mainForm.nextSibling.parentNode.removeChild(mainForm.nextSibling);
        if ((mainContent || {}).classList) mainContent.classList.remove("rv-content-section");
        //end of Remove all of the unnecessary dom elements
    }

    RaaiVanHelpShowAll.prototype = {
        initialize: function () {
            var that = this;

            that.Container.innerHTML = "";

            (HelpUtils.get_architecture || function () { return []; })()
                .forEach((entry, ind) => that.create_item(entry, [ind + 1]));
        },

        create_item: function (entry, counter) {
            var that = this

            var title = (HelpUtils.get_title || function (name) { return name; })(entry.Name);
            title = title[title.length - 1];

            var titleSize = 2.2 - (counter.length * 0.3);

            var counterTitle = [].concat(counter);
            if (RV_RTL) counterTitle.reverse();

            var sidePadding = (counter.length - 1) * 2;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "font-size:" + titleSize.toString() + "rem; font-weight:bold;" +
                        "padding-" + RV_Float + ":" + sidePadding + "rem;",
                    Childs: [{ Type: "text", TextValue: counterTitle.join("-") + ". " + title }]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Name: "content",
                    Style: "line-height:1.5rem; margin:1rem 0 4rem 0; padding-" + RV_Float + ":" + sidePadding + "rem;"
                },
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "nextContent" }
            ], that.Objects.CurrentContainer);

            that.Objects.CurrentContainer = elems["nextContent"];

            that.get_content(entry.Name, (content) => {
                GlobalUtilities.append_markup_text(elems["content"], content, {
                    Done: function () { GlobalUtilities.remove_empty_tags(elems["content"]); }
                })
            });

            (entry.Sub || []).forEach((s, ind) => that.create_item(s, counter.concat([ind + 1])));
        },

        get_content: function (name, done) {
            RVAPI.GetHelpIndexEntry({
                Name: Base64.encode(name), ParseResults: true,
                ResponseHandler: (r) => done(Base64.decode(((r || {}).Entry || {}).Content))
            });
        }
    }
})();