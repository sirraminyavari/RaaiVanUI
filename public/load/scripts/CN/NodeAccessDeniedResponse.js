(function () {
    if (window.NodeAccessDeniedResponse) return;

    window.NodeAccessDeniedResponse = function (container, params) {
        this.Container = typeof (container) == "object" ? container : document.getElementById(container);
        params = params || {};

        this.Objects = {
            NodeID: params.NodeID
        };

        var that = this;

        GlobalUtilities.load_files(["API/CNAPI.js"], { OnLoad: function () { that.initialize(params); } });
    }

    NodeAccessDeniedResponse.prototype = {
        initialize: function (params) {
            params = params || {};
            var that = this;

            var membershipButton = params.MembershipButton === true;
            var hasPendingRequest = params.HasPendingRequest === true;

            that.Container.innerHTML = "";

            var elems = GlobalUtilities.create_nested_elements([
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "text-align:center; margin-top:10rem; font-size:1.5rem; font-weight:bold;",
                    Childs: [{ Type: "text", TextValue: Base64.decode(params.Name) }]
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "text-align:center; margin-top:0.6rem; font-size:1.5rem; font-weight:bold; color:gray;",
                    Childs: [{ Type: "text", TextValue: Base64.decode(params.NodeType) }]
                },
                {
                    Type: "div", Name: "publicDesc",
                    Class: "small-12 medium-12 large-12 rv-dark-gray rv-border-radius-1 rv-air-button",
                    Style: "text-align:center; margin-top:0.6rem; padding:1rem; font-size:1rem; cursor:default;" +
                        (params.PublicDescription ? "" : "display:none;")
                },
                {
                    Type: "div", Class: "small-12 medium-12 large-12",
                    Style: "text-align:center; margin-top:1.5rem; font-size:1.5rem; color:blue;",
                    Childs: [{ Type: "text", TextValue: RVDic.MSG.AccessDenied }]
                },
                {
                    Type: "div", Name: "requestButton", Class: "small-10 medium-4 large-3 ActionButton",
                    Style: "margin:2rem auto 0rem auto;" + (membershipButton ? "" : "display:none;")
                }
            ], that.Container);

            var requestButton = elems["requestButton"];

            GlobalUtilities.append_markup_text(elems["publicDesc"], Base64.decode(params.PublicDescription));

            var set_button_text = function () {
                GlobalUtilities.set_text(requestButton, hasPendingRequest ? RVDic.CancelRequest :
                    RVDic.JoinN.replace("[n]", Base64.decode(params.NodeType)));
            };

            set_button_text();

            var processing = false;

            requestButton.onclick = !membershipButton ? null : function () {
                if (processing) return;
                processing = true;

                CNAPI[hasPendingRequest ? "RemoveMember" : "AddMember"]({
                    NodeID: that.Objects.NodeID, ParseResults: true,
                    ResponseHandler: function (result) {
                        if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                        else {
                            hasPendingRequest = !hasPendingRequest;
                            set_button_text();
                        }

                        processing = false;
                    }
                });
            };
        }
    }
})();