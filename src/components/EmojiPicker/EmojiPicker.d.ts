import { FC } from 'react';

export interface IEmojiPickerProps {
  onEmojiSelect?: (emoji: string) => void;
}

declare const EmojiPicker: FC<IEmojiPickerProps>;
