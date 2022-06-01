import {
  defaultTheme,
  plugins as _plugins,
} from '@sirraminyavari/rv-block-editor';

import {suggestTags} from './API';
import {textColors, highlightColors} from './data';

const plugins = [
  _plugins.createBasicInlineStylesPlugin(),
  _plugins.createParagraphPlugin(),
  _plugins.createHeadingsPlugin(),
  _plugins.createListsPlugin({styles: defaultTheme}),
  _plugins.createCheckableListPlugin({styles: defaultTheme}),
  _plugins.createAccordionPlugin(),
  _plugins.createQuotePlugin(),
  _plugins.createCodeBlockPlugin({styles: defaultTheme}),
  _plugins.createSoftNewlinePlugin(),
  _plugins.createLinksPlugin(),
  _plugins.createTextAnnotationsPlugin({textColors, highlightColors}),
  _plugins.createBlockAlignmentPlugin(),
  _plugins.createMentionPlugin({
    async suggestionsFilter(search) {
      const rawMentions = await suggestTags({text: search});
      const mentions = rawMentions.map((m) => ({
        ...m,
        id: m.ItemID,
        name: m.Name,
        avatar: m.ImageURL,
        link: `https://google.com/search?q=${m.ItemID}`,
      }));
      return mentions;
    },
  }),
];
export default plugins;
