import { Emoji } from './EmojiPickerStyles';
import people from '../data/people.json';
import animals from '../data/animals.json';
import activity from '../data/activity.json';
import objects from '../data/objects.json';
import food from '../data/food.json';
import symbols from '../data/symbols.json';
import flags from '../data/flags.json';
import travel from '../data/travel.json';
import { getUUID } from 'helpers/helpers';

export const getEmojiType = () => {
  return [
    {
      key: 'people',
    },
    {
      key: 'animals',
    },
    {
      key: 'food',
    },
    {
      key: 'activity',
    },
    {
      key: 'travel',
    },
    {
      key: 'objects',
    },
    {
      key: 'symbols',
    },
    {
      key: 'flags',
    },
  ];
};

export const getEmojis = async ({ key }) => {
  const _emojis = emojiList().filter(({ category }) => category === key);

  const array = [];
  for (const item of _emojis) {
    const { title } = item;
    const { default: src } = await import(`assets/images/emojis/${title}`);

    array.push({
      id: getUUID(),
      title,
      src: <Emoji src={src} width="16px" height="16px" />,
    });
  }
  return array;
};

export const emojiList = () => {
  return [
    ...animals,
    ...food,
    ...people,
    ...activity,
    ...objects,
    ...symbols,
    ...flags,
    ...travel,
  ];
};
