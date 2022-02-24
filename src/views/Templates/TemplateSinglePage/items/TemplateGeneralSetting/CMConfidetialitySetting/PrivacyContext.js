import { createContext, useContext } from 'react';

const PrivacyObjectContext = createContext({});

export const usePrivacyProvider = () => {
  const context = useContext(PrivacyObjectContext);
  return context;
};

export const PrivacyObjectProvider = ({
  users,
  groups,
  selectedUsers,
  handleUserSelect,
  selectedGroups,
  handleGroupSelect,
  setAdvancedPermissions,
  children,
}) => {
  return (
    <PrivacyObjectContext.Provider
      value={{
        users,
        groups,
        selectedUsers,
        handleUserSelect,
        selectedGroups,
        handleGroupSelect,
        setAdvancedPermissions,
      }}
    >
      {children}
    </PrivacyObjectContext.Provider>
  );
};
