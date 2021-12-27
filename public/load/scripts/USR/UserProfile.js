(function () {
    if (window.UserProfile) return;

    window.UserProfile = function (containerDiv, params) {
        this.ContainerDiv = typeof (containerDiv) == "object" ? containerDiv : document.getElementById(containerDiv);
        if (!this.ContainerDiv) return;
        params = params || {};

        this.Interface = {
            NameArea: null,
            JobArea: null,
            BirthdayArea: null,
            NumbersArea: null,
            EmailsArea: null,
            NewNumberArea: null,
            NewEmailArea: null,
            EmailsContainer: null,
            NumbersContainer: null,
            Editable: false
        };

        this.Objects = {
            UserID: params.UserID,
            CurrentUserID: params.CurrentUserID,
            IsSystemAdmin: params.IsSystemAdmin === true,
            MainPhoneID: null,
            MainEmailID: null,
            PhoneNumberTypes: []
        };

        var that = this;

        //init Phone Number Types
        that.Objects.PhoneNumberTypes = [{ Type: "option", Style: "color:gray; ", Childs: [{ Type: "text", TextValue: RVDic.OfType + "..." }] }];

        for (var i = 0; i < (params.PhoneNumberTypes || []).length; i++) {
            that.Objects.PhoneNumberTypes.push({
                Type: "option",
                Properties: [{ Name: "title", Value: params.PhoneNumberTypes[i] }],
                Childs: [{ Type: "text", TextValue: RVDic[params.PhoneNumberTypes[i]] || params.PhoneNumberTypes[i] }]
            });
        }
        //end of init Phone Number Types

        GlobalUtilities.load_files([{ Root: "API/", Ext: "js", Childs: ["UsersAPI", "DocsAPI"] }], {
            OnLoad: function () { that._initialize(); }
        });
    }

    UserProfile.prototype = {
        _initialize: function () {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 row", Style: "margin:0rem;",
                            Childs: [
                                {
                                    Type: "div", Class: "small-12 medium-6 large-4",
                                    Style: "padding:0rem 0.5rem; margin-bottom:0.3rem;",
                                    Childs: [
                                        {
                                            Type: "div", Name: "firstAndLastName", 
                                            Class: "small-12 medium-12 large-12 rv-border-radius-quarter SoftBackgroundColor",
                                            Style: "padding:0.3rem 0.5rem; height:100%; position:relative;"
                                        }
                                    ]
                                },
                                {
                                    Type: "div", Class: "small-12 medium-6 large-4",
                                    Style: "padding:0rem 0.5rem; margin-bottom:0.3rem;",
                                    Childs: [
                                        {
                                            Type: "div", Name: "birthday",
                                            Class: "small-12 medium-12 large-12 rv-border-radius-quarter SoftBackgroundColor",
                                            Style: "padding:0.3rem 0.5rem; height:100%; position:relative;"
                                        }
                                    ]
                                },
                                {
                                    Type: "div", Class: "small-12 medium-6 large-4",
                                    Style: "padding:0rem 0.5rem; margin-bottom:0.3rem;",
                                    Childs: [
                                        {
                                            Type: "div", Name: "jobTitle",
                                            Class: "small-12 medium-12 large-12 rv-border-radius-quarter SoftBackgroundColor",
                                            Style: "padding:0.3rem 0.5rem; height:100%; position:relative;"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12 row", Style: "margin:0rem; margin-top:1rem;",
                            Childs: [
                                {
                                    Type: "div", Class: "small-12 medium-6 large-6",
                                    Style: "padding:0rem 0.5rem; margin-bottom:0.3rem;", Name: "numbersContainer",
                                    Childs: [
                                        {
                                            Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-half WarmBackgroundColor",
                                            Style: "margin-bottom:0.5rem; color:white; font-size:0.6rem; font-weight:bold;" + 
                                                "text-align:center; padding:0.3rem 0rem;",
                                            Childs: [{ Type: "text", TextValue: RVDic.PhoneNumber }]
                                        },
                                        {
                                            Type: "div", Name: "addPhoneNumber", Style: "padding:0.3rem;",
                                            Class: "small-12 medium-12 large-12 rv-border-radius-quarter SoftBackgroundColor"
                                        },
                                        {
                                            Type: "div", Class: "small-12 medium-12 large-12",
                                            Style: "margin-top:0.5rem;", Name: "phoneNumbers"
                                        }
                                    ]
                                },
                                {
                                    Type: "div", Class: "small-12 medium-6 large-6",
                                    Style: "padding:0rem 0.5rem; margin-bottom:0.3rem;", Name: "emailsContainer",
                                    Childs: [
                                        {
                                            Type: "div", Class: "small-12 medium-12 large-12 rv-border-radius-half WarmBackgroundColor",
                                            Style: "margin-bottom:0.5rem; color:white; font-size:0.6rem; font-weight:bold;" +
                                                "text-align:center; padding:0.3rem 0rem;",
                                            Childs: [{ Type: "text", TextValue: RVDic.Email }]
                                        },
                                        {
                                            Type: "div", Name: "addEmailAddress", Style: "padding:0.3rem;",
                                            Class: "small-12 medium-12 large-12 rv-border-radius-quarter SoftBackgroundColor"
                                        },
                                        {
                                            Type: "div", Class: "small-12 medium-12 large-12",
                                            Style: "margin-top:0.5rem;", Name: "emails"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ], that.ContainerDiv);

            that.Interface.NameArea = elems["firstAndLastName"];
            that.Interface.JobArea = elems["jobTitle"];
            that.Interface.BirthdayArea = elems["birthday"];
            that.Interface.NumbersArea = elems["phoneNumbers"];
            that.Interface.EmailsArea = elems["emails"];
            that.Interface.NewNumberArea = elems["addPhoneNumber"];
            that.Interface.NewEmailArea = elems["addEmailAddress"];
            that.Interface.EmailsContainer = elems["emailsContainer"];
            that.Interface.NumbersContainer = elems["numbersContainer"];

            that.create_new_phone_number_area();
            that.create_new_email_area();

            that.reset();
        },

        reset: function (userId) {
            var that = this;

            if (that.Objects.UserID && (that.Objects.UserID == userId)) return;
            that.Objects.UserID = userId || that.Objects.UserID;

            that.Objects.Editable = that.Objects.IsSystemAdmin === true ||
                (String(that.Objects.CurrentUserID || "").toLowerCase() == String(that.Objects.UserID || "").toLowerCase());

            that.Objects.MainPhoneID = null;
            that.Objects.MainEmailID = null;

            that.Interface.NameArea.innerHTML = "";
            that.Interface.JobArea.innerHTML = "";
            that.Interface.BirthdayArea.innerHTML = "";
            that.Interface.NumbersArea.innerHTML = "";
            that.Interface.EmailsArea.innerHTML = "";

            that.Interface.NewNumberArea.style.display = that.Objects.Editable ? "block" : "none";
            that.Interface.NewEmailArea.style.display = that.Objects.Editable ? "block" : "none";

            GlobalUtilities.block(that.ContainerDiv);

            UsersAPI.GetUser({
                UserID: that.Objects.UserID, GetPhoneNumbers: true, GetEmails: true,
                ResponseHandler: function (responseText) {
                    var user = JSON.parse(responseText);

                    that.Objects.MainPhoneID = user.MainPhoneID || "";
                    that.Objects.MainEmailID = user.MainEmailID || "";

                    that.set_first_and_last_name(that.Interface.NameArea, user);
                    that.set_job_title(that.Interface.JobArea, user);
                    that.set_birthday(that.Interface.BirthdayArea, user);

                    that.Interface.NumbersContainer.style.display = (user.PhoneNumbers || []).length == 0 && !that.Objects.Editable ? "none" : "block";
                    that.Interface.EmailsContainer.style.display = (user.Emails || []).length == 0 && !that.Objects.Editable ? "none" : "block";

                    for (var i = 0, lnt = (user.PhoneNumbers || []).length; i < lnt; ++i)
                        that.set_phone_number(user.PhoneNumbers[i]);

                    for (var i = 0, lnt = (user.Emails || []).length; i < lnt; ++i)
                        that.set_email(user.Emails[i]);

                    GlobalUtilities.unblock(that.ContainerDiv);
                }
            });
        },

        set_first_and_last_name: function (container, params) {
            params = params || {};
            var that = this;

            var editable = that.Objects.Editable === true;

            var firstName = Base64.decode(params.FirstName || "");
            var lastName = Base64.decode(params.LastName || "");

            if (editable) container.style[RV_RTL ? "paddingRight" : "paddingLeft"] = "2rem";

            var _el = GlobalUtilities.create_nested_elements([
                {
                    Type: "div",
                    Style: "position:absolute; top:0.4rem;" + RV_Float + ":0.5rem;" + (editable ? "" : "display:none;"),
                    Childs: [
                        {
                            Type: "i", Class: "fa fa-pencil fa-lg rv-icon-button", Name: "editButton", Tooltip: RVDic.Edit,
                            Attributes: [{ Name: "aria-hidden", Value: true }]
                        }
                    ]
                },
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "viewArea", Style: "font-weight:bold;" },
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Name: "editArea", Style: "display:none;",
                    Childs: [
                        {
                            Type: "div", Class: "small-12 medium-12 large-12", Style: "margin-bottom:0.3rem;",
                            Childs: [
                                {
                                    Type: "input", Class: "rv-input", Name: "firstNameInput", Tooltip: RVDic.FirstName,
                                    Style: "width:100%; font-size:0.7rem;", InnerTitle: RVDic.FirstName
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-12 medium-12 large-12",
                            Childs: [
                                {
                                    Type: "input", Class: "rv-input", Name: "lastNameInput", Tooltip: RVDic.LastName,
                                    Style: "width:100%; font-size:0.7rem;", InnerTitle: RVDic.LastName
                                }
                            ]
                        }
                    ]
                }
            ], container);

            var viewArea = _el["viewArea"];
            var editArea = _el["editArea"];
            var firstNameInput = _el["firstNameInput"];
            var lastNameInput = _el["lastNameInput"];

            var editButton = _el["editButton"];

            var _set_data = function () {
                var fullname = GlobalUtilities.trim(firstName + " " + lastName);

                GlobalUtilities.set_text(viewArea, fullname || RVDic.NotSet);

                firstNameInput.value = firstName;
                lastNameInput.value = lastName;
            };

            _set_data();

            var _on_edit = function () {
                if (!editable) return;

                var set_things = function () {
                    editArea.style.display = editButton.__Editing ? "block" : "none";
                    viewArea.style.display = editButton.__Editing ? "none" : "block";

                    GlobalUtilities.append_tooltip(editButton, editButton.__Editing ? RVDic.Save : RVDic.Edit);

                    _set_data();

                    editButton.setAttribute("class", "fa fa-lg rv-icon-button " +
                        (editButton.__Editing ? "fa-floppy-o" : "fa-pencil"));
                };

                if (editButton.__Editing === true) {
                    var newFirstName = GlobalUtilities.trim(firstNameInput.value);
                    var newLastName = GlobalUtilities.trim(lastNameInput.value);

                    if (!newFirstName || !newLastName) return alert(RVDic.Checks.FirstAndLastNameCannotBeEmpty);

                    GlobalUtilities.block(container);

                    UsersAPI.SetFirstAndLastName({
                        FirstName: Base64.encode(newFirstName), LastName: Base64.encode(newLastName),
                        UserID: that.Objects.UserID, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText)
                                alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else {
                                firstName = Base64.decode(result.FirstName);
                                lastName = Base64.decode(result.LastName);
                                editButton.__Editing = false;
                                set_things();
                            }

                            GlobalUtilities.unblock(container);
                        }
                    });
                }
                else editButton.__Editing = true;

                set_things();
            } //end of _on_edit

            editButton.onclick = _on_edit;

            if (editable && (!firstName || !lastName)) _on_edit();
            _set_data();
        },

        set_birthday: function (container, params) {
            params = params || {};
            var that = this;

            var editable = that.Objects.Editable === true;
            var birthday = GlobalUtilities.convert_numbers_to_persian(params.Birthday);

            if (editable) container.style[RV_RTL ? "paddingRight" : "paddingLeft"] = "2rem";

            var _el = GlobalUtilities.create_nested_elements([
                {
                    Type: "div",
                    Style: "position:absolute; top:0.4rem;" + RV_Float + ":0.5rem;" + (editable ? "" : "display:none;"),
                    Childs: [{
                        Type: "i", Class: "fa fa-pencil fa-lg rv-icon-button", Name: "editButton", Tooltip: RVDic.Edit,
                        Attributes: [{ Name: "aria-hidden", Value: true }]
                    }]
                },
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "viewArea" },
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "editArea", Style: "display:none;" }
            ], container);

            var viewArea = _el["viewArea"];
            var editArea = _el["editArea"];
            var editButton = _el["editButton"];

            var dateSelect;

            var _set_data = function () {
                viewArea.innerHTML = "<span>" + RVDic.Birthdate + ":</span><span style='font-weight:bold;" +
                    "margin-" + RV_Float + ":0.5rem;'>" + (birthday || RVDic.NotSet) + "</span>";

                if (dateSelect) dateSelect.Set({ Value: null, Label: !birthday ? null : birthday });
            };

            _set_data();

            var _on_edit = function () {
                if (!editable || !dateSelect) return;

                var set_things = function () {

                    editArea.style.display = editButton.__Editing ? "block" : "none";
                    viewArea.style.display = editButton.__Editing ? "none" : "block";

                    GlobalUtilities.append_tooltip(editButton, editButton.__Editing ? RVDic.Save : RVDic.Edit);

                    _set_data();

                    editButton.setAttribute("class", "fa fa-lg rv-icon-button " +
                        (editButton.__Editing ? "fa-floppy-o" : "fa-pencil"));
                }

                if (editButton.__Editing === true) {
                    var bd = dateSelect ? dateSelect.Get() : {};

                    var newBirthday = bd.Value;
                    var newBdView = GlobalUtilities.convert_numbers_to_persian(bd.Label);

                    var done = function () {
                        birthday = !newBirthday ? birthday : newBdView;
                        editButton.__Editing = false;
                        set_things();
                    }

                    if (!newBirthday) return done();

                    GlobalUtilities.block(container);

                    UsersAPI.SetBirthday({
                        Birthday: newBirthday, UserID: that.Objects.UserID, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else done();

                            GlobalUtilities.unblock(container);
                        }
                    });
                }
                else editButton.__Editing = true;

                set_things();
            } //end of _on_edit

            editButton.onclick = _on_edit;

            GlobalUtilities.append_calendar(_el["editArea"], { Label: RVDic.Birthdate }, function (p) {
                dateSelect = p;

                if (editable && !birthday) _on_edit();
                _set_data();
            });
        },

        set_job_title: function (container, params) {
            params = params || {};
            var that = this;

            var editable = that.Objects.Editable === true;
            var jobTitle = Base64.decode(params.JobTitle || "");

            if (editable) container.style[RV_RTL ? "paddingRight" : "paddingLeft"] = "2rem";

            var _el = GlobalUtilities.create_nested_elements([
                {
                    Type: "div",
                    Style: "position:absolute; top:0.4rem;" + RV_Float + ":0.5rem;" + (editable ? "" : "display:none;"),
                    Childs: [
                        {
                            Type: "i", Class: "fa fa-pencil fa-lg rv-icon-button", Name: "editButton", Tooltip: RVDic.Edit,
                            Attributes: [{ Name: "aria-hidden", Value: true }]
                        }
                    ]
                },
                { Type: "div", Class: "small-12 medium-12 large-12", Name: "viewArea" },
                {
                    Type: "div", Class: "small-12 medium-12 large-12", Name: "editArea", Style: "display:none;",
                    Childs: [
                        {
                            Type: "input", Class: "rv-input", Name: "jobTitleInput",
                            Style: "width:100%; font-size:0.7rem;", InnerTitle: RVDic.JobTitle
                        }
                    ]
                }
            ], container);

            var viewArea = _el["viewArea"];
            var editArea = _el["editArea"];
            var jobTitleInput = _el["jobTitleInput"];

            var editButton = _el["editButton"];

            var _set_data = function () {
                viewArea.innerHTML = "";

                GlobalUtilities.create_nested_elements([
                    { Type: "span", Childs: [{ Type: "text", TextValue: RVDic.JobTitle + ":" }] },
                    {
                        Type: "span", Style: "font-weight:bold; margin-" + RV_Float + ":0.5rem;",
                        Childs: [{ Type: "text", TextValue: jobTitle || RVDic.NotSet }]
                    }
                ], viewArea);

                jobTitleInput.value = jobTitle;
            };

            _set_data();

            var _on_edit = function () {
                if (!editable) return;

                var set_things = function () {
                    editArea.style.display = editButton.__Editing ? "block" : "none";
                    viewArea.style.display = editButton.__Editing ? "none" : "block";

                    GlobalUtilities.append_tooltip(editButton, editButton.__Editing ? RVDic.Save : RVDic.Edit);

                    _set_data();

                    editButton.setAttribute("class", "fa fa-lg rv-icon-button " +
                        (editButton.__Editing ? "fa-floppy-o" : "fa-pencil"));
                }
                if (editButton.__Editing === true) {
                    var newJobTitle = GlobalUtilities.trim(jobTitleInput.value);

                    if (!newJobTitle) return alert(RVDic.Checks.JobTitleCannotBeEmpty);

                    GlobalUtilities.block(container);

                    UsersAPI.SetJobTitle({
                        JobTitle: Base64.encode(newJobTitle), UserID: that.Objects.UserID, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText)
                                alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else {
                                jobTitle = Base64.decode(result.JobTitle);
                                editButton.__Editing = false;
                                set_things();
                            }

                            GlobalUtilities.unblock(container);
                        }
                    });
                }
                else editButton.__Editing = true;

                set_things();
            } //end of _on_edit

            editButton.onclick = _on_edit;

            if (editable && !jobTitle) _on_edit();
            _set_data();
        },

        set_phone_number: function (phoneNumber) {
            phoneNumber = phoneNumber || {};
            var that = this;

            var editable = that.Objects.Editable === true;

            phoneNumber.Number = Base64.decode(phoneNumber.Number);

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Name: "itemDiv",
                    Class: "small-12 medium-12 large-12 row rv-border-radius-quarter SoftBackgroundColor",
                    Style: "padding:0.3rem 0.5rem; margin:0rem; margin-bottom:0.2rem; position:relative;" + 
                        (editable ? "padding-" + RV_Float + ":3.5rem;" : ""),
                    Childs: [
                        {
                            Type: "div",
                            Style: "position:absolute; top:0.3rem;" + RV_Float + ":0.5rem;" + (editable ? "" : "display:none;"),
                            Childs: [
                                {
                                    Type: "i", Class: "fa fa-times fa-lg rv-icon-button", Name: "deleteButton",
                                    Style: "margin-" + RV_RevFloat + ":0.5rem;", Tooltip: RVDic.Remove,
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                },
                                {
                                    Type: "i", Class: "fa fa-pencil fa-lg rv-icon-button", Name: "editButton",
                                    Tooltip: RVDic.Edit,
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-5 medium-5 large-5",
                            Childs: [
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12",
                                    Style: "color:black;", Name: "numberDiv",
                                    Childs: [{ Type: "text", TextValue: phoneNumber.Number }]
                                },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12",
                                    Style: "display:none;", Name: "editNumberDiv",
                                    Childs: [
                                        {
                                            Type: "input", Class: "rv-input", Name: "numberInput",
                                            Style: "width:100%; font-size:0.7rem;"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-5 medium-5 large-5", Style: "text-align:center;",
                            Childs: [
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12", Name: "typeTextDiv",
                                    Childs: [{ Type: "text", TextValue: RVDic[phoneNumber.Type] || phoneNumber.Type }]
                                },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12",
                                    Style: "padding-" + RV_Float + ":0.5rem; display:none;", Name: "editTypeDiv",
                                    Childs: [
                                        {
                                            Type: "select", Class: "rv-input", Name: "numberTypeSelect",
                                            Style: "width:100%; font-size:0.6rem;",
                                            Childs: that.Objects.PhoneNumberTypes
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-2 medium-2 large-2 RevDirection RevTextAlign",
                            Childs: [
                                {
                                    Type: "i", Name: "starButton",
                                    Class: "fa rv-icon-button " +
                                        (phoneNumber.NumberID == that.Objects.MainPhoneID ? "fa-star" : "fa-star-o"),
                                    Style: "display:" + (phoneNumber.NumberID == that.Objects.MainPhoneID ? "block" : "none") +
                                          "; cursor" + (editable ? "pointer" : "default") + "; margin-top:0.2rem;",
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                }
                            ]
                        }
                    ]
                }
            ]);

            var itemDiv = elems["itemDiv"];
            var editButton = elems["editButton"];
            var deleteButton = elems["deleteButton"];
            var numberDiv = elems["numberDiv"];
            var editNumberDiv = elems["editNumberDiv"];
            var editTypeDiv = elems["editTypeDiv"];
            var typeTextDiv = elems["typeTextDiv"];
            var phoneNumberTypeSelect = elems["numberTypeSelect"];
            var starButton = elems["starButton"];
            var numberInput = elems["numberInput"];

            that.Interface.NumbersArea.insertBefore(itemDiv, that.Interface.NumbersArea.firstChild);

            if (editable) {
                itemDiv.onmouseover = function () { if (phoneNumber.Type == "Mobile") starButton.style.display = "block"; }
                itemDiv.onmouseout = function () { if (phoneNumber.NumberID != that.Objects.MainPhoneID) starButton.style.display = "none"; }
            }

            phoneNumberTypeSelect.selectedIndex = 0;

            for (var i = 0, lnt = phoneNumberTypeSelect.options.length; i < lnt; i++) {
                if (phoneNumberTypeSelect[i].title == phoneNumber.Type) {
                    phoneNumberTypeSelect.selectedIndex = i;
                    typeTextDiv.innerHTML = RVDic[phoneNumber.Type] || phoneNumber.Type;
                    break;
                }
            }

            editButton.onclick = function () {
                if (!editable) return;

                var set_things = function () {
                    GlobalUtilities.set_text(numberDiv, GlobalUtilities.convert_numbers_to_persian(phoneNumber.Number));
                    numberInput.value = phoneNumber.Number;
                    typeTextDiv.innerHTML = RVDic[phoneNumber.Type] || phoneNumber.Type;

                    typeTextDiv.style.display = editButton.__Editing ? "none" : "block";
                    editTypeDiv.style.display = editButton.__Editing ? "block" : "none";

                    numberDiv.style.display = editButton.__Editing ? "none" : "block";
                    editNumberDiv.style.display = editButton.__Editing ? "block" : "none";

                    GlobalUtilities.append_tooltip(editButton, editButton.__Editing ? RVDic.Save : RVDic.Edit);

                    editButton.setAttribute("class", "fa fa-lg rv-icon-button " +
                        (editButton.__Editing ? "fa-floppy-o" : "fa-pencil"));
                }

                if (editButton.__Editing === true) {
                    var newNumber = GlobalUtilities.trim(numberInput.value);
                    var newPhoneType = phoneNumberTypeSelect[phoneNumberTypeSelect.selectedIndex].title;

                    if (!newNumber) return alert(RVDic.Checks.PhoneNumberIsNotValid);

                    if (phoneNumberTypeSelect.selectedIndex <= 0) return alert(RVDic.Checks.PleaseSelectPhoneType);

                    GlobalUtilities.block(itemDiv);

                    UsersAPI.EditPhoneNumber({
                        NumberID: phoneNumber.NumberID, PhoneNumber: newNumber,
                        PhoneNumberType: newPhoneType, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText)
                                alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else {
                                phoneNumber.Type = newPhoneType;
                                phoneNumber.Number = Base64.decode(result.PhoneNumber);
                                editButton.__Editing = false;
                                set_things();
                            }

                            GlobalUtilities.unblock(itemDiv);
                        }
                    });
                }
                else editButton.__Editing = true;

                set_things();
            }

            deleteButton.onclick = function () {
                if (!editable) return;

                GlobalUtilities.confirm(RVDic.Confirms.DoYouWantToRemovePhoneNumber, function (result) {
                    if (!result) return;

                    GlobalUtilities.block(itemDiv);

                    UsersAPI.RemovePhoneNumber({
                        NumberID: phoneNumber.NumberID, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else jQuery(itemDiv).animate({ height: "toggle" }, 500, function () { this.remove(); });

                            GlobalUtilities.unblock(itemDiv);
                        }
                    });
                });
            };

            starButton.onclick = function () {
                if (!editable) return;

                GlobalUtilities.block(itemDiv);

                var response_handler = function (result) {
                    if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                    else if (result.Succeed) {
                        (that.__UncheckDuny[that.Objects.MainPhoneID] || function () { })();
                        that.Objects.MainPhoneID = phoneNumber.NumberID;
                        starButton.style.display = "block";
                        starButton.setAttribute("class", "fa fa-star rv-icon-button");
                    }
                };

                UsersAPI.SetMainPhone({
                    NumberID: phoneNumber.NumberID, UserID: that.Objects.UserID, ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.VerificationCode) {
                            that.verify_email_sms(result.VerificationCode, {
                                APIFunction: "SetMainPhone",
                                Data: { NumberID: phoneNumber.NumberID, UserID: that.Objects.UserID }
                            }, function (r) { response_handler(r); });
                        }
                        else response_handler(result);

                        GlobalUtilities.unblock(itemDiv);
                    }
                });
            };

            that.__UncheckDuny = that.__UncheckDuny || {};

            that.__UncheckDuny[phoneNumber.NumberID] = function () {
                starButton.style.display = "none";
                starButton.setAttribute("class", "fa fa-star-o rv-icon-button");
            };
        },

        create_new_phone_number_area: function () {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12 row", Name: "addItemDiv", Style: "margin:0rem;",
                    Childs: [
                        {
                            Type: "div", Class: "small-5 medium-5 large-5",
                            Childs: [{
                                Type: "number", Class: "rv-input", Name: "numberInput",
                                Style: "width:100%; font-size:0.7rem;", InnerTitle: RVDic.NewPhoneNumber
                            }]
                        },
                        {
                            Type: "div", Class: "small-5 medium-5 large-5", Style: "padding:0rem 0.5rem;",
                            Childs: [{
                                Type: "select", Class: "rv-input", Name: "phoneTypeSelect",
                                Style: "width:100%; font-size:0.6rem;",
                                Childs: that.Objects.PhoneNumberTypes
                            }]
                        },
                        {
                            Type: "div", Class: "small-2 medium-2 large-2 ActionButton",
                            Style: "font-size:0.7rem; font-weight:bold;", Name: "addButton",
                            Childs: [{ Type: "text", TextValue: RVDic.Add }]
                        }
                    ]
                }
            ], that.Interface.NewNumberArea);

            var addItemDiv = elems["addItemDiv"];
            var addButton = elems["addButton"];
            var typeSelect = elems["phoneTypeSelect"];

            var addNumberInput = elems["numberInput"];

            addButton.onclick = function () {
                var newNumber = GlobalUtilities.trim(addNumberInput.value);
                var newPhoneType = typeSelect[typeSelect.selectedIndex].title;

                if (!newNumber || newNumber.length < 9)
                    return alert(RVDic.Checks.PhoneNumberIsNotValid);
                else if (typeSelect.selectedIndex <= 0) return alert(RVDic.Checks.PleaseSelectPhoneType);

                GlobalUtilities.block(addItemDiv);

                UsersAPI.SetPhoneNumber({
                    PhoneNumber: newNumber, PhoneNumberType: newPhoneType, UserID: that.Objects.UserID, ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.ErrorText)
                            alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                        else {
                            addNumberInput.value = "";
                            typeSelect.selectedIndex = 0;

                            that.set_phone_number({
                                NumberID: result.NumberID,
                                Number: result.PhoneNumber,
                                Type: newPhoneType
                            });
                        }

                        GlobalUtilities.unblock(addItemDiv);
                    }
                });
            }
        },

        set_email: function (email) {
            email = email || {};
            var that = this;

            var editable = that.Objects.Editable === true;

            email.Email = Base64.decode(email.Email || "");

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Name: "itemDiv",
                    Class: "small-12 medium-12 large-12 row rv-border-radius-quarter SoftBackgroundColor",
                    Style: "padding:0.3rem 0.5rem; margin:0rem; margin-bottom:0.2rem; position:relative;" +
                        (editable ? "padding-" + RV_Float + ":3.5rem;" : ""),
                    Properties: [
                        { Name: "onmouseover", Value: function () { if (editable) starButton.style.display = "block"; } },
                        { Name: "onmouseout", Value: function () { if (editable && email.EmailID != that.Objects.MainEmailID) starButton.style.display = "none"; } }
                    ],
                    Childs: [
                        {
                            Type: "div",
                            Style: "position:absolute; top:0.3rem;" + RV_Float + ":0.5rem;" + (editable ? "" : "display:none;"),
                            Childs: [
                                {
                                    Type: "i", Class: "fa fa-times fa-lg rv-icon-button", Name: "deleteButton",
                                    Style: "margin-" + RV_RevFloat + ":0.5rem;", Tooltip: RVDic.Remove,
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                },
                                {
                                    Type: "i", Class: "fa fa-pencil fa-lg rv-icon-button", Name: "editButton",
                                    Tooltip: RVDic.Edit,
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-10 medium-10 large-10",
                            Childs: [
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12",
                                    Style: "color:black;", Name: "addressTextDiv",
                                    Childs: [{ Type: "text", TextValue: email.Email }]
                                },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12",
                                    Style: "display:none;", Name: "editAddressDiv",
                                    Childs: [
                                        {
                                            Type: "input", Class: "rv-input", Name: "addressInput",
                                            Style: "width:100%; font-size:0.7rem;"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            Type: "div", Class: "small-2 medium-2 large-2 RevDirection RevTextAlign",
                            Childs: [
                                {
                                    Type: "i", Name: "starButton",
                                    Class: "fa rv-icon-button " +
                                        (email.EmailID == that.Objects.MainEmailID ? "fa-star" : "fa-star-o"),
                                    Style: "display:" + (email.EmailID == that.Objects.MainEmailID ? "block" : "none") +
                                          "; cursor" + (editable ? "pointer" : "default") + "; margin-top:0.2rem;",
                                    Attributes: [{ Name: "aria-hidden", Value: true }]
                                }
                            ]
                        }
                    ]
                }
            ]);

            var itemDiv = elems["itemDiv"];
            var editButton = elems["editButton"];
            var deleteButton = elems["deleteButton"];
            var addressTextDiv = elems["addressTextDiv"];
            var editAddressDiv = elems["editAddressDiv"];
            var addressInput = elems["addressInput"];
            var starButton = elems["starButton"];

            that.Interface.EmailsArea.insertBefore(itemDiv, that.Interface.EmailsArea.firstChild);

            editButton.onclick = function () {
                if (!editable) return;

                var set_things = function () {
                    GlobalUtilities.set_text(addressTextDiv, GlobalUtilities.convert_numbers_to_persian(email.Email));
                    addressInput.value = email.Email;

                    addressTextDiv.style.display = editButton.__Editing ? "none" : "block";
                    editAddressDiv.style.display = editButton.__Editing ? "block" : "none";

                    GlobalUtilities.append_tooltip(editButton, editButton.__Editing ? RVDic.Save : RVDic.Edit);

                    editButton.setAttribute("class", "fa fa-lg rv-icon-button " +
                        (editButton.__Editing ? "fa-floppy-o" : "fa-pencil"));
                };

                if (editButton.__Editing === true) {
                    var newAddress = GlobalUtilities.trim(addressInput.value);

                    var reg = new RegExp("[a-zA-Z0-9\._]+@[a-zA-Z0-9-]+\.[a-zA-Z]+");
                    var valid = reg.test(newAddress);

                    if (!newAddress || !valid) return alert(RVDic.Checks.EmailIsNotValid);
                    else if (newAddress.toLowerCase() == String(email.Email || "_").toLowerCase()) {
                        editButton.__Editing = false;
                        return set_things();
                    }

                    GlobalUtilities.block(itemDiv);

                    UsersAPI.EditEmailAddress({
                        EmailID: email.EmailID, Address: Base64.encode(newAddress), ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText)
                                alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else {
                                email.Email = Base64.decode(result.Address);
                                editButton.__Editing = false;
                                set_things();
                            }

                            GlobalUtilities.unblock(itemDiv);
                        }
                    });
                }
                else editButton.__Editing = true;

                set_things();
            }

            deleteButton.onclick = function () {
                if (!editable) return;

                GlobalUtilities.confirm(RVDic.Confirms.DoYouWantToRemoveEmail, function (result) {
                    if (!result) return;

                    GlobalUtilities.block(itemDiv);

                    UsersAPI.RemoveEmailAddress({
                        EmailID: email.EmailID, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else jQuery(itemDiv).animate({ height: "toggle" }, 500, function () { this.remove(); })

                            GlobalUtilities.unblock(itemDiv);
                        }
                    });
                });
            };

            starButton.onclick = function () {
                if (!editable) return;

                GlobalUtilities.block(itemDiv);

                var response_handler = function (result) {
                    if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                    else if (result.Succeed) {
                        (that.__UncheckDuny[that.Objects.MainEmailID] || function () { })();
                        that.Objects.MainEmailID = email.EmailID;
                        starButton.style.display = "block";
                        starButton.setAttribute("class", "fa fa-star rv-icon-button");
                    }
                };

                UsersAPI.SetMainEmail({
                    EmailID: email.EmailID, UserID: that.Objects.UserID, ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.VerificationCode) {
                            that.verify_email_sms(result.VerificationCode, {
                                APIFunction: "SetMainEmail",
                                Data: { EmailID: email.EmailID, UserID: that.Objects.UserID }
                            }, function (r) { response_handler(r); });
                        }
                        else response_handler(result);

                        GlobalUtilities.unblock(itemDiv);
                    }
                });
            };

            that.__UncheckDuny = that.__UncheckDuny || {};

            that.__UncheckDuny[email.EmailID] = function () {
                starButton.style.display = "none";
                starButton.setAttribute("class", "fa fa-star-o rv-icon-button");
            };
        },

        verify_email_sms: function (data, params, callback) {
            params = params || {};
            var that = this;

            GlobalUtilities.verification_code_dialog(data, {
                HideCancelButton: false,
                Callback: function (d, done) {
                    if (!d) return;

                    UsersAPI[params.APIFunction](GlobalUtilities.extend(params.Data || {}, {
                        Token: d.Token, Code: d.Code, ParseResults: true,
                        ResponseHandler: function (result) {
                            done(!!result.Succeed);
                            callback(result);
                        }
                    }));
                }
            });
        },

        create_new_email_area: function () {
            var that = this;

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12 row", Name: "addItemDiv", Style: "margin:0rem;",
                    Childs: [
                        {
                            Type: "div", Class: "small-10 medium-10 large-10", Style: "padding-" + RV_RevFloat + ":0.5rem;",
                            Childs: [{
                                Type: "input", Class: "rv-input", Name: "addressInput",
                                Style: "width:100%; font-size:0.7rem;", InnerTitle: RVDic.NewEmail
                            }]
                        },
                        {
                            Type: "div", Class: "small-2 medium-2 large-2 ActionButton",
                            Style: "font-size:0.7rem; font-weight:bold;", Name: "addButton",
                            Childs: [{ Type: "text", TextValue: RVDic.Add }]
                        }
                    ]
                }
            ], that.Interface.NewEmailArea);

            var addItemDiv = elems["addItemDiv"];
            var addButton = elems["addButton"];
            var addressInput = elems["addressInput"];

            addButton.onclick = function () {
                var newAddress = GlobalUtilities.trim(addressInput.value);

                var reg = new RegExp("[a-zA-Z0-9\._]+@[a-zA-Z0-9-]+\.[a-zA-Z]+");
                var valid = reg.test(newAddress);

                if (!newAddress || !valid) return alert(RVDic.Checks.EmailIsNotValid);

                GlobalUtilities.block(addItemDiv);

                UsersAPI.SetEmailAddress({
                    Address: Base64.encode(newAddress), UserID: that.Objects.UserID, ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.ErrorText)
                            alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                        else {
                            addressInput.value = "";
                            that.set_email({ EmailID: result.EmailID, Email: result.Address });
                        }

                        GlobalUtilities.unblock(addItemDiv);
                    }
                });
            }
        }
    }
})();