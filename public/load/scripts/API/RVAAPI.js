(function () {
    if (window.RVAAPI) return;

    var settings = {
        Username: "demo",
        Password: "1b743d704012bcf7408a6832b9d7e9069964f406",
        BaseURL: "http://94.232.172.89:44321",
        URL: {
            Base: function () { return settings.BaseURL; },
            Auth: function () { return settings.URL.Base() + "/auth"; },
            Command: function () { return settings.URL.Base() + "/command"; },
            Query: function () { return settings.URL.Base() + "/query"; }
        }
    };

    var trim = function (str) {
        str = str ? str.replace(/^\s+/, '') : "";
        for (var i = str.length - 1; i >= 0; i--) {
            if (/\S/.test(str.charAt(i))) {
                str = str.substring(0, i + 1);
                break;
            }
        }
        return str;
    }

    set_cookie = function (c_name, value, exdays) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + exdays);
        var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString()) + "; path=/";
        document.cookie = c_name + "=" + c_value;
    }

    get_cookie = function (c_name) {
        var i, x, y, ARRcookies = document.cookie.split(";");
        for (i = 0; i < ARRcookies.length; i++) {
            x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
            y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
            x = x.replace(/^\s+|\s+$/g, "");
            if (x == c_name) return unescape(y);
        }
    }

    window.RVAAPI = {
        Ticket: null,
        AuthResponse: null,

        Initialize: function (s) {
            s = s || {};

            settings.Username = s.username || settings.Username;
            settings.Password = s.password || settings.Password;
            settings.BaseURL = s.baseURL || settings.BaseURL;
        },

        AuthenticateAndGetTicket: function (callback) {
            var cookieVariableName = "rvaapiticket_" + settings.Username + "_" + settings.Password;

            var cookieValue = get_cookie(cookieVariableName);
            
            if (cookieValue) {
                RVAAPI.Ticket = cookieValue;
                return callback(RVAAPI.AuthResponse || { title: "ticket", ticket: RVAAPI.Ticket });
            }
            
            if (RVAAPI.Ticket) return callback(RVAAPI.AuthResponse);

            if (RVAAPI._GettingTicket) {
                var _interval = setInterval(function () {
                    if (RVAAPI._GettingTicket) return;
                    clearInterval(_interval);
                    callback(RVAAPI.AuthResponse);
                }, 50);

                return;
            }
            else if (RVAAPI.Ticket === false) return callback(RVAAPI.AuthResponse);
            
            RVAAPI._GettingTicket = true;
            
            $.post(settings.URL.Auth(), { username: settings.Username, password: settings.Password, format: "json", time_stamp: (new Date()).getTime() }, function (d) {
                RVAAPI.AuthResponse = d = JSON.parse(trim(d || " "));
                if (d.title == "ticket" && d.message) {
                    RVAAPI.Ticket = d.message;
                    set_cookie(cookieVariableName, RVAAPI.Ticket, 7);
                }
                if (!RVAAPI.Ticket) RVAAPI.Ticket = false;
                RVAAPI._GettingTicket = false;
                callback(d);
            }).fail(function (e) {
                if (!RVAAPI.Ticket) RVAAPI.Ticket = false;
                RVAAPI.AuthResponse = JSON.parse(trim(e || " "));
                RVAAPI._GettingTicket = false;
                callback(e);
            });
        },

        Do: function (url, data, callback) {
            RVAAPI.AuthenticateAndGetTicket(function () {
                if (!RVAAPI.Ticket) return callback(RVAAPI.AuthResponse);
                
                $.post(url, $.extend(data || {}, {
                    ticket: RVAAPI.Ticket, format: "json", input_format: "json", id_string_or_int: "string", time_stamp: new Date().getTime()
                }), function (d) { callback(JSON.parse(trim(d || " "))); }).fail(function (e) { callback(JSON.parse(trim(e || " "))); });
            });
        },

        InsertEntities: function (params, callback) {
            params = params || {};
            
            RVAAPI.Do(settings.URL.Command(), {
                command_type: "insert_entities", input_data: JSON.stringify({ entities: params.entities })
            }, function (d) { callback(d); });
        },

        DeleteEntities: function (params, callback) {
            params = params || {};

            RVAAPI.Do(settings.URL.Command(), {
                command_type: "delete_entities", input_data: JSON.stringify({ entities: params.entities })
            }, function (d) { callback(d); });
        },

        InsertRelations: function (params, callback) {
            params = params || {};

            RVAAPI.Do(settings.URL.Command(), {
                command_type: "insert_relations", input_data: JSON.stringify({ relations: params.relations })
            }, function (d) { callback(d); });
        },

        DeleteRelations: function (params, callback) {
            params = params || {};

            RVAAPI.Do(settings.URL.Command(), {
                command_type: "delete_relations", input_data: JSON.stringify({ relations: params.relations })
            }, function (d) { callback(d); });
        },

        AnalyzeConfiguration: function (params, callback) {
            params = params || {};

            RVAAPI.Do(settings.URL.Command(), {
                command_type: "analyze_configuration",
                input_data: JSON.stringify(params)
            }, function (d) { callback(d); });
        },

        GetTopIndirectRelations: function (params, callback) {
            params = params || {};

            RVAAPI.Do(settings.URL.Query(), {
                query_type: "recom", node_id: params.node_id, node_type: params.node_type,
                recommended_type: params.recommended_type, context: params.context, start: params.start, num: params.num
            }, function (d) { callback(d); });
        },

        GetTopDirectRelations: function (params, callback) {
            params = params || {};

            RVAAPI.Do(settings.URL.Query(), {
                query_type: "direct", node_id: params.node_id, node_type: params.node_type,
                recommended_type: params.recommended_type, context: params.context, start: params.start, num: params.num
            }, function (d) { callback(d); });
        },

        GetTopRelations: function (params, callback) {
            params = params || {};
            
            RVAAPI.Do(settings.URL.Query(), {
                query_type: "both", node_id: params.node_id, node_type: params.node_type,
                recommended_type: params.recommended_type, context: params.context, start: params.start, num: params.num
            }, function (d) { callback(d); });
        },

        GetNodesWithMostRecommendations: function (params, callback) {
            params = params || {};

            RVAAPI.Do(settings.URL.Query(), {
                query_type: "has_recom", node_type: params.node_type,
                context: params.context, start: params.start, num: params.num
            }, function (d) { callback(d); });
        },

        GetMostRecommendedNodes: function (params, callback) {
            params = params || {};

            RVAAPI.Do(settings.URL.Query(), {
                query_type: "most_recom", recommended_type: params.recommended_type,
                context: params.context, start: params.start, num: params.num
            }, function (d) { callback(d); });
        }
    }
})()