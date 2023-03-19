import { EditorState, convertFromRaw } from 'draft-js';
import { convertLegacyHtmlToEditorState } from '@sirraminyavari/rv-block-editor';
import { textColors, highlightColors } from 'components/BlockEditor/data';
import { getNodePageUrl, getProfilePageUrl } from 'apiHelper/getPageUrl';
import { decodeBase64 } from 'helpers/helpers';

const parseImageBlocks = (legacyContent: string) => {
  let tempContent = legacyContent;
  const MENTION_LINK_REGEXP =
    /(@)\[\[([a-zA-Z\d\-_]+):File:([0-9a-zA-Z+/=]+)(:([0-9a-zA-Z+/=]*))?\]\]/gm;
  const MENTION_LINK_PARSER_REGEXP =
    /(@)\[\[([a-zA-Z\d\-_]+):File:([0-9a-zA-Z+/=]+):([0-9a-zA-Z+/=]*)?\]\]/;

  const links = legacyContent.match(MENTION_LINK_REGEXP);

  links?.forEach((linkString) => {
    const [_input, , id, name, properties] =
      linkString.match(MENTION_LINK_PARSER_REGEXP) || [];
    const fileArguments = {
      id,
      name: decodeBase64(name),
      ...JSON.parse(decodeBase64(properties) || '{}'),
    };

    if (
      ['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(fileArguments?.Extension)
    )
      tempContent = tempContent.replace(
        linkString,
        `<img 
            src="/download/${fileArguments.id}"
            alt=${fileArguments.name}
            ${fileArguments.H && `height="${fileArguments.H}"`}
            ${fileArguments.W && `width="${fileArguments.W}"`}
            />`
      );
  });
  return tempContent;
};

const BlockEditorLegacyHtmlParser = (
  legacyContent: string,
  setEditorState: (state: typeof EditorState) => void
) => {
  setEditorState(
    EditorState.createWithContent(
      convertFromRaw(
        convertLegacyHtmlToEditorState(parseImageBlocks(legacyContent), {
          colors: { textColors, highlightColors },
          getMentionLink: (search) => {
            switch (search.type) {
              case 'User':
                return getProfilePageUrl(search.id);
              case 'Node':
                return getNodePageUrl(search.id);
              case 'File':
                return `/download/${search.id}`;
              default:
                return '/';
            }
          },
        })
      )
    )
  );
};

export default BlockEditorLegacyHtmlParser;
