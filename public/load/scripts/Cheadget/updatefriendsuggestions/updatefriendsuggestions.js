(function () {
    window.RVCheadget = window.RVCheadget || {};
    if (RVCheadget.updatefriendsuggestions) return;

    var updatefriendsuggestions = function () {
        var that = this;

        this.IsSystemAdmin = !!(window.RVGlobal || {}).IsSystemAdmin;
        if (!this.IsSystemAdmin) return;

        this.UpdateVariableName = "FSuggestUpdateTime";

        var elems = GlobalUtilities.create_nested_elements([
            { Type: "div", Name: "_div",
                Style: "position: fixed; z-index: " + GlobalUtilities.zindex.dialog() + "; padding: 0px; margin: 0px; font-family: tahoma; " +
                    "min-width: 500px; max-width:500px; width:500px; top: 0px; left: 395.5px;" +
                    "border: 5px solid rgb(153, 153, 153); border-radius: 5px; background-color:white;",
                Childs: [
                    { Type: "div", Class: "ActionButton", Style: "margin:8px auto 8px auto; width:300px; font-weight:bold;",
                        Properties: [{ Name: "onclick", Value: function () { that._do(); } }],
                        Childs: [{ Type: "text", TextValue: RVDic.UpdateFriendSuggestions}]
                    },
                    { Type: "div", Name: "_infoArea" }
                ]
            }
        ], document.body);

        this.ContainerDiv = elems["_div"];

        this.Objects = {
            InfoArea: elems["_infoArea"],
            Info: null
        }

        that.show();
    }

    updatefriendsuggestions.prototype = {
        show: function () {
            var that = this;

            if (!that.IsSystemAdmin) return;

            that.ContainerDiv.style.top = (($(window).height() / 2) - ($(that.ContainerDiv).outerHeight() / 2)) + "px";
            that.ContainerDiv.style.left = (($(window).width() / 2) - ($(that.ContainerDiv).outerWidth() / 2)) + "px";

            that.ContainerDiv.style.display = "block";
            that.ContainerDiv.zIndex = GlobalUtilities.zindex.dialog();

            GlobalUtilities.add_to_escape_queue(that.ContainerDiv, function () { that.ContainerDiv.style.display = "none"; });

            that._show_info();
        },

        _do: function () {
            var that = this;

            if (that._Processing) return;
            that._Processing = true;

            var nodeTypeIds = ["04D6A598-3612-4E2C-856C-04683B0CFE3A", "FDAED682-0B2A-4FEC-852D-68C7F1963FCA"];

            GlobalUtilities.load_files(["API/UsersAPI.js"], {
                OnLoad: function () {
                    var _timeStamp = new Date().getTime();

                    UsersAPI.UpdateFriendSuggestions({ Full: true, NodeTypeIDs: nodeTypeIds.join('|'),
                        ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) {
                                alert(RVDic.MSG[result.ErrorText || "OperationFailed"]);
                                that._Processing = false;
                                return;
                            }

                            var diff = (new Date().getTime()) - _timeStamp;
                            diff = Number(diff / 1000).toFixed(3);

                            alert(RVDic.MSG.ActionCompletedInNSeconds.replace("[n]", diff), { Timeout: 10000 });

                            that.Objects.Info = { Time: result.Now, Duration: diff };

                            RVAPI.SetVariable({ Name: that.UpdateVariableName, Value: Base64.encode(JSON.stringify(that.Objects.Info)),
                                ParseResults: true,
                                ResponseHandler: function (r) { }
                            });

                            that._show_info();

                            that._Processing = false;
                        }
                    });
                }
            });
        },

        _show_info: function () {
            var that = this;

            var _show = function () {
                that.Objects.InfoArea.innerHTML = "";

                GlobalUtilities.create_nested_elements([
                    { Type: "div", Style: "margin:10px auto 8px auto; width:300px; font-weight:bold; color:gray;",
                        Childs: [
                            { Type: "div", Class: "Float", Childs: [{ Type: "text", TextValue: RVDic.LastUpdateTime + ":"}] },
                            { Type: "div", Class: "RevFloat", Childs: [{ Type: "text", TextValue: that.Objects.Info.Time}] },
                            { Type: "div", Style: "clear:both;" }
                        ]
                    }
                ], that.Objects.InfoArea);
            }

            if (that.Objects.Info)
                _show();
            else {
                RVAPI.GetVariable({ Name: that.UpdateVariableName, ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.Value) {
                            that.Objects.Info = JSON.parse(Base64.decode(result.Value));
                            _show();
                        }
                    }
                });
            }
        }
    }

    RVCheadget.updatefriendsuggestions = new updatefriendsuggestions();
})();