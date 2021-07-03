(function () {
    window.RVCheadget = window.RVCheadget || {};
    if (RVCheadget.ramin) return;

    var _desc = "رامین یاوری پس از گذراندن دوره دبیرستان، برای تحصیل در رشته مهندسی IT وارد دانشگاه صنعتی اصفهان شد. او از همان ابتدا به فعالیت های خاص و حرفه ای در حوزه نرم افزار علاقه ای وافر از خود نشان می داد و کارهای او باعث شگفتی اساتید و همکلاسی ها می شد. او همیشه پیشرفت خود را در گرو پیشرفته جامعه می دید و از همین جهت، به اشاعه اخلاق و تفکر حرفه ای علاقه ای بیش از فعالیت های مهندسی نشان می داد. به همین جهت مصمم شد تا تصمیمی را که پیش از ورود به رشته مهندسی IT گرفته بود، عملی سازد و آن ادامه تحصیل در رشته MBA بود. \nاو در آخرین سال از دوره لیسانس، با خشایار جهانیان آشنا شد. جهانیان، مردی بود که از سن 19 سالگی شرکت خود را تاسیس کرده بود و در حوزه مدیریت دانش فعالیت می کرد. این آشنایی سرآغاز فصل جدیدی در زندگی یاوری بود و آن، فرصت ایجاد یک تمدن سازمانی برای کمک به توسعه سایر سازمان ها بود و این همان چیزی بود که یاوری از دیر باز در پی آن بود. \nاو به سرعت به جنبه های گوناگون مدیریت دانش و نرم افزاری که جهانیان در حال توسعه آن بود، احاطه یافت و مدیریت توسعه نرم افزار را در دست گرفت و طی سه سال، با طراحی و پیاده سازی امکانات پیشرفته، آن را به قدرتمندترین نرم افزار مدیریت دانش در سطح کشور تبدیل نمود.";

    var ramin = function () {
        this.Interface = {
            Elements: []
        }

        var that = this;

        var elems = GlobalUtilities.create_nested_elements([
            { Type: "div", Name: "_div", Class: "SoftBackgroundColor",
                Style: "direction:rtl; position: fixed; z-index: " + GlobalUtilities.zindex.dialog() + "; padding: 0px; margin: 0px; font-family: tahoma; " +
                    "min-width: 500px; max-width:500px; width:500px; top: 0px; left: 395.5px; text-align:justify;" +
                    "border: 5px solid rgb(153, 153, 153); border-radius: 5px;",
                Childs: [
                    { Type: "div", Style: "padding:8px;",
                        Childs: [
                            { Type: "img", Style: "max-width:80px; max-height:60px; margin:4px 0px 4px 8px; float:right;",
                                Attributes: [{ Name: "src", Value: "../../Script/Cheadget/ramin/images/ramin.jpg"}] 
                            },
                            { Type: "div", Name: "_data" }
                        ]
                    }
                ]
            }
        ], document.body);

        that.ContainerDiv = elems["_div"];
        var dataDiv = elems["_data"];

        GlobalUtilities.append_markup_text(dataDiv, _desc);

        that.show();
    }

    ramin.prototype = {
        show: function () {
            var that = this;

            that.ContainerDiv.style.top = (($(window).height() / 2) - ($(that.ContainerDiv).outerHeight() / 2)) + "px";
            that.ContainerDiv.style.left = (($(window).width() / 2) - ($(that.ContainerDiv).outerWidth() / 2)) + "px";

            that.ContainerDiv.style.display = "block";
            that.ContainerDiv.zIndex = GlobalUtilities.zindex.dialog();

            GlobalUtilities.add_to_escape_queue(that.ContainerDiv, function () { that.ContainerDiv.style.display = "none"; });
        }
    }

    RVCheadget.ramin = new ramin();
})();