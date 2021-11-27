import styled from 'styled-components';
import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import Heading from 'components/Heading/Heading';
import { CV_RED, CV_WHITE } from 'constant/CssVariables';

export const UserManagementContainer = styled.div`
  direction: ${({ rtl }) => (rtl ? 'rtl' : 'ltr')};
  padding: 1rem;
`;

export const BreadCrumbWrapper = styled(Breadcrumb)`
  position: absolute;
  top: 1.5rem;
  ${({ rtl }) => (rtl ? 'right: 1.5rem;' : 'left: 1.5rem;')}
`;

export const ReturnButtonWrapper = styled.div`
  position: absolute;
  top: 1.5rem;
  ${({ rtl }) => (rtl ? 'left: 1.5rem;' : 'right: 1.5rem;')}
`;

export const ReturnButton = styled.button`
  width: 9.7rem;
  outline: none;
  background-color: ${CV_WHITE};
  color: ${CV_RED};
  border: 1px solid ${CV_WHITE};
  height: 2rem;
  line-height: 2rem;
  text-align: center;
  font-size: 0.8rem;
  font-weight: 400;
  border-radius: 0.5rem;
  transition: all 0.3s ease-out;

  &:hover {
    border: 1px solid ${CV_RED};
  }
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
  min-height: calc(100vh - 8rem);

  .modal-title-bar {
    height: 4.5rem;
  }

  .hidden-title-bar {
    display: none;
  }

  .modal-content {
    padding: 0 !important;
  }
`;

export const ContentWrapper = styled.div`
  width: 100%;
`;

export const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2.44rem;
  gap: 0.5rem;
`;
