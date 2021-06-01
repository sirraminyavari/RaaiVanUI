(function () {
    if (window.HelpUtils) return;

    var _HelpUtils = function () {};

    _HelpUtils.prototype = {
        get_title: function (name) {
            var parts = name.split("_");
            if (!(parts || []).length || !parts[0]) return name;
            
            var ind = 0;
            var entry = RVDic.HLP;
            var titleArr = [];

            for (var i = 0; i < parts.length; ++i) {
                entry = entry[parts[i]];
                if (!entry) return parts;
                titleArr.push(entry._title || entry);
            }

            return titleArr;
        },

        get_architecture: function (entryName) {
            var that = this;

            var retArr = [];
            
            if (entryName) return that._get_sub_architecture(entryName, { IncludeParent: true });

            var _add_entry = function (pureName, name, entry, arr) {
                if (!name || (name[0] == "_")) return;
                var obj = { PureName: pureName, Name: name };
                arr.push(obj);
                if (GlobalUtilities.get_type(entry) != "json") return;
                if (entry._module) obj.ModuleIdentifier = entry._module;
                if (entry._permission) obj.Permission = entry._permission;
                if (entry._systemadmin) obj.SystemAdmin = entry._systemadmin;
                for (var e in entry) {
                    if (e[0] != "_") {
                        obj.Sub = obj.Sub || [];
                        _add_entry(e, name + "_" + e, entry[e], obj.Sub);
                    }
                }
            };

            for (var e in RVDic.HLP)
                _add_entry(e, e, RVDic.HLP[e], retArr);

            return retArr;
        },

        _get_sub_architecture: function (name, options) {
            options = options || {};
            var that = this;

            if (name) name = name.toLowerCase();

            var arch = that.get_architecture();

            if (!name) return arch;

            var _locate = function (arr) {
                var item = (arr || []).filter(function (x) { return x.Name.toLowerCase() == name; });
                item = item.length ? item[0] : null;

                if (item) return item;

                for (var i = 0, lnt = (arr || []).length; i < lnt; ++i) {
                    item = !(arr[i].Sub || []).length ? null : _locate(arr[i].Sub);
                    if (item) return item;
                }

                return null;
            };

            var x = _locate(arch);

            if (options.IncludeParent) return !x ? [] : [x];
            else return (x || []).Sub || [];
        },

        get_sub_architecture: function (name) {
            var that = this;
            return that._get_sub_architecture(name);
        }
    };

    window.HelpUtils = new _HelpUtils();
})();