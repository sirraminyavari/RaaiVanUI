import useWindow from 'hooks/useWindowContext';
import { createContext, useEffect, useMemo, useState } from 'react';
import { getAudience } from '../api';
import * as Styled from './PermissionStyle';
import RoleSelectionPane from './items/RoleSelectionPane';

export const PermissionContext = createContext({});
const Permissions = ({
  sections,
  type,
  permissionType,
  ignoreConfidentialities,
  ...props
}) => {
  const { GlobalUtilities, RV_RTL } = useWindow();
  const items = sections.items;
  const [roles, setRoles] = useState([]);
  const [confidentialityLevels, setConfidentialityLevels] = useState([]);
  const [permissions, setPermission] = useState({});

  const objectIDs = useMemo(
    () =>
      sections
        ?.map((s) => s.Items || [])
        .flat()
        .map((itm) => itm.ID)
        .join('|') || [],
    [sections]
  );

  useEffect(() => {
    getAudience(objectIDs, type, GlobalUtilities, sections).then(
      ({ confidentialityLevels, permissions, roles }) => {
        console.log(confidentialityLevels, permissions, roles);
        setPermission(permissions);
        setRoles(roles);
        setConfidentialityLevels(confidentialityLevels);
      }
    );
  }, []);
  return (
    <PermissionContext.Provider
      value={{
        permissions,
        roles,
        confidentialityLevels,
      }}>
      <Styled.PermissionContainer rtl={RV_RTL}>
        <Styled.RoleSelectorContainer>
          <RoleSelectionPane />
        </Styled.RoleSelectorContainer>
        <Styled.PermissionSelectorContainer></Styled.PermissionSelectorContainer>
      </Styled.PermissionContainer>
    </PermissionContext.Provider>
  );
};
export default Permissions;
