import { createContext, useContext, useState } from 'react';

const EmojiContext = createContext({});

export const useEmojiContext = () => {
  const context = useContext(EmojiContext);
  return context;
};

export const EmojiContextProvider = ({ children }) => {
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(3);

  const handleCategorySelect = (index) => {
    setSelectedCategoryIndex(index);
  };

  return (
    <EmojiContext.Provider
      value={{
        selectedCategoryIndex,
        handleCategorySelect,
      }}
    >
      {children}
    </EmojiContext.Provider>
  );
};
