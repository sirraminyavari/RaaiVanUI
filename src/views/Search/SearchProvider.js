import { createContext, useState } from 'react';

export const SearchContext = createContext({});
/**
 *
 * @param children
 * @return {JSX.Element}
 * @constructor
 */
const SearchProvider = ({ children }) => {
  const [advancedFilterOpen, SetAdvancedFilterOpen] = useState(false);
  return (
    <SearchContext.Provider
      value={{
        advancedFilterOpen,
        SetAdvancedFilterOpen,
      }}>
      {children}
    </SearchContext.Provider>
  );
};
export default SearchProvider;
