/**
 * this is a temporary function and will be removed as soon as new UI is developed!
 */

const RegisterNewNode = ({ nodeTypeId }) => {
  const { GlobalUtilities, CNAPI } = window;

  var _div = GlobalUtilities.create_nested_elements([
    {
      Type: 'div',
      Class:
        'small-10 medium-10 large-10 rv-border-radius-1 SoftBackgroundColor',
      Style: 'margin:0rem auto 3rem auto; padding:1rem;',
      Name: 'container',
    },
  ])['container'];

  GlobalUtilities.loading(_div);
  var showed = GlobalUtilities.show(_div, { DisableCloseOnClick: true });

  CNAPI.GetService({
    NodeTypeID: nodeTypeId,
    ParseResults: true,
    ResponseHandler: function (service) {
      service = service || {};

      GlobalUtilities.load_files(['CN/RegisterNewNode.js'], {
        OnLoad: function () {
          CNAPI.GetServiceRegistrationInfo({
            NodeTypeID: nodeTypeId,
            ParseResults: true,
            ResponseHandler: function (result) {
              result = result || {};

              new RegisterNewNode(_div, {
                Service: service,
                Extensions: result.Extensions || {},
                Options: {
                  IsServiceAdmin: result.IsServiceAdmin,
                  NodeSelectType: (result.KnowledgeType || {}).NodeSelectType,
                  PreviousVersion: null,
                  ParentNode: null,
                  DocumentTreeNode: null,
                  OnFinish: function () {
                    showed.Close();
                  },
                },
              });
            },
          });
        },
      });
    },
  });
};

export default RegisterNewNode;
