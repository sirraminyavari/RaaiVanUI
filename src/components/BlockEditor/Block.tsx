import {useState, useEffect, useCallback} from 'react';
import {EditorState, convertFromRaw} from 'draft-js';
// import {stateToHTML} from 'draft-js-export-html';
import {convertLegacyHtmlToEditorState} from '@sirraminyavari/rv-block-editor';

import {getWikiBlocks, saveBlocks, saveHTMLContent} from './API';
import {textColors, highlightColors} from './data';

import BE from './BlockEditor';
import {IHandleSaveBlocks, IHandleSaveRawHtmlContent} from './BlockEditor.type';

const Block = ({nodeId}) => {
  const [editorState, setEditorState] = useState(null);

  const convertLegacyHtmlStringToEditorState = useCallback(
    (legacyContent: string) => {
      setEditorState(
        EditorState.createWithContent(
          convertFromRaw(
            convertLegacyHtmlToEditorState(legacyContent, {
              colors: {textColors, highlightColors},
              getMentionLink: ({id}) => `https://google.com/search?q=${id}`,
            })
          )
        )
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [EditorState]
  );

  //update the content when the value of 'nodeId' changes
  useEffect(() => {
    (async () => {
      const data = await getWikiBlocks({ownerId: nodeId});
      if (data.Wiki?.blocks?.length === 0 && data?.LegacyWiki)
        convertLegacyHtmlStringToEditorState(data?.LegacyWiki);
      else
        setEditorState(
          data?.Wiki
            ? EditorState.createWithContent(convertFromRaw(data.Wiki))
            : EditorState.createEmpty()
        );
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeId]);

  //use 'saveBlocks' api to save a block
  //content: { blocks: 'array of the blocks to be saved', entityMap: 'current version of entity map' }
  //insertAfterKey: the key of the last block that is places immediately before the blocks to be saved
  const handleSaveBlocks: IHandleSaveBlocks = async ({
    content,
    insertAfterKey,
    removeBlocks,
  } = {}) => {
    const _result = await saveBlocks({
      ownerId: nodeId,
      content,
      insertAfterKey,
      removeBlocks,
    });
    // console.log(result, "blocks 'save blocks'");
  };

  const _handleSaveRawHtmlContent: IHandleSaveRawHtmlContent = async ({
    html,
    css,
  } = {}) => {
    const result = await saveHTMLContent({ownerId: nodeId, html, css});
    console.log(result, "blocks 'save html content'");
  };

  return editorState ? (
    <>
      <BE
        editorState={editorState}
        setEditorState={setEditorState}
        handleSaveBlocks={handleSaveBlocks}
        // handleSaveRawHtmlContent={_handleSaveRawHtmlContent}
      />
    </>
  ) : (
    'Loading...'
  );
};
export default Block;
