import styled from 'styled-components';

export const UserManagementContainer = styled.div`
  direction: ${({ rtl }) => (rtl ? 'rtl' : 'ltr')};
  padding: 1rem;
`;
