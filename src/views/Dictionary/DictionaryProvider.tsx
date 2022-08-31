import React, { useContext, useState } from 'react';
import { ListData } from './items/_listData';

const DictionaryContext = React.createContext<any>({});

export const useDictionaryContext = () => {
  const context = useContext(DictionaryContext);
  return context;
};

const DictionaryProvider = ({ children }: any) => {
  const [selected, setSelected] = useState<any>();
  return (
    <DictionaryContext.Provider
      value={{
        selected,
        setSelected,
        list: ListData,
      }}
    >
      {children}
    </DictionaryContext.Provider>
  );
};
export default DictionaryProvider;
