import { createContext, useContext } from 'react';

const PrivacyObjectContext = createContext({});

export const usePrivacyProvider = () => {
  const context = useContext(PrivacyObjectContext);
  return context;
};

export const PrivacyObjectProvider = ({
  users,
  groups,
  audience,
  selectedUsers,
  handleUserSelect,
  selectedGroups,
  handleGroupSelect,
  handlePermissionTypeSelection,
  handleAudienceSelection,
  children,
}) => {
  return (
    <PrivacyObjectContext.Provider
      value={{
        users,
        groups,
        audience,
        selectedUsers,
        handleUserSelect,
        selectedGroups,
        handleGroupSelect,
        handlePermissionTypeSelection,
        handleAudienceSelection,
      }}
    >
      {children}
    </PrivacyObjectContext.Provider>
  );
};
