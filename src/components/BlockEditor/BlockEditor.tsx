import { useLayoutEffect, useRef } from 'react';
import { convertToRaw } from 'draft-js';
import BlockEditor, { defaultTheme } from '@sirraminyavari/rv-block-editor';
import useAutoSave from './useAutoSave';
import { dict } from './data';
import plugins from './plugins';
import useWindow from 'hooks/useWindowContext';

//TODO BlockEditorWrapper component needs review and refactor !!!

function BlockEditorWrapper({
  editorState,
  setEditorState,
  handleSaveBlocks,
  // handleSaveRawHtmlContent,
}) {
  const { RV_Direction, RV_RTL } = useWindow();
  const editorRef = useRef<HTMLElement>();
  useLayoutEffect(
    () => void setImmediate(() => editorRef.current?.focus()),
    []
  );

  useAutoSave(
    editorState,
    (changes, _sort) => {
      // const entityMap = editorState.getCurrentContent ().getEntityMap ()
      // setTimeout(() => {
      handleSaveBlocks({
        content: convertToRaw(editorState.getCurrentContent()),
        removeBlocks: changes.removedBlocks.map((b) => b.key),
      });
      // }, 1000);
    },
    1000
  );

  return (
    <BlockEditor
      ref={editorRef}
      editorState={editorState}
      onChange={setEditorState}
      dict={dict}
      lang={RV_RTL ? 'fa' : 'en'}
      dir={RV_Direction}
      plugins={plugins}
      styles={defaultTheme}
      portalNode={document.getElementById('block-editor-portal')}
      debugMode={false}
      readOnly={false}
      textarea={false}
    />
  );
}

BlockEditorWrapper.displayName = 'BlockEditorWrapper';

export default BlockEditorWrapper;
