import styled from 'styled-components';
import { CV_DISTANT, CV_GRAY_LIGHT } from 'constant/CssVariables';

export const PermissionContainer = styled.div`
  display: flex;
  flex-direction: ${(props) => (props?.rtl ? 'row' : 'row-reverse')};
  gap: 1.5rem;
  padding: 1rem;
`;

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
  min-height: calc(100vh - 8rem);
`;
