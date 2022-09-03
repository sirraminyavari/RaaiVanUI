import { useState, useEffect, useCallback } from 'react';
import { EditorState, convertFromRaw } from 'draft-js';
import { convertLegacyHtmlToEditorState } from '@sirraminyavari/rv-block-editor';

import {
  getWikiBlocks,
  saveBlocks,
  suggestTags,
} from 'components/BlockEditor/API';
import { textColors, highlightColors } from 'components/BlockEditor/data';

import BlockEditor from 'components/BlockEditor/BlockEditor';
import OnClickAway from 'components/OnClickAway/OnClickAway';
import { IHandleSaveBlocks } from 'components/BlockEditor/BlockEditor.type';
import { getNodePageUrl, getProfilePageUrl } from 'apiHelper/getPageUrl';

export type WikiBlockEditor = { nodeId?: string; editable?: boolean };

const WikiBlock = ({ nodeId, editable }: WikiBlockEditor) => {
  const [editorState, setEditorState] = useState(null);
  const [isFocused, setIsFocused] = useState(false);

  //TODO needs checking for arguments ...
  const convertLegacyHtmlStringToEditorState = useCallback(
    (legacyContent: string) => {
      setEditorState(
        EditorState.createWithContent(
          convertFromRaw(
            convertLegacyHtmlToEditorState(legacyContent, {
              colors: { textColors, highlightColors },
              //@ts-expect-error
              getMentionLink: async (search) => {
                console.log({ search });
                const rawMentions = await suggestTags({
                  //@ts-expect-error
                  text: search,
                });
                const mentions = rawMentions.map((suggestTag) => ({
                  ...suggestTag,
                  id: suggestTag.ItemID,
                  name: suggestTag.Name,
                  avatar: suggestTag.ImageURL,
                  link:
                    suggestTag.Type === 'User'
                      ? getProfilePageUrl(suggestTag.ItemID)
                      : getNodePageUrl(suggestTag.ItemID),
                }));
                return mentions;
              },
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
      const data = await getWikiBlocks({ ownerId: nodeId });
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

  return (
    <>
      <OnClickAway
        style={{}}
        onAway={() => setIsFocused(false)}
        onDoubleClick={() => {
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
