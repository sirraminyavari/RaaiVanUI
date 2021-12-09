import styled from 'styled-components';
import { CV_DISTANT, CV_GRAY, CV_GRAY_DARK } from 'constant/CssVariables';
import ToggleButton from 'components/Buttons/Toggle/Toggle';
import { useContext, useEffect, useState } from 'react';
import { PermissionContext } from '../Permissions';

const PermissionItem = ({ ID, Title, ...props }) => {
  const { permissions, selectedRole, updatePermission } = useContext(
    PermissionContext
  );
  const [state, setState] = useState(false);

  useEffect(() => {
    setState(
      permissions[ID]?.Audience?.includes(selectedRole?.RoleID) ?? false
    );
  }, [selectedRole]);

  const togglePermission = (value) => {
    setState(value);
    if (value) {
      // add
      const next = {
        ...permissions,
        [ID]: {
          ...permissions[ID],
          Audience: [...permissions[ID]?.Audience, selectedRole.RoleID],
        },
      };
      updatePermission(next);
    } else {
      // remove
      const next = {
        ...permissions,
        [ID]: {
          ...permissions[ID],
          Audience: [...permissions[ID]?.Audience].filter(
            (x) => x !== selectedRole.RoleID
          ),
        },
      };
      updatePermission(next);
    }
  };

  return (
    <ItemContainer>
      <ToggleSwitchWrapper>
        <ToggleButton onToggle={togglePermission} value={state} />
      </ToggleSwitchWrapper>

      <ItemContent>
        <ItemTitle>{Title}</ItemTitle>
        <ItemSubTitle>
          {'ایجاد، ویرایش، حذف و مدیریت فرم‌های تمپلیت‌ها'}
        </ItemSubTitle>
      </ItemContent>
    </ItemContainer>
  );
};
const ItemContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 6.25rem;
  padding: 1.125rem;
  border-bottom: 1px solid ${CV_DISTANT};
`;

const ToggleSwitchWrapper = styled.div`
  display: flex;
  height: 4rem;
  flex: 0 0 6rem;
  border-left: 1px solid ${CV_DISTANT};
  justify-content: center;
  align-items: center;
`;

const ItemContent = styled.div`
  flex: 1;
  height: 4rem;
  padding: 0.3rem 2.5rem 0.3rem 0.3rem;
`;

const ItemTitle = styled.div`
  height: 1.6rem;
  line-height: 1.6rem;
  margin-bottom: 0.2rem;
  color: ${CV_GRAY_DARK};
  font-size: 1rem;
  font-weight: 500;
`;
const ItemSubTitle = styled.div`
  height: 1.6rem;
  line-height: 1.6rem;
  color: ${CV_GRAY};
  font-size: 0.81rem;
`;
export default PermissionItem;
