import { useRef } from 'react';
import { convertToRaw } from 'draft-js';
import { BlockEditor, defaultTheme } from '@sirraminyavari/rv-block-editor';
import useAutoSave from './useAutoSave';
import { dict } from './data';
import Plugins from './plugins';
import useWindow from 'hooks/useWindowContext';
import styled from 'styled-components';
import Heading from 'components/Heading/Heading';

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
  const { RV_Direction, RV_RTL, RVDic } = useWindow();
  const editorRef = useRef<HTMLElement>();
  const initializePluginsInstance = Plugins();

  //! RVDic i18n variables
  const RVDicDoubleClickToEdit = RVDic.DoubleClickToEdit;
  const RVDicClickToEdit = RVDic.ClickToEdit;
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
    <BlockEditorStyler textarea={textarea} readOnly={readOnly}>
      {readOnly && (
        <Heading
          type="H5"
          style={{ paddingInline: '1rem', textAlign: 'center' }}
        >
          {textarea ? RVDicClickToEdit : RVDicDoubleClickToEdit}
        </Heading>
      )}
      <BlockEditor
        //@ts-expect-error
        ref={editorRef}
        editorState={editorState}
        onChange={setEditorState}
        dict={dict}
        lang={RV_RTL ? 'fa' : 'en'}
        dir={RV_Direction}
        plugins={initializePluginsInstance}
        styles={defaultTheme}
        portalNode={
          document.getElementById('block-editor-portal') as HTMLElement
        }
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
  readOnly?: boolean;
  textarea?: boolean;
}>(({ textarea }) => textarea && { className: 'rv-input' })<{
  readOnly?: boolean;
  textarea?: boolean;
}>`
  width: 100%;
  transition: border 0.3s;
  ${({ textarea }) =>
    !textarea &&
    `
      margin-block-start: 3.5rem;
      padding-inline: 3.5rem;
  `}
  ${({ textarea, readOnly }) =>
    textarea &&
    readOnly &&
    `
      border-color: transparent;
      &:hover {
        border-color: transparent;

      }
  `}
  & > div {
    font-family: inherit;
    max-width: 100%;
    margin-block: 0.5rem;
    padding-block: 0.3rem;
    padding-inline: 0.5rem;
    ${({ textarea }) =>
      textarea &&
      `
    max-width: 100%;
    margin-block: 0;
    box-shadow: unset;   
    border-width: 1px;
    padding-block: 0;

      & > div:first-of-type {
        margin-block: 0;
        margin-inline: 0;
      }
    `};
  }
`;
