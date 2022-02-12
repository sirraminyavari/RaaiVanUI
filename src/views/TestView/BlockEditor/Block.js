import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import {
  getWikiBlocks,
  saveBlocks,
  removeBlocks,
  sortBlocks,
  saveHTMLContent,
  suggestTags,
} from './API';

import { EditorState, convertFromRaw } from 'draft-js';
import BlockEditor, { defaultTheme, plugins as _plugins } from 'block-editor';
import mentionsData from './mentions-mock-data';

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
  _plugins.createMentionPlugin({ mentions: mentionsData }),
];

const Block = ({ nodeId, lang }) => {
  const [editorContent, setEditorContent] = useState({});

  //legacy content is the old wiki content that must be converted to blocks
  const [legacyContent, setLegacyContent] = useState('');

  //update the content when the value of 'nodeId' changes
  useEffect(async () => {
    const data = await getWikiBlocks({ ownerId: nodeId });
    console.log(data?.Wiki, "blocks 'get wiki blocks'");
    setEditorContent(data?.Wiki || {});
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
    //do something
  };

  //use 'removeBlocks' api to remove an array of blocks
  //content: { blocks: 'array of the blocks to be saved', entityMap: 'current version of entity map' }
  //there is no need to send all the block data. you can only send the data this way:
  //e.g: { blocks: [{ key: "key1" }, { key: "key2" }, ...], entityMap: {} }
  const handleRemoveBlocks = async ({ content } = {}) => {
    const result = await removeBlocks({ ownerId: nodeId, content });
    console.log(result, "blocks 'remove blocks'");
    //do something
  };

  //use 'sortBlocks' api to sort all of the blocks
  //content: { blocks: 'array of the blocks to be saved', entityMap: 'current version of entity map' }
  //there is no need to send all the block data. you can only send the data this way:
  //e.g: { blocks: [{ key: "key1", depth: "" }, { key: "key2", depth: "" }, ...], entityMap: {} }
  const handleSortBlocks = async ({ content } = {}) => {
    const result = await sortBlocks({ ownerId: nodeId, content });
    console.log(result, "blocks 'sort blocks'");
    //do something
  };

  //use 'sortBlocks' api to sort all of the blocks
  //this api saves the raw html and css content of the editor to disk
  const handleSaveRawHtmlContent = async ({ html, css } = {}) => {
    const result = await saveHTMLContent({ ownerId: nodeId, html, css });
    console.log(result, "blocks 'save html content'");
    //do something
  };

  //use 'suggestTags' the get a list of tags for 'Mention' plugin
  const handleSuggestTags = async ({ text } = {}) => {
    const result = await suggestTags({ text });
    console.log(result, 'suggested tags');
    //do some stuff with the result
  };

  return (
    <>
      <BE />
    </>
  );
};

export default Block;

function getInitialEditorState(preset) {
  return () => contentPresets[preset]();
}

export const contentPresets = {
  empty: () => EditorState.createEmpty(),
  englishText: () =>
    EditorState.createWithContent(
      convertFromRaw({
        blocks: [
          {
            key: '6krbv',
            text: 'The Greatest Block Editor Known to Man',
            type: 'header-one',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: '5h4ci',
            text:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            type: 'unstyled',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: 'csl0t',
            text: 'Why is it so Great?',
            type: 'header-two',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: '77to5',
            text:
              'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
            type: 'unstyled',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: '3cefe',
            text:
              'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            type: 'unstyled',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: '5d6iv',
            text: 'The Three Pillars of Greatness',
            type: 'header-three',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: '67lkb',
            text: 'Being the Greatest in every Aspect Imaginable.',
            type: 'unordered-list-item',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: '1cp3k',
            text: 'Not Being not Great in any Aspect Possibly Possible.',
            type: 'unordered-list-item',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: '1ojs8',
            text: 'The Above Two.',
            type: 'unordered-list-item',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: 'fbmfg',
            text: 'Above One',
            type: 'checkable-list-item',
            depth: 1,
            inlineStyleRanges: [],
            entityRanges: [],
            data: { checked: true },
          },
          {
            key: '9v4cm',
            text: 'Above Two',
            type: 'checkable-list-item',
            depth: 1,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: 'd67f6',
            text:
              "You can even take these secret steps... but don't tell anyone!",
            type: 'accordion',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: { _collapsed: true },
          },
          {
            key: '823nl',
            text: 'Already open',
            type: 'accordion',
            depth: 1,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: 'be6cl',
            text: 'COOL huh?!',
            type: 'unstyled',
            depth: 2,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: 'c8ods',
            text: 'Not already open',
            type: 'accordion',
            depth: 1,
            inlineStyleRanges: [],
            entityRanges: [],
            data: { _collapsed: true },
          },
          {
            key: '52hf4',
            text: 'Are you sure you can do this?',
            type: 'accordion',
            depth: 2,
            inlineStyleRanges: [],
            entityRanges: [],
            data: { _collapsed: true },
          },
          {
            key: '1vhs5',
            text: 'Open at your own risk',
            type: 'accordion',
            depth: 3,
            inlineStyleRanges: [],
            entityRanges: [],
            data: { _collapsed: true },
          },
          {
            key: 'e4tl2',
            text: 'The Greatest Block Editor Known to Man',
            type: 'header-one',
            depth: 4,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: '83dfn',
            text:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            type: 'unstyled',
            depth: 4,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: 'b1oer',
            text: 'Why is it so Great?',
            type: 'header-two',
            depth: 4,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: 'f3ss5',
            text:
              'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
            type: 'unstyled',
            depth: 4,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: '654h4',
            text:
              'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            type: 'unstyled',
            depth: 4,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: 'ba5os',
            text: 'The Three Pillars of Greatness',
            type: 'header-three',
            depth: 4,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: '1lev7',
            text: 'Being the Greatest in every Aspect Imaginable.',
            type: 'unordered-list-item',
            depth: 4,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: '3ctqh',
            text: 'Not Being not Great in any Aspect Possibly Possible.',
            type: 'unordered-list-item',
            depth: 4,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: 'bngbj',
            text: 'The Above Two.',
            type: 'unordered-list-item',
            depth: 4,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: 'akjuu',
            text: 'Above One',
            type: 'checkable-list-item',
            depth: 5,
            inlineStyleRanges: [],
            entityRanges: [],
            data: { checked: true },
          },
          {
            key: '176ek',
            text: 'Above Two',
            type: 'checkable-list-item',
            depth: 5,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: 'aupk3',
            text: 'Steps to Creating the Greatest Editor on Earth',
            type: 'header-two',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: '2agqd',
            text:
              'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
            type: 'unstyled',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: '1aviv',
            text:
              'Call Nextle and ask them to create the greatest editor on the planet.',
            type: 'ordered-list-item',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: '8rbal',
            text:
              'Wait untill Nextle creates the greatest editor that ever editted the texts on the Earth.',
            type: 'ordered-list-item',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: '7pbkd',
            text:
              'Reveal your miraculous editor to the inhabitants of Earth and let them explode of excitement and wonder.',
            type: 'ordered-list-item',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: '2o6h0',
            text:
              'The Greatness is not in the Greatness itself but in the Essence of a Great Thing that is Great',
            type: 'blockquote',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: '1dtqo',
            text:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            type: 'unstyled',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: 'd6ntv',
            text:
              'How to Use the Greatest Editor that Can Ever be Written in Your Project',
            type: 'header-three',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: 'ar0ga',
            text:
              "import GreatesetEditor, { withExtraGreatness } from 'greatest-editor'\n\nfunction GreatApp () {\n    return <GreatestEditor />\n}\n\nexport default withExtraGreatness ( GreatApp )",
            type: 'code-block',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: { language: 'jsx' },
          },
        ],
        entityMap: {},
      })
    ),
  persianText: () =>
    EditorState.createWithContent(
      convertFromRaw({
        blocks: [
          {
            key: 'ep8ri',
            text: 'بهترین ویرایشگر بلوکی جهان هستی و حومه',
            type: 'header-one',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: 'blftu',
            text:
              'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است.',
            type: 'unstyled',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: '2vc24',
            text: 'چرا این حجم از بهترین بودن بی‌سابقست؟',
            type: 'header-two',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: '39dsf',
            text:
              ' علی الخصوص طراحان خلاقی، و فرهنگ پیشرو در زبان فارسی ایجاد کرد، در این صورت می توان امید داشت که تمام و دشواری موجود.',
            type: 'unstyled',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: '2j6hd',
            text:
              'برای شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد، کتاب‌های زیادی در شصت و سه درصد گذشته حال و آینده، شناخت فراوان جامعه و متخصصان را می طلبد، تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه‌ای.',
            type: 'unstyled',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: '3efjp',
            text: 'پایه‌های بهترینیت',
            type: 'header-three',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: '5312v',
            text: 'بهترین بودن از هر وجه قابل تصور.',
            type: 'unordered-list-item',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: 'f6ajt',
            text: 'نابهترین نبودن در هیچ وجهی که امکان ممکن بودن ممکن باشد.',
            type: 'unordered-list-item',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: 'v8fn',
            text: 'رعایت دو مورد بالا.',
            type: 'unordered-list-item',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: '4jhvu',
            text: 'رعایت مورد اول',
            type: 'checkable-list-item',
            depth: 1,
            inlineStyleRanges: [],
            entityRanges: [],
            data: { checked: true },
          },
          {
            key: '8s5bd',
            text: 'رعایت مورد دوم',
            type: 'checkable-list-item',
            depth: 1,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: '94jg3',
            text: 'تازه کجاشو دیدی؟!...',
            type: 'accordion',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: { _collapsed: true },
          },
          {
            key: '44ods',
            text: 'از قبل باز',
            type: 'accordion',
            depth: 1,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: '5i41m',
            text: 'صفا کردی؟',
            type: 'unstyled',
            depth: 2,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: 'atvfc',
            text: 'از قبل نباز',
            type: 'accordion',
            depth: 1,
            inlineStyleRanges: [],
            entityRanges: [],
            data: { _collapsed: true },
          },
          {
            key: '30jtr',
            text: 'مطمئنی می‌تونی؟!',
            type: 'accordion',
            depth: 2,
            inlineStyleRanges: [],
            entityRanges: [],
            data: { _collapsed: true },
          },
          {
            key: '1o1ud',
            text: 'پس فردا نیای بگی فلانی گفتااااا',
            type: 'accordion',
            depth: 3,
            inlineStyleRanges: [],
            entityRanges: [],
            data: { _collapsed: true },
          },
          {
            key: '6j2nn',
            text: 'بهترین ویرایشگر بلوکی جهان هستی و حومه',
            type: 'header-one',
            depth: 4,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: 'ap1jb',
            text:
              'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است.',
            type: 'unstyled',
            depth: 4,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: '71kcr',
            text: 'چرا این حجم از بهترین بودن بی‌سابقست؟',
            type: 'header-two',
            depth: 4,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: '4urnv',
            text:
              ' علی الخصوص طراحان خلاقی، و فرهنگ پیشرو در زبان فارسی ایجاد کرد، در این صورت می توان امید داشت که تمام و دشواری موجود.',
            type: 'unstyled',
            depth: 4,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: '2mhu0',
            text:
              'برای شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد، کتاب‌های زیادی در شصت و سه درصد گذشته حال و آینده، شناخت فراوان جامعه و متخصصان را می طلبد، تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه‌ای.',
            type: 'unstyled',
            depth: 4,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: 'av9lb',
            text: 'پایه‌های بهترینیت',
            type: 'header-three',
            depth: 4,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: 'ekvqo',
            text: 'بهترین بودن از هر وجه قابل تصور.',
            type: 'unordered-list-item',
            depth: 4,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: '5714a',
            text: 'نابهترین نبودن در هیچ وجهی که امکان ممکن بودن ممکن باشد.',
            type: 'unordered-list-item',
            depth: 4,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: '4ejtj',
            text: 'رعایت دو مورد بالا.',
            type: 'unordered-list-item',
            depth: 4,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: '60n4a',
            text: 'رعایت مورد اول',
            type: 'checkable-list-item',
            depth: 5,
            inlineStyleRanges: [],
            entityRanges: [],
            data: { checked: true },
          },
          {
            key: '3gqun',
            text: 'رعایت مورد دوم',
            type: 'checkable-list-item',
            depth: 5,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: '3c018',
            text: 'مراحل ساخت بهترین ویرایشگر دنیا و آخرت',
            type: 'header-two',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: 'e6eb3',
            text:
              'در ارائه راهکارها، و شرایط سخت تایپ به پایان رسد و زمان مورد نیاز شامل حروفچینی دستاوردهای اصلی، و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.',
            type: 'unstyled',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: '89ndf',
            text:
              'با نکستل تماس بگیرید و ازشون بخواید تا بهترین ادیتور روی زمین رو درست کنن.',
            type: 'ordered-list-item',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: 'fvibf',
            text: 'صبر کنید تا نکستل بهترین ادیتور خلقت رو درست کنه.',
            type: 'ordered-list-item',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: '99td',
            text:
              'این معجزه مهندسی رو نشون ساکنان زمین بدید تا از تعجب منفجر شن.',
            type: 'ordered-list-item',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: 'ags12',
            text: 'کمیت در کیفیت نیست بلکه حتی کیفیت هم در کمیت نیست - نیچه',
            type: 'blockquote',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: '52gao',
            text:
              'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است.',
            type: 'unstyled',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: '3ug31',
            text: 'طرز استفاده بهترین ادیتور قابل ساخت توسط بشر',
            type: 'header-three',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: 'bisvu',
            text:
              "import GreatesetEditor, { withExtraGreatness } from 'greatest-editor'\n\nfunction GreatApp () {\n     return <GreatestEditor />\n}\n\nexport default withExtraGreatness ( GreatApp )",
            type: 'code-block',
            depth: 0,
            inlineStyleRanges: [
              { offset: 0, length: 69, style: 'CODE' },
              { offset: 71, length: 22, style: 'CODE' },
              { offset: 94, length: 30, style: 'CODE' },
              { offset: 125, length: 1, style: 'CODE' },
              { offset: 128, length: 46, style: 'CODE' },
            ],
            entityRanges: [],
            data: { language: 'jsx' },
          },
        ],
        entityMap: {},
      })
    ),
  theNestedMess: () =>
    EditorState.createWithContent(
      convertFromRaw({
        blocks: [
          {
            key: 'foavt',
            text: 'The Nested Mess :|',
            type: 'header-one',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: 'bac52',
            text: 'Item number one',
            type: 'ordered-list-item',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: '958d8',
            text: 'Item number two',
            type: 'ordered-list-item',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: 'bpslv',
            text: 'Item number three',
            type: 'ordered-list-item',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: '1rah',
            text: 'Item number three one',
            type: 'ordered-list-item',
            depth: 1,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: 'apa19',
            text: 'item number three two',
            type: 'ordered-list-item',
            depth: 1,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: '88ddo',
            text: 'Item number three two one',
            type: 'ordered-list-item',
            depth: 2,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: '8iiia',
            text: 'item number three two two',
            type: 'ordered-list-item',
            depth: 2,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: 'a0dlv',
            text: 'Item number three two three',
            type: 'ordered-list-item',
            depth: 2,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: '6smp9',
            text: 'item number three three',
            type: 'ordered-list-item',
            depth: 1,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: '55l3c',
            text: 'Item number four',
            type: 'ordered-list-item',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: 'afpgh',
            text: 'Item number four one',
            type: 'ordered-list-item',
            depth: 1,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: 'vonq',
            text: 'Item number four one one',
            type: 'ordered-list-item',
            depth: 2,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: '20c8v',
            text: 'Item number four one one one',
            type: 'ordered-list-item',
            depth: 3,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: 'djdpl',
            text: 'Item number four two',
            type: 'ordered-list-item',
            depth: 1,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: 'sm9g',
            text: 'Item number five',
            type: 'ordered-list-item',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: 'febm1',
            text: 'Item number five one',
            type: 'ordered-list-item',
            depth: 1,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: '6hs7j',
            text: 'Item number six',
            type: 'ordered-list-item',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: '9gss4',
            text: 'Unordered Lvl.1',
            type: 'unordered-list-item',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: '4up7a',
            text: 'Unordered Lvl.2',
            type: 'unordered-list-item',
            depth: 1,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: '4ng76',
            text: 'Unordered Lvl.3',
            type: 'unordered-list-item',
            depth: 2,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
        ],
        entityMap: {},
      })
    ),
};

const dict = {
  en: {
    'plugins.paragraph.unstyled': 'Paragraph',
    'plugins.code-block.code-block': 'Code Block',
    'plugins.headings.header-one': 'Heading 1',
    'plugins.headings.header-two': 'Heading 2',
    'plugins.headings.header-three': 'Heading 3',
    'plugins.lists.unordered-list-item': 'Unordered List',
    'plugins.lists.ordered-list-item': 'Ordered List',
    'plugins.checkable-list.checkable-list-item': 'Checkable List',
    'plugins.accordion.accordion': 'Accordion',
    'plugins.quote.blockquote': 'Quotation',
  },
  fa: {
    'plugins.paragraph.unstyled': 'پاراگراف',
    'plugins.code-block.code-block': 'بلوک کد',
    'plugins.headings.header-one': 'عنوان اصلی',
    'plugins.headings.header-two': 'عنوان',
    'plugins.headings.header-three': 'زیرعنوان',
    'plugins.lists.unordered-list-item': 'لیست بدون ترتیب',
    'plugins.lists.ordered-list-item': 'لیست ترتیبی',
    'plugins.checkable-list.checkable-list-item': 'لیست تیکی؟',
    'plugins.accordion.accordion': 'جمشو؟!',
    'plugins.quote.blockquote': 'نقل قول',
  },
};

function BE() {
  const [editorState, setEditorState] = useState(
    getInitialEditorState('empty')
  );
  console.log('@#%#@$@##%@#$@#$@#$');

  const editorRef = useRef();
  useLayoutEffect(
    () => void setImmediate(() => editorRef.current?.focus()),
    []
  );

  // useAutoSave ( editorState, changes => console.log (
  //     ...[ 'updatedBlocks', 'createdBlocks', 'removedBlocks' ].map (
  //         key => changes [ key ].map ( ( _, key ) => key ).toArray ()
  //     )
  // ), 1000 )

  return (
    <>
      <BlockEditor
        ref={editorRef}
        editorState={editorState}
        onChange={setEditorState}
        dict={dict}
        lang={'en'}
        dir={'ltr'}
        plugins={plugins}
        styles={defaultTheme}
        portalNode={document.getElementById('block-editor-portal')}
        debugMode={false}
        readOnly={false}
        textarea={false}
      />
    </>
  );
}
