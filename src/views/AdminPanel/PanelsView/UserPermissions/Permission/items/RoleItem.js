import styled from 'styled-components';

const RoleItem = ({ IconURL, RoleID, RoleName, RoleType }) => {
  return <CardContainer>{RoleName}</CardContainer>;
};

const CardContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4.5rem;
  border-radius: 0.81rem;
`;
export default RoleItem;
