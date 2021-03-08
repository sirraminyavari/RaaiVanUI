/**
 * this function adds a mentioned object to the editor
 */

const AddMentioned = (editor, mentioned) => {
  editor.execute('mention', mentioned);
  editor.editing.view.focus();
};

export default AddMentioned;
