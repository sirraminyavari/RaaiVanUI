import { useRef } from 'react';
import { convertToRaw } from 'draft-js';
import BlockEditor, { defaultTheme } from '@sirraminyavari/rv-block-editor';
import useAutoSave from './useAutoSave';
import { dict } from './data';
import plugins from './plugins';
import useWindow from 'hooks/useWindowContext';
import styled from 'styled-components';

//TODO BlockEditorWrapper component needs review and refactor !!!

function BlockEditorWrapper({
  editorState,
  setEditorState,
  handleSaveBlocks,
  debugMode = false,
  textarea = false,
  readOnly = false,
  // handleSaveRawHtmlContent,
}) {
  const { RV_Direction, RV_RTL } = useWindow();
  const editorRef = useRef<HTMLElement>();
  // useEffect(
  // () => void setImmediate(() => editorRef.current?.focus()),
  //   []
  // );

  useAutoSave(
    editorState,
    (changes, _sort) => {
      // const entityMap = editorState.getCurrentContent ().getEntityMap ()
      // setTimeout(() => {
      handleSaveBlocks &&
        handleSaveBlocks({
          content: convertToRaw(editorState.getCurrentContent()),
          removeBlocks: changes.removedBlocks.map((b) => b.key),
        });
      // }, 1000);
    },
    1000
  );

  return (
    <BlockEditorStyler textarea={textarea}>
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
        debugMode={debugMode}
        readOnly={readOnly}
        textarea={textarea}
      />
    </BlockEditorStyler>
  );
}

BlockEditorWrapper.displayName = 'BlockEditorWrapper';

export default BlockEditorWrapper;

const BlockEditorStyler = styled.div.attrs<{
  textarea?: boolean;
}>(({ textarea }) => textarea && { className: 'rv-input' })<{
  textarea?: boolean;
}>`
  width: 100%;
  transition: border 0.3s;
  & > div {
    font-family: inherit;

    ${({ textarea }) =>
      textarea &&
      `
    max-width: 100%;
    margin-block: 0;
    box-shadow: unset;
    `}
  }
`;
