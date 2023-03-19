import { useMemo } from 'react';

import {
  plugins as _plugins,
  // defaultTheme,
} from '@sirraminyavari/rv-block-editor';
import 'prismjs/themes/prism-tomorrow.min.css';
import { getNodePageUrl, getProfilePageUrl } from 'apiHelper/getPageUrl';

import { suggestTags } from './API';
import * as styles from './blockEditorCodeBlockTheme.module.css';
import { textColors, highlightColors } from './data';

const Plugins = () =>
  useMemo(
    () => [
      _plugins.createBasicInlineStylesPlugin(),
      _plugins.createParagraphPlugin(),
      _plugins.createHeadingsPlugin(),
      _plugins.createListsPlugin({ styles: styles }),
      _plugins.createCheckableListPlugin({ styles: styles }),
      _plugins.createAccordionPlugin(),
      _plugins.createQuotePlugin(),
      _plugins.createCodeBlockPlugin({ styles: styles }),
      _plugins.createSoftNewlinePlugin(),
      _plugins.createLinksPlugin(),
      _plugins.createTextAnnotationsPlugin({ textColors, highlightColors }),
      _plugins.createBlockAlignmentPlugin(),
      _plugins.createImagePlugin(),
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
