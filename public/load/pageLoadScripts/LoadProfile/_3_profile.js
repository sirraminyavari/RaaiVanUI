(function () {
    var initialJson = JSON.parse(document.getElementById("initialJson").value);

    new PersonalPageInitializer({
        Modules: (window.RVGlobal || {}).Modules,
        ActiveTab: initialJson.ActiveTab,
        EmploymentTypes: initialJson.EmploymentTypes,
        PhoneNumberTypes: initialJson.PhoneNumberTypes
    });
})();