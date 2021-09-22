(function () {
    if (window.PollStart) return;

    window.PollStart = function (container, params) {
        this.Container = typeof (container) == "object" ? container : document.getElementById(container);
        if (!this.Container) return;
        params = params || {};

        this.Objects = {
            OwnerID: params.OwnerID,
            OwnerType: params.OwnerType,
            CopyFromPollID: params.CopyFromPollID,
            PollID: params.PollID,
            PollName: Base64.decode(params.PollName),
            Poll: params.Poll,
            AudienceCount: params.AudienceCount,
            IsWorkFlowAdmin: params.IsWorkFlowAdmin
        };
        
        this.Options = {
            HideSummary: params.HideSummary,
            UseExistingPoll: params.UseExistingPoll === true,
            DefaultButtonTitle: params.DefaultButtonTitle
        };

        var that = this;

        GlobalUtilities.load_files(["API/FGAPI.js"], { OnLoad: function () { that.preinit(); }});
    };

    PollStart.prototype = {
        preinit: function () {
            var that = this;
            
            FGAPI.GetPollStatus({
                IsCopyOfPollID: that.Objects.CopyFromPollID, PollID: that.Objects.PollID, ParseResults: true,
                ResponseHandler: function (result) {
                    if ((result || {}).Poll) that.Objects.Poll = result.Poll;
                    that.initialize(result);
                }
            });
        },

        initialize: function (params) {
            var that = this;
            params = params || {};

            var instanceId = params.InstanceID;
            
            that.Container.innerHTML = "";
            
            var elems = GlobalUtilities.create_nested_elements([{
                Type: "div", Class: "small-12 medium-12 large-12", Style: "display:flex; flex-flow:column; height:100%;",
                Childs: [
                    {
                        Type: "div", Style: "flex:0 1 auto; text-align:center; font-weight:bold; font-size:0.8rem; margin-bottom:0.5rem;",
                        Childs: [{ Type: "text", TextValue: that.Objects.PollName }]
                    },
                    {
                        Type: "div", Style: "flex:1 1 auto;",
                        Childs: [{
                            Type: "middle", Style: "padding-bottom:0.5rem;",
                            Childs: [
                                { Type: "div", Name: "desc", Style: "text-align:center; font-size:0.8rem; display:none;" },
                                {
                                    Type: "div", Class: "small-12 medium-12 large-12", Name: "info",
                                    Style: "text-align:center; font-size:0.7rem; color:rgb(100,100,100); margin-top:0.3rem; display:none;"
                                }
                            ]
                        }]
                    },
                    {
                        Type: "div", Class: "rv-air-button rv-border-radius-quarter", Name: "actionButton",
                        Style: "flex:0 1 auto; margin:0.5rem auto 0 auto; padding:0.3rem 1rem; text-align:center; font-size:0.7rem;"
                    }
                ]
            }
            ], that.Container);
            
            if (params.Description) {
                jQuery(elems["desc"]).fadeIn(500);
                GlobalUtilities.append_markup_text(elems["desc"], Base64.decode(params.Description));
            }

            //set the title of the action button
            var actionButtonTitle = that.Options.DefaultButtonTitle || RVDic.FillTheForm;
            
            if (+params.FilledElementsCount && (params.FilledElementsCount < params.ElementsCount)) {
                actionButtonTitle = RVDic.Edit + " (" + RVDic.YouHaveFilledNOfMFields
                    .replace("[n]", params.FilledElementsCount).replace("[m]", params.ElementsCount) + ")";
            }
            else if ((params.ElementsCount > 0) && (params.FilledElementsCount == params.ElementsCount))
                actionButtonTitle = RVDic.Edit + " (" + RVDic.Done + ")";

            GlobalUtilities.set_text(elems["actionButton"], GlobalUtilities.convert_numbers_to_persian(actionButtonTitle));
            //end of set the title of the action button

            //set the number of users that have done
            if (that.Objects.AudienceCount && (that.Objects.AudienceCount > 1)) {
                var ttl = "";

                if (params.AllFilledFormsCount == that.Objects.AudienceCount)
                    ttl = RVDic.FG.Poll.AllOfTheNUsersHaveDone.replace("[n]", that.Objects.AudienceCount);
                else {
                    ttl = RVDic.FG.Poll.NOfTheMUsersHaveDone.replace("[n]", params.AllFilledFormsCount)
                        .replace("[m]", that.Objects.AudienceCount);
                }

                jQuery(elems["info"]).html(GlobalUtilities.convert_numbers_to_persian(ttl)).fadeIn(500);
            }
            //end of set the number ob users that have done

            var processing = false;

            elems["actionButton"].onclick = function () {
                if (processing) return;

                if (instanceId) show_poll();
                else {
                    processing = true;
                    
                    FGAPI.GetPollInstance({
                        CopyFromPollID: that.Objects.CopyFromPollID, PollID: that.Objects.PollID,
                        OwnerID: that.Objects.OwnerID, UseExistingPoll: that.Options.UseExistingPoll, ParseResults: true,
                        ResponseHandler: function (result) {
                            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
                            else if (result.Succeed) {
                                instanceId = result.InstanceID;
                                if (result.Poll) that.Objects.Poll = result.Poll;
                                show_poll();
                            }

                            processing = false;
                        }
                    });
                }
            };

            var showed = null;

            var show_poll = function () {
                if (that.PollInstanceContainer) return showed = GlobalUtilities.show(that.PollInstanceContainer);

                var _div = that.PollInstanceContainer = GlobalUtilities.create_nested_elements([
                    {
                        Type: "div", Class: "small-10 medium-9 large-8 rv-border-radius-1 SoftBackgroundColor",
                        Style: "margin:0rem auto; padding:1rem;", Name: "_div"
                    }
                ])["_div"];

                GlobalUtilities.loading(_div);
                showed = GlobalUtilities.show(_div);
                
                GlobalUtilities.load_files(["FormsManager/FormViewer.js"], {
                    OnLoad: function () {
                        new FormViewer(_div, {
                            InstanceID: instanceId, LimitOwnerID: that.Objects.OwnerID, ShowAllIfNoLimit: true,
                            PollAbstract: true, Editable: true, FooterSaveButton: true, HideHeader: false, 
                            HideTitle: true, HideDescription: false, FillButton: false, Poll: that.Objects.Poll,
                            PollOwnerType: that.Objects.OwnerType,
                            IsWorkFlowAdmin: that.Objects.IsWorkFlowAdmin,
                            OnInit: function () { this.goto_edit_mode(); },
                            OnAfterSave: function () {
                                GlobalUtilities.confirm(RVDic.FG.Poll.PollSavedMessage, function (r) {
                                    if (r) showed.Close();
                                });
                            }
                        });
                    }
                });
            };
        }
    };
})();