import styled from 'styled-components';
import { CV_DISTANT, CV_GRAY_LIGHT, CV_WHITE } from 'constant/CssVariables';
import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import Heading from 'components/Heading/Heading';

export const RoleSelectorContainer = styled.div`
  flex: 0 0 29rem;
  box-shadow: 1px 5px 15px #0000001f;
  border-radius: 0.5rem;
  background-color: ${CV_GRAY_LIGHT};
  height: calc(100vh - 8rem);
  overflow: hidden;
`;

export const PermissionSelectorContainer = styled.div`
  flex: 1;
  box-shadow: 1px 5px 15px #0000001f;
  border-radius: 0.5rem;
  background-color: ${CV_GRAY_LIGHT};
  height: calc(100vh - 8rem);
  position: relative;
  padding: 4rem 2.7rem 1rem 1rem;
  overflow: hidden;
`;
export const PermissionContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  padding: 1rem;
  direction: ${({ rtl }) => (rtl ? 'rtl' : 'ltr')};
`;

export const BreadCrumbWrapper = styled(Breadcrumb)`
  position: absolute;
  top: 1.5rem;
  ${({ rtl }) => (rtl ? 'right: 2.7rem;' : 'left: 2.7rem;')}
`;
export const HeadingWrapper = styled(Heading).attrs({
  type: 'H1',
})`
  font-size: 1.375rem;
`;
export const RoleSearchBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 3rem;
  background-color: ${CV_WHITE};
  border-radius: 0.625rem;
  padding: 0 0.75rem;
  color: ${CV_DISTANT};
  border: 1px solid ${CV_DISTANT};
`;

export const RoleInput = styled.input`
  outline: none;
  border: none;
  flex: 1;

  &::placeholder {
    color: ${CV_DISTANT};
    font-size: 0.8rem;
    font-weight: 500;
  }
`;
