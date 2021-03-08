const { GlobalUtilities, RVDic, RVAPI, Base64 } = window;

const MentionDialog = ({ isNode = true, onSelect }) => {
  var fileName = isNode ? 'NodeSelect' : 'UserSelect';
  var fileAddress = (isNode ? 'Ontology/' : 'USR/') + fileName + '.js';

  var _div = GlobalUtilities.create_nested_elements([
    {
      Type: 'div',
      Class: 'small-10 medium-8 larg-6 rv-border-radius-1 SoftBackgroundColor',
      Style: 'margin:0rem auto; padding:1rem;',
      Name: '_div',
    },
  ])['_div'];

  let showed = GlobalUtilities.show(_div);
  GlobalUtilities.loading(_div);

  GlobalUtilities.load_files([fileAddress], {
    OnLoad: function () {
      new window[fileName](_div, {
        Options: {
          Title: RVDic.NodeSelect,
          NodeTypeSearchBox: true,
          TreeCheckbox: false,
          HideSelectedItems: true,
          Filters: true,
          OnSelect: function (item) {
            showed.Close();

            var id = item.NodeID || item.UserID;
            var name = isNode
              ? item.Name
              : Base64.decode(item.FirstName) +
                ' ' +
                Base64.decode(item.LastName);

            onSelect({
              marker: '@',
              mention: {
                id: '@' + id.replace(/\-/gi, ''),
                text: name,
                markup:
                  '@[[' +
                  id +
                  ':' +
                  (isNode ? 'Node' : 'User') +
                  ':' +
                  Base64.encode(name) +
                  ']]',
                link: isNode
                  ? RVAPI.NodePageURL({ NodeID: id })
                  : RVAPI.UserPageURL({ UserID: id }),
              },
              text: name,
            });
          },
        },
      });
    },
  });
};

export default MentionDialog;
