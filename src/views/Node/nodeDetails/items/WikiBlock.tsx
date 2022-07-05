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
import { IHandleSaveBlocks } from 'components/BlockEditor/BlockEditor.type';
import { getNodePageUrl, getProfilePageUrl } from 'apiHelper/getPageUrl';

const WikiBlock = ({ nodeId }) => {
  const [editorState, setEditorState] = useState(null);

  //TODO needs checking for arguments ...
  const convertLegacyHtmlStringToEditorState = useCallback(
    (legacyContent: string) => {
      setEditorState(
        EditorState.createWithContent(
          convertFromRaw(
            convertLegacyHtmlToEditorState(legacyContent, {
              colors: { textColors, highlightColors },
              getMentionLink: async (search) => {
                console.log({ search });
                const rawMentions = await suggestTags({ text: search });
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

  return editorState ? (
    <>
      <BlockEditor
        editorState={editorState}
        setEditorState={setEditorState}
        handleSaveBlocks={handleSaveBlocks}
      />
    </>
  ) : (
    ''
  );
};
export default WikiBlock;
