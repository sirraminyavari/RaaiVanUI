(function () {
    if (window.RaaiVanHub) return;

    window.RaaiVanHub = {
        Objects: {
            Hub: null,
            Connection: null,
            Listeners: {},
            Started: false,
            Disconnected: true,
            OnRegisterQueue: {},
            OnUnregisterQueue: {}
        },

        _parse: function (str) {
            try { return JSON.parse("{\"R\":" + str + "}").R; }
            catch (e) { return str; }
        },

        _initialize: function () {
            var that = RaaiVanHub;
            
            that.Objects.Connection = jQuery.connection;
            var hub = that.Objects.Hub = jQuery.connection.raaivanHub;
            
            hub.client.getData = function (name, result) {
                name = String(name).toLowerCase();

                for (var uId in (that.Objects.Listeners[name] || {}))
                    if (that.Objects.Listeners[name][uId]) that.Objects.Listeners[name][uId](that._parse(result));
            };
            
            hub.client.registered = function (uniqueId, name) {
                name = String(name).toLowerCase();
                if (!(that.Objects.OnRegisterQueue[name] || {})[uniqueId]) return;
                that.Objects.OnRegisterQueue[name][uniqueId]();
                that.Objects.OnRegisterQueue[name][uniqueId] = null;
            }

            hub.client.unregistered = function (uniqueId, name) {
                name = String(name).toLowerCase();
                if (!(that.Objects.OnUnregisterQueue[name] || {})[uniqueId]) return;
                that.Objects.OnUnregisterQueue[name][uniqueId]();
                that.Objects.OnUnregisterQueue[name][uniqueId] = null;
            }
            
            //Start the connection
            var start = function () {
                $.connection.hub.start(/*{ transport: 'longPolling' }*/).done(function () {
                    that.Objects.Started = !(that.Objects.Disconnected = false);
                }).fail(function (err) {
                    console.log("Connection failed: " + err);
                    //setTimeout(function () { start(); }, 5000);
                });
            }

            start();
            
            $.connection.hub.disconnected(function () {
                that.Objects.Started = !(that.Objects.Disconnected = true);
                setTimeout(start, 5000);
            });

            /*
            $.connection.hub.connectionSlow(function () {
                console.log('We are currently experiencing difficulties with the connection.')
            });
            */
            //end of Start the connection

            jQuery(window).unload(function () {
                if (that.Objects.Started) that.stop();
            });
        },

        stop: function () {
            if (((RaaiVanHub.Objects.Connection || {}).hub || {}).stop) RaaiVanHub.Objects.Connection.hub.stop();
        },

        do_something_after_connect: function(func){
            var x = setInterval(function () {
                if (!RaaiVanHub.Objects.Started) return;
                clearInterval(x);
                func();
            }, 300);
        },

        send_data: function (name, data) {
            if (GlobalUtilities.get_type(data) == "json") data = JSON.stringify(data);

            RaaiVanHub.do_something_after_connect(function () {
                RaaiVanHub.Objects.Hub.server.getData(name, data);
            });
        },

        add_listeners: function (listeners, callback) {
            var that = RaaiVanHub;
            
            var lnames = {};
            var arr = [];

            for (var i = 0, lnt = (listeners || []).length; i < lnt; ++i) {
                var uniqueId = listeners[i].UniqueID, name = listeners[i].Name,
                    feedId = listeners[i].FeedID, func = listeners[i].Func;

                if (GlobalUtilities.get_type(func) != "function") return;

                name = String(name).toLowerCase();''
                that.Objects.Listeners[name] = that.Objects.Listeners[name] || {};
                that.Objects.Listeners[name][uniqueId] = func;

                arr.push(name);
                lnames[name] = { FeedID: feedId ? feedId : "" };
            }

            var uId = GlobalUtilities.generate_new_guid();

            RaaiVanHub.do_something_after_connect(function () {
                that.Objects.Hub.server.registerListener(uId, JSON.stringify(lnames));
            });

            if (GlobalUtilities.get_type(callback) == "function") {
                that.Objects.OnRegisterQueue[arr.join(",")] = that.Objects.OnRegisterQueue[arr.join(",")] || {};
                that.Objects.OnRegisterQueue[arr.join(",")][uId] = callback;
            }
        },

        add_listener: function (uniqueId, name, func, callback) {
            RaaiVanHub.add_listeners([{ UniqueID: uniqueId, Name: name, Func: func }], callback);
        },

        remove_listeners: function (listeners, callback) {
            var that = RaaiVanHub;

            var arr = [];
            var lnames = {};

            for (var i = 0, lnt = (listeners || []).length; i < lnt; ++i) {
                var uniqueId = listeners[i].UniqueID, name = listeners[i].Name, feedId = listeners[i].FeedID;

                name = String(name).toLowerCase();
                if ((that.Objects.Listeners[name] || {})[uniqueId]) that.Objects.Listeners[name][uniqueId] = null;
                
                arr.push(name);
                lnames[name] = { FeedID: feedId ? feedId : "" };
            }

            var uId = GlobalUtilities.generate_new_guid();

            RaaiVanHub.do_something_after_connect(function () {
                that.Objects.Hub.server.removeListener(uId, JSON.stringify(lnames));
            });

            if (GlobalUtilities.get_type(callback) == "function") {
                that.Objects.OnUnregisterQueue[arr.join(",")] = that.Objects.OnUnregisterQueue[arr.join(",")] || {};
                that.Objects.OnUnregisterQueue[arr.join(",")][uId] = callback;
            }
        },

        remove_listener: function (uniqueId, name, callback) {
            RaaiVanHub.remove_listeners([{ UniqueID: uniqueId, Name: name }], callback);
        }
    }

    RaaiVanHub._initialize();
})();