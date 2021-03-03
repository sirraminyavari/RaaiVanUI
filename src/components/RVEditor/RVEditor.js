import React from 'react';
import useLoadFiles from '../../hooks/useLoadFiles';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import Loader from '../Loader/Loader';

const { RV_Lang } = window;

const RVEditor = ({ data }) => {
  const loaded = useLoadFiles([
    "CKEditor5/ckeditor.js",
    "CKEditor5/translations/fa.js"
  ]);

  if(!loaded) return (<Loader />);

  const { BalloonBlockEditor } = window;

  let specialCharPlugins = BalloonBlockEditor.builtinPlugins.filter(f => !f.pluginName);

  const editorConfig = {
    language: RV_Lang,
    plugins: [
      "Mention", /*function (editor) { that.mention_customization(editor); }, uploadPlugin,*/
      "Alignment", "Autoformat", "AutoLink", "BlockQuote", "BlockToolbar", "Bold", "Code", "CodeBlock", "Essentials",
      "FontColor", "FontBackgroundColor", "Heading", "HorizontalLine", "Image", "ImageCaption", "ImageResize",
      "ImageStyle", "ImageToolbar", "ImageUpload", "SimpleUploadAdapter",
      "Indent", "IndentBlock", "Italic", "Link", "List", "ListStyle", "MediaEmbed", "MediaEmbedToolbar",
      "Paragraph", "PasteFromOffice", "RemoveFormat", "SpecialCharacters", "Strikethrough", "Subscript",
      "Superscript", "Table", "TableCellProperties", "TableProperties", "TableToolbar", "TextTransformation",
      "Underline"
    ].concat(specialCharPlugins),
    toolbar: {
      items: [
        'bold',
        'italic',
        'underline',
        'strikethrough',
        'subscript',
        'superscript',
        'removeFormat',
        '|',
        'alignment',
        'indent',
        'outdent',
        'numberedList',
        'bulletedList',
        '|',
        'fontColor',
        'fontBackgroundColor',
        '|',
        'heading',
        '|',
        'blockQuote',
        'code',
        'codeBlock',
      ],
    },
    blockToolbar: [
      'undo',
      'redo',
      '|',
      'link',
      'imageUpload',
      'mediaEmbed',
      'insertTable',
      '|',
      'horizontalLine',
      'specialCharacters',
      '|',
      'blockQuote',
      'code',
      'codeBlock',
      'rv_upload',
    ],
    image: {
      toolbar: ['imageTextAlternative', 'imageStyle:full', 'imageStyle:side'],
    },
    table: {
      contentToolbar: [
        'tableColumn',
        'tableRow',
        'mergeTableCells',
        'tableCellProperties',
        'tableProperties',
      ],
    },
    /*
        mention: { feeds: [that.mention_feed_builder()] },
        simpleUpload: {
            uploadUrl: DocsAPI.GetUploadLink({
                OwnerID: that.Objects.OwnerID,
                OwnerType: that.Objects.UploadOwnerType
            })
        },
        */
    licenseKey: '',
  };

  return (
    <CKEditor
      editor={BalloonBlockEditor}
      config={editorConfig}
      data={ data }
      onReady={(editor) => {
        // You can store the "editor" and use when it is needed.
        console.log('Editor is ready to use!', editor);
      }}
      onChange={(event, editor) => {
        const data = editor.getData();
        console.log({ event, editor, data });
      }}
      onBlur={(event, editor) => {
        console.log('Blur.', editor);
      }}
      onFocus={(event, editor) => {
        console.log('Focus.', editor);
      }}
    />
  );
};

export default RVEditor;
