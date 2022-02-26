(function () {
    var RVHelp = {
        HLP: {
            systemsettings: {
                _title: "مدیریت سامانه",
                _permission: "Any",
                settings: {
                    _title: "تنظیمات",
                    _systemadmin: true
                },
                users: {
                    _title: "مدیریت کاربران",
                    _permission: "UsersManagement",
                    newuser: "ایجاد کاربر",
                    resetpassword: "بازنشانی گذرواژه",
                    activateusers: "فعال و غیرفعال کردن کاربران"
                },
                confidentialitylevels: {
                    _title: "سطوح محرمانگی",
                    _permission: "ManageConfidentialityLevels"
                },
                usergroups: {
                    _title: "مدیران سامانه",
                    _permission: "UserGroupsManagement"
                },
                map: {
                    _title: "پیکربندی نقشه",
                    _permission: "ManageOntology",
                    editclasses: "ویرایش کلاس ها",
                    general: "تنظیمات عمومی",
                    extensions: "افزونه ها",
                    servicesettings: "تنظیمات سرویس",
                    serviceadmins: "کاربران ویژه",
                    nodes: {
                        _title: "آیتم ها",
                        newnode: "افزودن آیتم جدید",
                        manynodesviaexcel: "ایجاد از طریق بارگذاری فایل اکسل",
                        edittree: "ویرایش درختی",
                        removednodes: "آیتم های حذف شده",
                        membersandexperts: "تعیین اعضا و خبرگان"
                    },
                    sets: "مجموعه ها",
                    pdftemplates: "الگوی جلد فایل های PDF"
                },
                evaluationprocesses: {
                    _title: "فرآیندهای ارزیابی دانش",
                    _module: "kw",
                    _permission: "KnowledgeAdmin",
                    questions: "پرسش های ارزیابی"
                },
                documenttrees: {
                    _title: "درخت های مستندات",
                    _module: "dct",
                    _permission: "ContentsManagement"
                },
                forms: {
                    _title: "فرم ها",
                    _module: "fg",
                    _permission: "ManageForms",
                    integration: "یکپارچه سازی",
                    textfield: "فیلد متنی",
                    datefield: "فیلد تاریخ",
                    selectfield: "فیلد چند گزینه ای (انتخاب یک از چند)",
                    checkboxfield: "فیلد جعبه انتخاب (انتخاب چند از چند)",
                    multilevelfield: "فیلد چند سطحی",
                    binaryfield: "فیلد دودویی",
                    numericfield: "فیلد عددی",
                    nodefield: "فیلد آیتم",
                    userfield: "فیلد کاربر",
                    filefield: "فیلد فایل",
                    formfield: "فیلد فرم",
                    separatorfield: "فیلد جدا کننده"
                },
                /*
                polls: {
                    _title: "نظرسنجی ها",
                    _module: "polls",
                    _permission: "ManagePolls"
                },
                workflows: {
                    _title: "جریان های کاری",
                    _module: "wf",
                    _permission: "ManageWorkflow"
                },
                qa: {
                    _title: "پرسش و پاسخ",
                    _module: "qa",
                    _permission: "ManageQA"
                },
                */
                dataimport: {
                    _title: "ورود اطلاعات از طریق XML",
                    _permission: "DataImport"
                },
                /*
                externalnotifications: {
                    _title: "پیام کوتاه و پست الکترونیکی",
                    _permission: "SMSEMailNotifier"
                },
                */
                edittree: "راهنمای ویرایش درخت"
            },
            homepage: "خانه",
            profile: {
                _title: "پروفایل",
                picture: "عکس پروفایل",
                coverphoto: { 
                    _title: "تصویر شاخص",
                    _module: "sh"
                }/*,
                resume: {
                    _title: "رزومه ",
                    _module: "resume",
                    identity: "شناسنامه",
                    jobs: "پیشینه شغلی",
                    education: "پیشینه آموزشی",
                    courses: "دوره های آموزشی",
                    honors: "جوایز و افتخارات",
                    languages: "زبان"
                },
                aboutme: "درباره من",
                social: {
                    _title: "اجتماعی",
                    _module: "sh"
                }
                */
            },
            personalsettings: {
                _title: "تنظیمات شخصی",
                theme: "پوسته (تم)",
                changepassword: "تغییر رمز عبور"
            },
            notificationcenter: {
                _title: "مرکز آگاه سازی",
                _module: "ntfn"
            },
            socialnetwork: {
                _title: "شبکه اجتماعی",
                _module: "sh",
                newpost: "ارسال مطلب",
                newcomment: "ارسال نظر",
                network: {
                    _title: "شبکه همکاران",
                    friendshiprequest: "ارسال درخواست همکاری"
                }
            },
            messaging: {
                _title: "پیام ها",
                _module: "msg",
                newmessage: "ارسال پیام جدید",
                forward: "بازفرست",
                remove: "حذف پیام"
            },
            chat: {
                _title: "گفتگوی برخط",
                _module: "chat"
            },
            dashboard: "کارتابل",
            search: "جستجو",
            explorer: {
                _title: "مرورگر",
                _module: "explorer"
            },
            searchusers: "جستجوی دانشکاران",
            listview: "جستجوی پیشرفته",
            /*
            qa: {
                _title: "پرسش و پاسخ",
                _module: "qa",
                newquestion: "ثبت پرسش جدید",
                categories: {
                    _title: "دسته ها",
                    relatedtome: "پرسش های مرتبط با من",
                    bookmarked: "پرسش های نشان شده",
                    myquestions: "پرسش های من"
                },
                all: "همه پرسش ها",
                mostusedtags: "پر استفاده ترین تگ ها",
                faq: "پرسش های متداول",
                questionpage: {
                    _title: "صفحه پرسش",
                    answers: "پاسخ ها",
                    comments: "نظرات",
                    feedbacks: "بازخوردها",
                    similarquestions: "پرسش های مشابه",
                    tags: "تگ ها"
                },
                tagpage: {
                    _title: "صفحه تگ",
                    similartags: "تگ های مشابه"
                }
            },
            */
            intellectualproperties: {
                _title: "مالکیت معنوی",
                register: "ثبت محتوا",
                nodepage: {
                    _title: "صفحه نمایش محتوا"/*,
                    feedbacks: "بازخوردها",
                    details: "جزییات",
                    contributors: "مشارکت کنندگان",
                    relatednodes: "آیتم های مرتبط",
                    abstract: "چکیده",
                    keywords: "کلمات کلیدی",
                    descfornoaccess: "شرح برای کسانی که دسترسی ندارند",
                    attachments: "فایل های پیوست",
                    content: "محتوا",
                    remove: "حذف"*/
                }
            },
            groups: "گروه ها",
            expertisedomains: "حوزه های خبرگی",
            favorites: "آیتم های مورد علاقه",
            newcontentsfrommynetwork: {
                _title: "تولیدات همکاران من",
                _module: "sh"
            },
            /*
            visualmap: {
                _title: "نقشه گرافیکی",
                _module: "visualmap"
            },
            poll: {
                _title: "نظرسنجی",
                _module: "fg"
            },
            */
            wiki: {
                _title: "دانشنامه",
                titles: {
                    _title: "سرفصل ها",
                    newtitle: "افزودن سرفصل",
                    editremove: "ویرایش و حذف سرفصل",
                    sort: "مرتب سازی سرفصل ها",
                    recover: "بازگردانی سرفصل های حذف شده"
                },
                paragraphs: {
                    _title: "پاراگراف ها",
                    newparagraph: "افزودن پاراگراف جدید",
                    edit: "ویرایش پاراگراف",
                    remove: "حذف پاراگراف",
                    sort: "مرتب سازی پاراگراف ها",
                    recover: "بازگردانی پاراگراف های حذف شده",
                    history: "تاریخچه ویرایش ها",
                    authors: "نویسندگان"
                },
                authorizedauthors: "نویسندگان معتبر",
                editsuggestions: "پیشنهاد ویرایش دانشنامه",
                export2pdf: "دریافت نسخه PDF"
            },
            /*
            forms: {
                _title: "فرم ها",
                _module: "fg",
                fieldtypes: {
                    _title: "انواع فیلدها",
                    text: "متنی",
                    date: "تاریخ",
                    number: "عددی",
                    checkbox: "جعبه انتخاب",
                    radio: "چند گزینه ای",
                    binary: "دودویی",
                    multilevel: "چند سطحی",
                    file: "فایل",
                    user: "کاربر",
                    node: "آیتم",
                    separator: "جداکننده"
                },
                edit: "ویرایش",
                formfilters: "فیلترهای فرم"
            },
            reports: {
                _title: "گزارشات",
                _permission: ""
            },
            */
            classes: "کلاس/کلاس ها",
            nodes: "آیتم/آیتم ها",
            tags: "تگ/برچسب",
            nodeselectdialog: "رابط کاربری انتخاب آیتم",
            userselectdialog: "رابط کاربری انتخاب کاربر",
            simpleeditor: "ویرایشگر ساده",
            advancededitor: "ویرایشگر حرفه ای",
            permissionsdialog: "رابط کاربری اعطای دسترسی",
            fileupload: "آپلود فایل"
        }
    };

    window.RVDic = window.RVDic || {};
    
    window.RVDic = GlobalUtilities.extend(window.RVDic, RVHelp);
})();