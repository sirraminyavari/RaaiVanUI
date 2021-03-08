import MentionDialog from './MentionDialog';
import AddMentioned from './AddMentioned';

const MentionCustomization = (editor, { selectId = 'select' }) => {
  let removing = false;

  const defaultSelected = function (text) {
    if (removing) return;
    removing = true;
    setTimeout(() => {
      removing = false;
    }, 500);

    setTimeout(() => {
      for (let i = 0; i < text.length + 1; i++)
        editor.execute('delete', { direction: 'backward' });

      MentionDialog({
        onSelect: (selectedItem) => AddMentioned(editor, selectedItem),
      });
    }, 50);
  };

  // The upcast converter will convert view <a class="mention" href="" data-user-id="">
  // elements to the model 'mention' text attribute.
  editor.conversion.for('upcast').elementToAttribute({
    view: {
      name: 'a',
      key: 'data-mention',
      classes: 'mention',
      attributes: { id: true, href: true, 'data-rv-tag': true },
    },
    model: {
      key: 'mention',
      value: (viewItem) => {
        // The mention feature expects that the mention attribute value
        // in the model is a plain object with a set of additional attributes.
        // In order to create a proper object use the toMentionAttribute() helper method:
        const mentionAttribute = editor.plugins
          .get('Mention')
          .toMentionAttribute(viewItem, {
            // Add any other properties that you need.
            link: viewItem.getAttribute('href'),
            markup: viewItem.getAttribute('data-rv-tag'),
          });

        return mentionAttribute;
      },
    },
    converterPriority: 'high',
  });

  // Downcast the model 'mention' text attribute to a view <a> element.
  editor.conversion.for('downcast').attributeToElement({
    model: 'mention',
    view: (modelAttributeValue, { writer }) => {
      // Do not convert empty attributes (lack of value means no mention).
      if (!modelAttributeValue) {
        return;
      }

      if (modelAttributeValue.id.substr(1) == selectId) {
        defaultSelected(modelAttributeValue.text);
        return writer.createAttributeElement('a');
      }

      return writer.createAttributeElement(
        'a',
        {
          class: 'mention',
          'data-mention': modelAttributeValue.id,
          'data-rv-tag': modelAttributeValue.markup,
          href: modelAttributeValue.link,
        },
        {
          // Make mention attribute to be wrapped by other attribute elements.
          priority: 20,
          // Prevent merging mentions together.
          id: modelAttributeValue.uid,
        }
      );
    },
    converterPriority: 'high',
  });
};

export default MentionCustomization;
