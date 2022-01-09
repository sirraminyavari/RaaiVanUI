import useWindow from 'hooks/useWindowContext';
import { createContext, useEffect, useMemo, useState } from 'react';
import { getAudience, setAudience } from '../api';
import * as Styled from './PermissionStyle';
import RoleSelectionPane from './items/RoleSelectionPane';
import PermissionSelectionPane from './items/PermissionSelectionPane';
import InfoToast from 'components/toasts/info-toast/InfoToast';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';

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
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(true);

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
    loadData();
  }, []);

  const updatePermission = (next) => {
    setAudience(type, next, permissionType).then((res) => {
      if (res.Succeed) {
        loadData();
        InfoToast({
          type: 'info',
          autoClose: true,
          message: `عملیات موفقیت آمیز بود.`,
        });
      }
    });
  };

  const loadData = () => {
    getAudience(objectIDs, type, GlobalUtilities, sections).then(
      ({ confidentialityLevels, permissions, roles }) => {
        setPermission(permissions);
        setRoles(roles);
        setConfidentialityLevels(confidentialityLevels);

        const selectedRoleExist = roles.find(
          (x) => x.RoleID === selectedRole?.RoleID
        );
        if (!selectedRoleExist) {
          setSelectedRole(
            roles?.filter((x) => x?.RoleType === 'User')[0] || {}
          );
        }
        setLoading(false);
      }
    );
  };

  const breadCrumbItems = [
    {
      id: 1,
      title: RVDic?.TeamManagement,
      linkTo: '',
    },
    {
      id: 2,
      title: RVDic?.UserManagement,
      linkTo: '',
    },
    {
      id: 3,
      title: RVDic?.Permissions,
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
        updatePermission,
        setRoles,
      }}>
      <Styled.PermissionContainer rtl={RV_RTL}>
        <Styled.RoleSelectorContainer>
          <RoleSelectionPane />
        </Styled.RoleSelectorContainer>

        <Styled.PermissionSelectorContainer>
          <Styled.BreadCrumbWrapper items={breadCrumbItems} rtl={RV_RTL} />
          {!loading ? (
            <>
              <Styled.HeadingWrapper>{`${RVDic?.Permissions} (${selectedRole?.RoleName})`}</Styled.HeadingWrapper>

              <PermissionSelectionPane sections={sections} />
            </>
          ) : (
            <LogoLoader />
          )}
        </Styled.PermissionSelectorContainer>
      </Styled.PermissionContainer>
    </PermissionContext.Provider>
  );
};
export default Permissions;
