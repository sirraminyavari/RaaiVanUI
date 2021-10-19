import { createContext, useState } from 'react';

export const SearchContext = createContext({});
/**
 *
 * @param children
 * @return {JSX.Element}
 * @constructor
 */
const SearchProvider = ({ children }) => {
  const [advancedFilterOpen, setAdvancedFilterOpen] = useState(false);

  const toggleAdvancedFilter = () => {
    setAdvancedFilterOpen((current) => !current);
  };
  return (
    <SearchContext.Provider
      value={{
        advancedFilterOpen,
        toggleAdvancedFilter,
      }}>
      {children}
    </SearchContext.Provider>
  );
};
export default SearchProvider;
