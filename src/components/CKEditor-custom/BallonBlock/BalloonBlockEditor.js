import { CKEditor } from '@ckeditor/ckeditor5-react';
import BalloonBlock from '@raaivan/ckeditor5-custom-balloon-block';
import editorConfig from './config/baseConfig';

const BalloonBlockEditor = (props) => {
  const { data, handleDataChange } = props;
  return (
    <CKEditor
      editor={BalloonBlock}
      config={editorConfig}
      data={data}
      onReady={(editor) => {
        // You can store the "editor" and use when it is needed.
        console.log('Editor is ready to use!', editor);
      }}
      onChange={(event, editor) => {
        const data = editor.getData();
        handleDataChange(data);
        console.log({ event, editor, data });
      }}
      onBlur={(event, editor) => {
        // console.log('Blur.', editor);
      }}
      onFocus={(event, editor) => {
        // console.log('Focus.', editor);
      }}
    />
  );
};

export default BalloonBlockEditor;
