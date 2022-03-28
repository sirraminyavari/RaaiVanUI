import { Emoji } from './EmojiPickerStyles';

export const getEmojiType = () => {
  return [
    {
      key: 'smileys',
      total: 432,
    },
    {
      key: 'animals',
      total: 209,
    },
    {
      key: 'objects',
      total: 192,
    },
    {
      key: 'activity',
      total: 185,
    },
    {
      key: 'buildings',
      total: 100,
    },
    {
      key: 'people',
      total: 173,
    },
    {
      key: 'nature',
      total: 168,
    },
    {
      key: 'symbols',
      total: 336,
    },
  ];
};

export const getEmojis = async (type) => {
  const files = Array(type?.total)
    .fill(1)
    .map((x, i) => x + i);
  const array = [];
  for (const fileIndex of files) {
    array.push({
      id: fileIndex,
      src: (
        <Emoji
          src={
            (await import(`assets/images/emojis/${type?.key}/${fileIndex}.svg`))
              ?.default
          }
          width="16px"
          height="16px"
        />
      ),
    });
  }
  return array;
};
