import useWindow from 'hooks/useWindowContext';
import { createContext, useEffect, useMemo, useState } from 'react';
import { getAudience } from '../api';
import * as Styled from './PermissionStyle';
import RoleSelectionPane from './items/RoleSelectionPane';
import PermissionSelectionPane from './items/PermissionSelectionPane';

export const PermissionContext = createContext({});
const Permissions = ({
  sections,
  type,
  permissionType,
  ignoreConfidentialities,
  ...props
}) => {
  const { GlobalUtilities, RV_RTL, RVDic } = useWindow();
  const [roles, setRoles] = useState([]);
  const [confidentialityLevels, setConfidentialityLevels] = useState([]);
  const [permissions, setPermission] = useState({});
  const [selectedRole, setSelectedRole] = useState();

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
        setSelectedRole(roles?.filter((x) => x?.RoleType === 'User')[0] || {});
      }
    );
  }, []);

  const breadCrumbItems = [
    {
      id: 1,
      title: RVDic?.TeamManagement,
      linkTo: '',
    },
    {
      id: 2,
      title: 'مدیریت کاربران',
      linkTo: '',
    },
    {
      id: 3,
      title: 'دسترسی‌ها',
      linkTo: '',
    },
  ];

  return (
    <PermissionContext.Provider
      value={{
        permissions,
        roles,
        confidentialityLevels,
        selectedRole,
        setSelectedRole,
      }}>
      <Styled.PermissionContainer rtl={RV_RTL}>
        <Styled.RoleSelectorContainer>
          <RoleSelectionPane />
        </Styled.RoleSelectorContainer>

        <Styled.PermissionSelectorContainer>
          <Styled.BreadCrumbWrapper items={breadCrumbItems} rtl={RV_RTL} />
          <Styled.HeadingWrapper>{`دسترسی‌ها (${selectedRole?.RoleName})`}</Styled.HeadingWrapper>

          <PermissionSelectionPane items={sections} />
        </Styled.PermissionSelectorContainer>
      </Styled.PermissionContainer>
    </PermissionContext.Provider>
  );
};
export default Permissions;
