export default class MentionLinks {
  constructor(editor) {
    this.editor = editor;
  }

  init() {
    const editor = this.editor;
    // The upcast converter will convert <a class="mention" href="" data-user-id="">
    // elements to the model 'mention' attribute.
    editor.conversion.for('upcast').elementToAttribute({
      view: {
        name: 'a',
        key: 'data-mention',
        classes: 'mention',
        attributes: {
          href: true,
          'data-user-id': true,
        },
      },
      model: {
        key: 'mention',
        value: (viewItem) => {
          // The mention feature expects that the mention attribute value
          // in the model is a plain object with a set of additional attributes.
          // In order to create a proper object, use the toMentionAttribute helper method:
          const mentionAttribute = editor.plugins
            .get('Mention')
            .toMentionAttribute(viewItem, {
              // Add any other properties that you need.
              link: viewItem.getAttribute('href'),
              userId: viewItem.getAttribute('data-user-id'),
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

        return writer.createAttributeElement(
          'a',
          {
            class: 'mention',
            'data-mention': modelAttributeValue.id,
            'data-user-id': modelAttributeValue.userId,
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
  }
}
