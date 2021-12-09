import styled from 'styled-components';
import {
  CV_DISTANT,
  CV_GRAY,
  TCV_DEFAULT,
  TCV_VERY_TRANSPARENT,
  TCV_WARM,
} from 'constant/CssVariables';
import { useCallback, useContext, useMemo } from 'react';
import { PermissionContext } from '../Permissions';

const RoleItem = (props) => {
  const { IconURL, RoleID, RoleName, Permissions } = props;

  const { selectedRole, setSelectedRole } = useContext(PermissionContext);
  const selected = useMemo(() => selectedRole?.RoleID === RoleID, [
    selectedRole,
  ]);

  return (
    <CardContainer highlight={selected} onClick={(e) => setSelectedRole(props)}>
      <Title name={RoleName} thumb={IconURL} selected={selected} />
      <PermissionCountTitle
        highlight={selected}>{`${Permissions} دسترسی `}</PermissionCountTitle>
    </CardContainer>
  );
};

const Title = ({ name, thumb, selected, ...props }) => {
  return (
    <TitleContainer>
      <TitleThumb src={thumb} />
      <TitleText highlight={selected}>{name}</TitleText>
    </TitleContainer>
  );
};
const TitleContainer = styled.div`
  display: flex;
  gap: 1rem;
  height: 3rem;
`;
const TitleThumb = styled.img`
  width: 3rem;
  height: 3rem;
  border-radius: 100%;
`;
const TitleText = styled.div`
  font-weight: 500;
  font-size: 1rem;
  color: ${(props) => (props?.highlight ? TCV_DEFAULT : CV_GRAY)};
  height: 3rem;
  line-height: 3rem;
`;

/**
 * need a fix
 */
const CardContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4.5rem;
  border-radius: 0.81rem;
  background-color: ${(props) =>
    props?.highlight ? '#2B7BE40D' : 'transparent'};
  padding: 0.75rem 1rem 0.75rem 1.5rem;
  cursor: pointer;
  user-select: none;
`;
const PermissionCountTitle = styled.div`
  height: 3rem;
  line-height: 3rem;
  font-size: 0.81rem;
  color: ${(props) => (props?.highlight ? TCV_WARM : CV_DISTANT)};
`;
export default RoleItem;
