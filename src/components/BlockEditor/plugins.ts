import { useMemo } from 'react';

import {
  plugins as _plugins,
  defaultTheme,
} from '@sirraminyavari/rv-block-editor';
import { getNodePageUrl, getProfilePageUrl } from 'apiHelper/getPageUrl';

import { suggestTags } from './API';
import { textColors, highlightColors } from './data';

const Plugins = () =>
  useMemo(
    () => [
      _plugins.createBasicInlineStylesPlugin(),
      _plugins.createParagraphPlugin(),
      _plugins.createHeadingsPlugin(),
      _plugins.createListsPlugin({ styles: defaultTheme }),
      _plugins.createCheckableListPlugin({ styles: defaultTheme }),
      _plugins.createAccordionPlugin(),
      _plugins.createQuotePlugin(),
      _plugins.createCodeBlockPlugin({ styles: defaultTheme }),
      _plugins.createSoftNewlinePlugin(),
      _plugins.createLinksPlugin(),
      _plugins.createTextAnnotationsPlugin({ textColors, highlightColors }),
      _plugins.createBlockAlignmentPlugin(),
      //@ts-expect-error
      _plugins.createMentionPlugin({
        async suggestionsFilter(search: string) {
          const rawMentions = (await suggestTags({ text: search })) as Array<{
            [key: string]: any;
          }>;
          console.log(rawMentions);
          const mentions = rawMentions.map((suggestTag) => {
            return {
              ...suggestTag,
              id: suggestTag.ItemID,
              name: suggestTag.Name,
              avatar: suggestTag.ImageURL,
              link:
                suggestTag.Type === 'User'
                  ? getProfilePageUrl(suggestTag.ItemID)
                  : getNodePageUrl(suggestTag.ItemID),
            };
          });
          return mentions;
        },
      }),
    ],
    []
  );
export default Plugins;
