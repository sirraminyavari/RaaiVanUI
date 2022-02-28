import { useState, useEffect } from 'react';
import { EditorState, convertFromRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';

import {
  getWikiBlocks,
  saveBlocks,
  removeBlocks,
  sortBlocks,
  saveHTMLContent,
  suggestTags,
} from './API';

import BE from './BlockEditor';

const Block = ({ nodeId, lang }) => {
  const [editorState, setEditorState] = useState(null);

  //legacy content is the old wiki content that must be converted to blocks
  const [legacyContent, setLegacyContent] = useState('');

  //update the content when the value of 'nodeId' changes
  useEffect(async () => {
    const data = await getWikiBlocks({ ownerId: nodeId });
    setEditorState(
      data?.Wiki
        ? EditorState.createWithContent(convertFromRaw(data.Wiki))
        : EditorState.createEmpty()
    );
    setLegacyContent(data?.LegacyWiki);
  }, [nodeId]);

  //use 'saveBlocks' api to save a block
  //content: { blocks: 'array of the blocks to be saved', entityMap: 'current version of entity map' }
  //insertAfterKey: the key of the last block that is places immediately before the blocks to be saved
  const handleSaveBlocks = async ({ content, insertAfterKey } = {}) => {
    const result = await saveBlocks({
      ownerId: nodeId,
      content,
      insertAfterKey,
    });
    console.log(result, "blocks 'save blocks'");
  };

  // //use 'removeBlocks' api to remove an array of blocks
  // //content: { blocks: 'array of the blocks to be saved', entityMap: 'current version of entity map' }
  // //there is no need to send all the block data. you can only send the data this way:
  // //e.g: { blocks: [{ key: "key1" }, { key: "key2" }, ...], entityMap: {} }
  // const handleRemoveBlocks = async ({ content } = {}) => {
  //   console.log ( 'REMOVED', content )
  //   // const result = await removeBlocks({ ownerId: nodeId, content });
  //   // console.log(result, "blocks 'remove blocks'");
  //   //do something
  // };

  // //use 'sortBlocks' api to sort all of the blocks
  // //content: { blocks: 'array of the blocks to be saved', entityMap: 'current version of entity map' }
  // //there is no need to send all the block data. you can only send the data this way:
  // //e.g: { blocks: [{ key: "key1", depth: "" }, { key: "key2", depth: "" }, ...], entityMap: {} }
  // const handleSortBlocks = async ({ content } = {}) => {
  //   console.log ( 'SORT', content )
  //   // const result = await sortBlocks({ ownerId: nodeId, content });
  //   // console.log(result, "blocks 'sort blocks'");
  //   //do something
  // };

  //use 'sortBlocks' api to sort all of the blocks
  //this api saves the raw html and css content of the editor to disk
  // FIXME: CSS is not required
  const handleSaveRawHtmlContent = async ({ html, css } = {}) => {
    const result = await saveHTMLContent({ ownerId: nodeId, html, css });
    console.log(result, "blocks 'save html content'");
  };

  // //use 'suggestTags' the get a list of tags for 'Mention' plugin
  // const handleSuggestTags = async ({ text } = {}) => {
  //   const result = await suggestTags({ text });
  //   // console.log(result, 'suggested tags');
  //   //do some stuff with the result
  // };

  return editorState ? (
    <>
      <BE
        editorState={editorState}
        setEditorState={setEditorState}
        initialContent={editorState}
        handleSaveBlocks={handleSaveBlocks}
        handleSaveRawHtmlContent={handleSaveRawHtmlContent}
      />
      <button
        onClick={async () => {
          const html = stateToHTML(editorState.getCurrentContent());
          await handleSaveRawHtmlContent({
            html,
            css: '.gholam { display: block }',
          });
        }}
      >
        Save HTML
      </button>
    </>
  ) : (
    'Loading...'
  );
};
export default Block;
