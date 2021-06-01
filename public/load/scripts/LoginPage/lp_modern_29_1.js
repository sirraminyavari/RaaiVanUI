(function () {
    if (window.lp_modern_29_1) return;

    window.lp_modern_29_1 = function (container, params, options) {
        this.Container = typeof (container) == "object" ? container : document.getElementById(container);
        if (!this.Container) return;
        params = params || {};

        this.Options = GlobalUtilities.extend({}, options || {});

        var quotes = {
            dalai_lama: {
                fullname: "دالای لاما",
                position: "رهبر مذهبی تبت",
                quotes: ["آنچه میدانید به دیگران نیز بگویید، این راهیست به جاودانگی."]
            },
            khashayar_jahanian: {
                fullname: "خشایار جهانیان",
                position: "متخصص و مدرس مدیریت دانش",
                quotes: [
                    "طلای زیر خاک بی ارزش است، دانش خود را به سازمان عرضه کنید تا ارزش پیدا کند..",
                    "شکست تبدیل به پیروزی می شود، اگر از آن یاد بگیریم.",
                    "دانش مثل باران است، تا نبارد حاصلخیزی و زندگی به همراه ندارد."
                ]
            },
            imam_ali: {
                fullname: "امام علی (ع)",
                position: "امام اول شیعیان",
                quotes: [
                    "دانش، چراغ عقل و چشمه فضیلت و برتری است.",
                    "علم گنج بزرگی است که با خرج کردن تمام نمی شود.",
                    "دانش همچون یک شکار فراری است که نگارش آن را به بند می آورد."
                ]
            },
            knofosius: {
                fullname: "کنفسیوس",
                position: "فیلسوف چینی",
                quotes: ["کم رنگ ترین مدادها از پررنگ ترین حافظه ها ماندگارتر است."]
            },
            fransis: {
                fullname: "فرانسیس بیکن",
                position: "فیلسوف انگلیسی قرن 16",
                quotes: ["دانش، قدرت است."]
            },
            deiv_snoden: {
                fullname: "دیو اسنودن",
                position: "مشاور مدیریت ولش",
                quotes: ["تنها زمانی از وجود دانش ضمنی خود آگاه می شویم که به آن نیاز داشته باشیم."]
            },
            leo_pelet: {
                fullname: "لئو پلت",
                position: "مدیر عامل اسبق HP",
                quotes: ["اگر شرکت HP می دانست که شرکت HP چه می‌داند، شرکت ما سه برابر بهره وری بیشتری داشت."]
            },
            bob_bakman: {
                fullname: "باب باکمن",
                position: "مشاور و محقق مدیریت دانش",
                quotes: ["ترسی از به اشتراک گذاری آنچه میدانید نداشته باشید، به خاطر اینکه شما بهتر از هر کس دیگری آن  را میدانید."]
            },
            soqrat: {
                fullname: "سقراط",
                position: "فیلسوف یونانی",
                quotes: ["خردمند واقعی آن کسی است که میداند چه چیزی نمیداند."]
            }
        };

        var arrQuotes = [];

        for (var name in quotes) {
            quotes[name].quotes.forEach(function (q) {
                arrQuotes.push({ name: name, fullname: quotes[name].fullname, position: quotes[name].position, quote: q });
            });
        }

        params.Quotes = arrQuotes;
        
        this.initialize(params);
    };

    lp_modern_29_1.prototype = {
        initialize: function (params) {
            params = params || {};
            var that = this;

            var index = !(params.Quotes || []).length ? -1 : GlobalUtilities.random(0, (params.Quotes || []).length - 1);
            var quote = index >= 0 ? params.Quotes[index] : null;
            
            var get_statistic_value = function (period, name) {
                var val = +((params.Statistics || {})[period] || {})[name];
                return !val || isNaN(val) ? 0 : val;
            };
            
            var get_statistics_ratio = function (name) {
                var first = get_statistic_value("PreviousMonth", name),
                    second = get_statistic_value("LastMonth", name);
                return !first ? "∞" : Number((((second / first) - 1) * 100).toFixed(0));
            };

            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-12 medium-12 large-12", Style: "display:flex; flex-flow:column; height:100%;",
                Childs: [
                    (!quote ? null : {
                        Type: "div", Class: "small-12 medium-12 large-12 row align-center",
                        Style: "display:flex; flex:0 0 auto; align-items:center; justify-content:center;" +
                            "margin:0rem; min-height:40vh; padding:0.5rem 0;",
                        Childs: [{
                            Type: "div", Class: "small-10 medium-7 large-4",
                            Childs: [
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12 RevTextAlign RevDirection",
                                    Childs: [{
                                        Type: "i", Style: "color:#bfbfbf;",
                                        Class: "fa " + (RV_RTL ? "fa-quote-left" : "fa-quote-right") + " fa-3x",
                                        Attributes: [{ Name: "aria-hidden", Value: true }]
                                    }]
                                },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12", Name: "message",
                                    Style: "margin-top:1.5rem; text-align:justify;"
                                },
                                {
                                    Type: "div", Style: "display:flex; flex-flow:row; justify-content:center; margin-top:1.5rem;",
                                    Childs: [
                                        {
                                            Type: "div", Style: "flex:0 0 auto; padding-" + RV_RevFloat + ":1rem;",
                                            Childs: [{
                                                Type: "img", Class: "rv-circle SoftBorder",
                                                Style: "width:3.5rem; height:3.5rem; border-width:2px; border-color:rgb(200,200,200);",
                                                Attributes: [{ Name: "src", Value: GlobalUtilities.icon("portraits/" + quote.name + ".png") }]
                                            }]
                                        },
                                        {
                                            Type: "div", Style: "display:flex; flex-flow:column; flex:0 0 auto; align-items:center;",
                                            Childs: [
                                                {
                                                    Type: "div", Style: "color:rgb(150,150,150); font-weight:bold; font-size:1rem;",
                                                    Childs: [{ Type: "text", TextValue: quote.fullname }]
                                                },
                                                (!quote.position ? null : {
                                                    Type: "div", Style: "font-size:0.8rem;",
                                                    Childs: [{ Type: "text", TextValue: quote.position }]
                                                })
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }]
                    }),
                    {
                        Type: "div", Class: "small-12 medium-12 large-12",
                        Style: "display:flex; flex:1 0 auto; align-items:center; text-align:center; padding:1rem 0;",
                        Childs: [{
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Childs: [
                                {
                                    Type: "div", Class: "rv-text-shadow", Style: "font-size:2rem; font-weight:200; color:rgb(100,100,100);",
                                    Childs: [{ Type: "text", TextValue: "در مغز سازمان چه می گذرد؟" }]
                                },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12 row", Style: "margin:0; margin-top:1.5rem;",
                                    Childs: [
                                        { Name: "NodesCount", Title: "دانش جدید", Icon: "write_color.png" },
                                        { Name: "SearchesCount", Title: "جستجوی دانش", Icon: "search_color.png" },
                                        { Name: "NodePageVisitsCount", Title: "مطالعه دانش", Icon: "eye_color.png" },
                                        { Name: "ActiveUsersCount", Title: "کاربر فعال", Icon: "user_color.png" }
                                    ].map(function (itm) {
                                        var count = get_statistic_value(itm.Name == "ActiveUsersCount" ? "LastMonth" : "Total", itm.Name);
                                        var rateOfChange = get_statistics_ratio(itm.Name);
                                        var isInfinity = rateOfChange == "∞";

                                        if (isInfinity || !rateOfChange || isNaN(rateOfChange)) rateOfChange = 0;

                                        return {
                                            Type: "div", Class: "small-12 medium-6 large-3", Style: "text-align:center;",
                                            Childs: [
                                                {
                                                    Type: "div", 
                                                    Childs: [{
                                                        Type: "img", Style: "width:3.5rem; height:3.5rem;",
                                                        Attributes: [{ Name: "src", Value: GlobalUtilities.icon(itm.Icon) }]
                                                    }]
                                                },
                                                {
                                                    Type: "div", Style: "margin-top:0.8rem; color:rgb(80,80,80); font-size:1.2rem;",
                                                    Childs: [{ Type: "text", TextValue: itm.Title }]
                                                },
                                                {
                                                    Type: "div", Style: "color:rgb(80,80,80); font-size:1.2rem;",
                                                    Childs: [{ Type: "text", TextValue: GlobalUtilities.get_comma_separated_number(count) }]
                                                },
                                                (isInfinity ? null : {
                                                    Type: "div",
                                                    Style: "margin-top:0.5rem; color:rgb(80,80,80); font-size:2.2rem; direction:ltr;" +
                                                        "color:" + (!rateOfChange ? "#707070" : (rateOfChange < 0 ? "#ef3238" : "#80c629")) + ";",
                                                    Childs: [{
                                                        Type: "text",
                                                        TextValue: (!rateOfChange ? "" : (rateOfChange < 0 ? "-" : "+")) + Math.abs(rateOfChange) + "%"
                                                    }]
                                                }),
                                            ]
                                        }
                                    })
                                }
                            ]
                        }]
                    }
                ]
            }], that.Container);

            if (elems["message"]) GlobalUtilities.append_markup_text(elems["message"], quote.quote);
        }
    };
})();