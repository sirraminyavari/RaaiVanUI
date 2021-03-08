window.loadForm = (params) => {
  var initialJson = params;

  var isPoll = initialJson.IsPoll === true;
  var poll = initialJson.Poll || {};

  var instanceId = initialJson.InstanceID || '';
  var refInstanceId = initialJson.RefInstanceID || '';

  GlobalUtilities.loading(document.getElementById('formArea'));

  GlobalUtilities.load_files(['API/FGAPI.js', 'FormsManager/FormViewer.js'], {
    OnLoad: function () {
      if (!isPoll)
        new FormViewer('formArea', {
          InstanceID: instanceId,
          RefInstanceID: refInstanceId,
        });
      else {
        FGAPI.GetPollInstance({
          CopyFromPollID: poll.IsCopyOfPollID,
          PollID: poll.PollID,
          OwnerID: poll.OwnerID,
          UseExistingPoll: true,
          ParseResults: true,
          ResponseHandler: function (result) {
            if (result.ErrorText)
              alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
            else if (result.Succeed) {
              instanceId = result.InstanceID;
              if (result.Poll) poll = result.Poll;

              new FormViewer('formArea', {
                InstanceID: instanceId,
                LimitOwnerID: poll.OwnerID,
                ShowAllIfNoLimit: true,
                PollAbstract: true,
                Editable: true,
                FooterSaveButton: true,
                HideHeader: false,
                HideDescription: true,
                FillButton: false,
                Poll: poll,
                IsWorkFlowAdmin: false,
                OnInit: function () {
                  this.goto_edit_mode();
                },
                OnAfterSave: function () {},
              });
            }
          },
        });
      }
    },
  });
};
