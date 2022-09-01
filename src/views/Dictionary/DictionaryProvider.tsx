import React, { useContext, useState } from 'react';
import { ListData } from './items/_listData';

const DictionaryContext = React.createContext<any>({});

export const useDictionaryContext = () => {
  const context = useContext(DictionaryContext);
  return context;
};

const DictionaryProvider = ({ children }: any) => {
  const [selected, setSelected] = useState<any>();
  const [filteredList, setFilteredList] = useState(ListData);

  const next = () => {};

  const prev = () => {};

  const searchItem = (e) => {
    const _list = ListData?.filter((x) => x?.title.includes(e?.target?.value));
    setFilteredList(_list);
  };

  return (
    <DictionaryContext.Provider
      value={{
        selected,
        setSelected,
        next,
        prev,
        list: filteredList,
        searchItem,
      }}
    >
      {children}
    </DictionaryContext.Provider>
  );
};
export default DictionaryProvider;
