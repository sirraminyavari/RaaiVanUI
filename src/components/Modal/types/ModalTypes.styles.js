import { CV_GRAY_LIGHT } from 'constant/CssVariables';
import styled from 'styled-components';

export const ModalContainer = styled.div`
  .create-modal-container {
    margin-top: 35vh;
  }

  .create-modal-header {
    height: 3rem;
    min-height: 3rem;
    max-height: 3rem;
    background-color: ${CV_GRAY_LIGHT};
    padding: 0 1rem;
  }
`;

export const ModalContentWrapper = styled.div`
  width: 100%;
  padding: 0 1rem;
`;

export const ModalButtonsWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 0 1rem 0;
`;

export const ModalButtonText = styled.span`
  font-size: 0.8rem;
  font-weight: bold;
`;
