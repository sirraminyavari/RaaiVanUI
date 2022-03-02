import { useLayoutEffect, useRef } from 'react';
import { convertToRaw } from 'draft-js';

import BlockEditor, { defaultTheme } from '@sirraminyavari/rv-block-editor';

import useAutoSave from './useAutoSave';
import { dict } from './data';
import plugins from './plugins';

function BE({
  editorState,
  setEditorState,
  initialContent,
  handleSaveBlocks,
  // handleRemoveBlocks,
  // handleSortBlocks,
  handleSaveRawHtmlContent,
}) {
  const editorRef = useRef();
  useLayoutEffect(
    () => void setImmediate(() => editorRef.current?.focus()),
    []
  );

  useAutoSave(
    editorState,
    (changes, sort) => {
      // const entityMap = editorState.getCurrentContent ().getEntityMap ()
      handleSaveBlocks({
        content: convertToRaw(editorState.getCurrentContent()),
      });
      // if ( changes.updatedBlocks.length ) {
      //   handleSaveBlocks ({  })
      // }
      // if ( changes.createdBlocks.length ) {}
      // if ( changes.removedBlocks.length ) handleRemoveBlocks ({ content: {
      //   blocks: { blocks: changes.removedBlocks.map ( b => ({ key: b.key }) ) },
      //   entityMap
      // } })
      // if ( sort ) handleSortBlocks ({ content: {
      //   blocks: sort,
      //   entityMap
      // } })
    },
    1000
  );

  return (
    <BlockEditor
      ref={editorRef}
      editorState={editorState}
      onChange={setEditorState}
      dict={dict}
      lang={'en'}
      dir={'ltr'}
      plugins={plugins}
      styles={defaultTheme}
      portalNode={document.getElementById('block-editor-portal')}
      debugMode={false}
      readOnly={false}
      textarea={false}
    />
  );
}
export default BE;
