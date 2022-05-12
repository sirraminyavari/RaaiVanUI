import { EmojiContextProvider } from './EmojiContext';
import EmojiPickerContent from './items/EmojiPickerContent';

const EmojiPicker = () => {
  return (
    <EmojiContextProvider>
      <EmojiPickerContent />
    </EmojiContextProvider>
  );
};
export default EmojiPicker;
