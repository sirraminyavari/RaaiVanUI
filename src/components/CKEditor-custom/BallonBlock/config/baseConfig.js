import {
  getFeedItems,
  customItemRenderer,
} from '../../plugins/mention/MentionCustom';
import { aparatProvider } from '../../plugins/mediaEmbed/Providers';
import headingOptions from './headingOptions';
import blockToolbar from './blockToolbar';
import imageToolbar from './imageToolbar';

const editorConfiguration = {
  blockToolbar,
  toolbar: {
    items: ['bold', 'italic', 'link'],
  },
  heading: {
    options: headingOptions,
  },
  mention: {
    feeds: [
      {
        marker: '@',
        feed: getFeedItems,
        itemRenderer: customItemRenderer,
      },
    ],
  },
  mediaEmbed: {
    extraProviders: [aparatProvider],
    previewsInData: true,
  },
  image: {
    toolbar: imageToolbar,
  },
  table: {
    contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
  },
  link: {
    openInNewTab: {
      mode: 'manual',
      label: 'Open in a new tab',
      defaultValue: true, // This option will be selected by default.
      attributes: {
        target: '_blank',
        rel: 'noopener noreferrer',
      },
    },
  },
  // This value must be kept in sync with the language defined in webpack.config.js.
  language: 'en',
};

export default editorConfiguration;
