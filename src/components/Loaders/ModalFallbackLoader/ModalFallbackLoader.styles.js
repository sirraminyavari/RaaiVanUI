import { FLEX_CCC } from 'constant/StyledCommonCss';
import styled from 'styled-components';

export const ModalFallbackWrapper = styled.div`
  .modal-fallback-title-container {
    display: none;
  }

  .modal-fallback-content {
    background-color: transparent;
    height: calc(100vh - 5rem);
    ${FLEX_CCC}
  }
`;
