import AddMentioned from './AddMentioned';

const MentionFeed = ({
  marker,
  selectId,
  minimumCharacters,
  dataRequest,
  selectDialog,
  itemBuilder,
  selectBuilder,
  getEditor,
}) => {
  var sId = marker + selectId;

  return {
    marker: marker,
    minimumCharacters: minimumCharacters,
    feed: function (searchText) {
      return new Promise((resolve) => {
        dataRequest(searchText, function (arr) {
          if (selectDialog) resolve([{ id: sId, text: 'clicked' }].concat(arr));
          else resolve(arr);
        });
      });
    },
    itemRenderer: function (item) {
      return item.id != sId
        ? itemBuilder(item)
        : selectBuilder(item, function (selectedItem) {
            let editor = getEditor();

            if (!editor) return;

            let model = editor.model;

            for (let i = 0; i < 10; i++) {
              let pos = model.document.selection.getFirstPosition();
              let range = model.createRange(pos.getShiftedBy(-1), pos);
              let walker = range.getWalker({ singleCharacters: true });
              let chr = walker.next().value.item.data;

              editor.execute('delete', { direction: 'backward' });

              if (chr == marker) break;
            }

            AddMentioned(editor, selectedItem);
          });
    },
  };
};

export default MentionFeed;
