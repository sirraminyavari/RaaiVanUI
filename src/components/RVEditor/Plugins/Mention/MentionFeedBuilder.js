import MentionFeed from './MentionFeed';
import MentionDialog from './MentionDialog';

const { RVAPI, Base64, GlobalUtilities, RVDic, RV_Float, RV_RevFloat } = window;

const MentionFeedBuilder = ({ getEditor, selectId = 'select' }) => {
  return MentionFeed({
    selectId: selectId,
    marker: '@',
    minimumCharacters: 1,
    selectDialog: true,
    getEditor: getEditor,
    dataRequest: function (searchText, callback) {
      RVAPI.SuggestTags({
        SearchText: Base64.encode(searchText),
        ParseResults: true,
        ResponseHandler: function (result) {
          var arr = (result.Items || []).map((itm) => {
            return {
              id: '@' + itm.ItemID.replace(/\-/gi, ''),
              text: Base64.decode(itm.Name),
              link:
                itm.Type == 'Node'
                  ? RVAPI.NodePageURL({ NodeID: itm.ItemID })
                  : RVAPI.UserPageURL({ UserID: itm.ItemID }),
              markup:
                '@[[' + itm.ItemID + ':' + itm.Type + ':' + itm.Name + ']]',
              obj: itm,
            };
          });

          callback(arr);
        },
      });
    },
    selectBuilder: function (item, onSelect) {
      return GlobalUtilities.create_nested_elements([
        {
          Type: 'div',
          Class: 'TextAlign Direction',
          Name: '_div',
          Style: 'display:flex; flex-flow:row; justify-content:center;',
          Childs: [
            { Name: 'user', Title: RVDic.User },
            { Name: 'node', Title: RVDic.Node },
          ].map((x) => {
            return {
              Type: 'div',
              Style: 'flex:0 0 auto; width:6rem; padding:0.5rem;',
              Childs: [
                {
                  Type: 'div',
                  Class: 'rv-border-radius-quarter',
                  Style:
                    'background-color:white; text-align:center; cursor:pointer;' +
                    'font-family:IRANSans; background-color:rgb(240,240,240);',
                  Properties: [
                    {
                      Name: 'onclick',
                      Value: function (e) {
                        e.stopImmediatePropagation();

                        MentionDialog({
                          isNode: x.Name == 'node',
                          onSelect: (selectedItem) => onSelect(selectedItem),
                        });
                      },
                    },
                  ],
                  Childs: [{ Type: 'text', TextValue: x.Title }],
                },
              ],
            };
          }),
        },
      ])['_div'];
    },
    itemBuilder: function (item) {
      var name = item.text;
      var trimmed =
        item.text.length > 50 ? item.text.substr(0, 60) + '...' : null;

      return GlobalUtilities.create_nested_elements([
        {
          Type: 'div',
          Class: 'TextAlign Direction',
          Name: '_div',
          Tooltip: trimmed ? name : null,
          Style:
            'display:flex; flex-flow:row; align-items:center; font-size:0.7rem;' +
            'border-bottom-width:1px; border-style:solid; border-color:rgb(240,240,240);',
          Childs: [
            {
              Type: 'div',
              Style: 'flex:1 1 auto; width:26rem;',
              Childs: [
                {
                  Type: 'div',
                  Style:
                    'text-align:' +
                    RV_Float +
                    ' !important; font-family:IRANSans;',
                  Childs: [{ Type: 'text', TextValue: trimmed || name }],
                },
                {
                  Type: 'div',
                  Style: 'display:flex; flex-flow:row;',
                  Childs: ['AdditionalID', 'NodeType']
                    .filter((x) => !!item.obj[x])
                    .map((x) => {
                      return {
                        Type: 'div',
                        Style:
                          'flex:0 0 auto; padding-' + RV_RevFloat + ':0.3rem;',
                        Childs: [
                          {
                            Type: 'div',
                            Style:
                              'text-align:' +
                              RV_Float +
                              ' !important; color:rgb(100,100,100);' +
                              'font-family:IRANSans; font-size:0.6rem; padding:0.1rem 0.3rem;',
                            Childs: [
                              {
                                Type: 'text',
                                TextValue: Base64.decode(item.obj[x]),
                              },
                            ],
                          },
                        ],
                      };
                    }),
                },
              ],
            },
            {
              Type: 'div',
              Style: 'flex:0 0 auto;',
              Childs: [
                {
                  Type: 'img',
                  Class: 'rv-border-radius-quarter',
                  Style: 'width:1.5rem; height:1.5rem;',
                  Attributes: [{ Name: 'src', Value: item.obj.ImageURL }],
                },
              ],
            },
          ],
        },
      ])['_div'];
    },
  });
};

export default MentionFeedBuilder;
