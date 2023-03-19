import useLocalStorage from 'hooks/useLocalStorage';
import { createContext, useContext, useState } from 'react';

const EmojiContext = createContext({});

export const useEmojiContext = () => {
  const context = useContext(EmojiContext);
  return context;
};

export const EmojiContextProvider = ({ onSelect, children }) => {
  const [recentEmojis, setRecentEmojis] = useLocalStorage(
    'RESENT_USED_EMOJIS',
    []
  );
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);

  const handleCategorySelect = (index) => {
    setSelectedCategoryIndex(index);
  };

  const handleEmojiSelect = (emoji) => {
    onSelect && onSelect(emoji);
  };

  return (
    <EmojiContext.Provider
      value={{
        selectedCategoryIndex,
        handleCategorySelect,
        handleEmojiSelect,
        recentEmojis,
        setRecentEmojis,
      }}
    >
      {children}
    </EmojiContext.Provider>
  );
};
