import { EmojiContextProvider } from './EmojiContext';
import EmojiPickerContent from './items/EmojiPickerContent';

const EmojiPicker = ({ onEmojiSelect }) => {
  return (
    <EmojiContextProvider onSelect={onEmojiSelect}>
      <EmojiPickerContent />
    </EmojiContextProvider>
  );
};
export default EmojiPicker;
