import React from 'react';
import useLoadFiles from '../../hooks/useLoadFiles';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import UploadPlugin from './Plugins/Upload/Upload';
import MentionFeedBuilder from './Plugins/Mention/MentionFeedBuilder';
import MentionCustomization from './Plugins/Mention/MentionCustomization';
import LogoLoader from '../Loaders/LogoLoader/LogoLoader';

const { RV_Lang, GlobalUtilities } = window;

const RVEditor = ({
  upload: { ownerId: uploadOwnerId, ownerType: uploadOwnerType },
  data,
  events: { ready: onReady, change: onChange, blur: onBlur, focus: onFocus },
}) => {
  const loaded = useLoadFiles([
    'API/DocsAPI.js',
    'CKEditor5/ckeditor.js',
    'CKEditor5/translations/fa.js',
  ]);

  if (!loaded) return <LogoLoader />;

  const { BalloonBlockEditor, DocsAPI } = window;

  let specialCharPlugins = BalloonBlockEditor.builtinPlugins.filter(
    (f) => !f.pluginName
  );

  const uploadPlugin = UploadPlugin({
    ownerId: uploadOwnerId,
    ownerType: uploadOwnerType,
  });

  let editor = null;

  const editorConfig = {
    language: RV_Lang,
    plugins: [
      'Mention',
      function (editor) {
        MentionCustomization(editor, {});
      },
      uploadPlugin,
      'Alignment',
      'Autoformat',
      'AutoLink',
      'BlockQuote',
      'BlockToolbar',
      'Bold',
      'Code',
      'CodeBlock',
      'Essentials',
      'FontColor',
      'FontBackgroundColor',
      'Heading',
      'HorizontalLine',
      'Image',
      'ImageCaption',
      'ImageResize',
      'ImageStyle',
      'ImageToolbar',
      'ImageUpload',
      'SimpleUploadAdapter',
      'Indent',
      'IndentBlock',
      'Italic',
      'Link',
      'List',
      'ListStyle',
      'MediaEmbed',
      'MediaEmbedToolbar',
      'Paragraph',
      'PasteFromOffice',
      'RemoveFormat',
      'SpecialCharacters',
      'Strikethrough',
      'Subscript',
      'Superscript',
      'Table',
      'TableCellProperties',
      'TableProperties',
      'TableToolbar',
      'TextTransformation',
      'Underline',
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
    mention: { feeds: [MentionFeedBuilder({ getEditor: () => editor })] },
    simpleUpload: {
      uploadUrl: DocsAPI.GetUploadLink({
        OwnerID: uploadOwnerId,
        OwnerType: uploadOwnerType,
      }),
    },
    licenseKey: '',
  };

  return (
    <CKEditor
      editor={BalloonBlockEditor}
      config={editorConfig}
      data={data}
      onReady={(_editor) => {
        editor = _editor;
        if (GlobalUtilities.get_type(onReady) == 'function') onReady(_editor);
      }}
      onChange={(event, _editor) => {
        if (GlobalUtilities.get_type(onChange) == 'function')
          onChange(_editor, event);
      }}
      onBlur={(event, _editor) => {
        if (GlobalUtilities.get_type(onBlur) == 'function')
          onBlur(_editor, event);
      }}
      onFocus={(event, _editor) => {
        if (GlobalUtilities.get_type(onFocus) == 'function')
          onFocus(_editor, event);
      }}
    />
  );
};

export default RVEditor;

RVEditor.defaultProps = {
  mention: {},
  upload: {},
};
