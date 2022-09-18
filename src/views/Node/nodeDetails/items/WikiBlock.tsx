import { useState, useEffect, useCallback } from 'react';
import { EditorState, convertFromRaw } from 'draft-js';

import { getWikiBlocks, saveBlocks } from 'components/BlockEditor/API';

import BlockEditor from 'components/BlockEditor/BlockEditor';
import OnClickAway from 'components/OnClickAway/OnClickAway';
import { IHandleSaveBlocks } from 'components/BlockEditor/BlockEditor.type';

import BlockEditorLegacyHtmlParser from 'components/BlockEditor/BlockEditorLegacyHtmlParser';

export type WikiBlockEditor = { nodeId?: string; editable?: boolean };

const WikiBlock = ({ nodeId, editable }: WikiBlockEditor) => {
  const [editorState, setEditorState] = useState(null);
  const [isFocused, setIsFocused] = useState(false);

  //TODO needs checking for arguments ...
  const convertLegacyHtmlStringToEditorState = useCallback(
    BlockEditorLegacyHtmlParser,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [EditorState]
  );
  //update the content when the value of 'nodeId' changes
  useEffect(() => {
    (async () => {
      const data = await getWikiBlocks({ ownerId: nodeId });
      if (data.Wiki?.blocks?.length === 0 && data?.LegacyWiki)
        convertLegacyHtmlStringToEditorState(data?.LegacyWiki, setEditorState);
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

  //@ts-expect-error
  if (!editable && !editorState?.getCurrentContent().hasText()) return <></>;
  return (
    <>
      <OnClickAway
        style={{}}
        onAway={() => setIsFocused(false)}
        onClick={() => {
          if (isFocused) return;
          setIsFocused(true);
        }}
      >
        {editorState && (
          <BlockEditor
            showHint={editable}
            editorState={editorState}
            setEditorState={setEditorState}
            handleSaveBlocks={handleSaveBlocks}
            readOnly={!(editable && isFocused)}
          />
        )}
      </OnClickAway>
    </>
  );
};
export default WikiBlock;
