import { defaultTheme, plugins as _plugins } from 'block-editor';

import { suggestTags } from './API';

const plugins = [
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
  _plugins.createTextAnnotationsPlugin({
    textColors: [
      { name: 'red', color: '#D32F2F' },
      { name: 'purple', color: '#7B1FA2' },
      { name: 'blue', color: '#1976D2' },
      { name: 'cyan', color: '#0097A7' },
      { name: 'green', color: '#388E3C' },
      { name: 'yellow', color: '#FBC02D' },
      { name: 'orange', color: '#E64A19' },
      { name: 'brown', color: '#5D4037' },
    ],
    highlightColors: [
      { name: 'red', color: '#FFCDD2' },
      { name: 'purple', color: '#E1BEE7' },
      { name: 'blue', color: '#BBDEFB' },
      { name: 'cyan', color: '#B2EBF2' },
      { name: 'green', color: '#C8E6C9' },
      { name: 'yellow', color: '#FFF9C4' },
      { name: 'orange', color: '#FFCCBC' },
      { name: 'brown', color: '#D7CCC8' },
    ],
  }),
  _plugins.createBlockAlignmentPlugin(),
  _plugins.createMentionPlugin({
    async suggestionsFilter(search) {
      const rawMentions = await suggestTags({ text: search });
      const mentions = rawMentions.map((m) => ({
        ...m,
        id: m.ItemID,
        name: m.Name,
        avatar: m.ImageURL,
      }));
      return mentions;
    },
  }),
];
export default plugins;
