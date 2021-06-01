(function () {
    if (window._RAPI) return;

    window._RAPI = function () { };

    _RAPI.prototype = {
        _BaseURL: "",
        _Username: "",
        _Password: "",

        Ticket: null,

        init: function (params) {
            this._BaseURL = (params || {}).BaseURL || this._BaseURL;
            this._Username = (params || {}).Username || this._Username;
            this._Password = (params || {}).Password || this._Password;

            this.Ticket = null;
        },

        EndPoints: {
            API: "api/",
            Knowledge: "api/knowledge/"
        },

        get_type: (function () {
            var f = (function () { }).constructor, j = ({}).constructor, a = ([]).constructor,
                s = ("gesi").constructor, n = (2).constructor, b = (true).constructor, t = (new Date()).constructor;

            return function (value) {
                if (value === null) return "null";
                else if (value === undefined) return "undefined";

                switch (value.constructor) {
                    case f: return "function";
                    case j: return "json";
                    case a: return "array";
                    case s: return "string";
                    case n: return "number";
                    case b: return "boolean";
                    case t: return "datetime";
                    default: return String(typeof (value));
                }
            }
        })(),

        _parse: function (input) {
            try { return this.get_type(input) == "json" ? input : JSON.parse(String(input || "{}")); }
            catch (e) { return { error: "json parse error" }; }
        },

        _ajax_request: function (data, callback, params) {
            var that = this;

            var url = that._BaseURL;
            if (url) {
                if (url[url.length - 1] != '/') url += '/';
                url += params.Action;
            }

            if (that.get_type(callback) != "function") return;
            data = jQuery.extend(data || {}, { time_stamp: (new Date()).getTime(), Ticket: that.Ticket ? that.Ticket : null });
            params = params || {};

            jQuery[params.Method ? String(params.Method).toLowerCase() : "post"](url, data, function (d) {
                callback(that._parse(d));
            });
        },

        authenticate: function (callback) {
            var that = this;

            if ((that.Ticket === false) || that.Ticket) return callback(that.Ticket, true);

            that._ajax_request({ username: that._Username, password: that._Password }, function (d) {
                callback(that.Ticket = (d || {}).Ticket ? d.Ticket : false);
            }, { Action: that.EndPoints.API + "authenticate" });
        },

        send_request: function (data, callback, params) {
            var that = this;

            if (that.get_type(callback) != "function") return;

            that.authenticate(function (d, oldTicketUsed) {
                if (d === false) return callback({ error: "authentication failed" });

                that._ajax_request(data, !oldTicketUsed ? callback : function (r) {
                    if ((r || {}).InvalidTicket === true) {
                        that.Ticket = null;
                        that.send_request(data, callback, params);
                    }
                    else callback(r);
                }, params);
            });
        },

        post: function (action, data, callback) {
            this.send_request(data, callback, { Method: "POST", Action: action });
        },

        get: function (action, data, callback) {
            this.send_request(data, callback, { Method: "GET", Action: action });
        },

        get_form: function (data, callback) {
            this.post(this.EndPoints.API + "get_form", data, callback);
        },

        search_form_instances: function (data, callback) {
            this.post(this.EndPoints.API + "search_form_instances", data, callback);
        },

        save_form: function (data, callback) {
            this.post(this.EndPoints.API + "save_form", data, callback);
        },

        get_form_instance: function (data, callback) {
            this.post(this.EndPoints.API + "get_form_instance", data, callback);
        },

        new_node: function (data, callback) {
            this.post(this.EndPoints.API + "new_node", data, callback);
        },

        get_nodes: function (data, callback) {
            this.post(this.EndPoints.API + "get_nodes", data, callback);
        },

        get_all_applications: function (data, callback) {
            RAPI.post(RAPI.EndPoints.API + "get_all_applications", data, callback);
        },

        run_job: function (data, callback) {
            RAPI.post(RAPI.EndPoints.API + "run_job", data, callback);
        },

        //Knowledge EndPoint

        send_node_to_admin: function (data, callback) {
            this.post(this.EndPoints.Knowledge + "send_to_admin", data, callback);
        }

        //end of Knowledge EndPoint
    };

    window.RAPI = new _RAPI();

    RAPI.new = function () { return new _RAPI(); };
})();