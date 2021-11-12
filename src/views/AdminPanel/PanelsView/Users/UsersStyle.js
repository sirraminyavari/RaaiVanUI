import styled from 'styled-components';
import Breadcrumb from '../../../../components/Breadcrumb/Breadcrumb';
import Heading from '../../../../components/Heading/Heading';

export const UserManagementContainer = styled.div`
  direction: ${({ rtl }) => (rtl ? 'rtl' : 'ltr')};
  padding: 1rem;
`;

export const BreadCrumbWrapper = styled(Breadcrumb)`
  position: absolute;
  top: 1.5rem;
  ${({ rtl }) => (rtl ? 'right: 1.5rem;' : 'left: 1.5rem;')}
`;

export const HeadingWrapper = styled(Heading).attrs({
  type: 'H1',
})`
  font-size: 1.375rem;
`;

export const UserManagementContentCard = styled.div`
  position: relative;
  box-shadow: 0.06rem 0.29rem 0.98rem #0000001f;
  border-radius: 0.625rem;
  padding: 4rem 1.5rem 1.5rem 1.5rem;
  background-color: var(--rv-gray-color-light);
`;

export const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2.44rem;
  gap: 0.5rem;
`;
