import styled from 'styled-components';
import {
  CV_DISTANT,
  CV_FREEZED,
  CV_WHITE,
  TCV_DEFAULT,
} from 'constant/CssVariables';

const ResendInvitationButton = ({ children, ...props }) => {
  return (
    <ButtonContainer>
      <ButtonView>{children}</ButtonView>
    </ButtonContainer>
  );
};

const ButtonContainer = styled.div`
  width: 100%;
  text-align: end;
  padding-left: 1.5rem;
`;

const ButtonView = styled.button`
  outline: none;
  color: ${TCV_DEFAULT};
  background-color: ${CV_WHITE};
  border: 1px solid ${TCV_DEFAULT};
  height: 1.7rem;
  line-height: 1.7rem;
  padding: 0 1.7rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease-out;
  &:hover {
    background-color: ${CV_FREEZED};
  }
`;

export default ResendInvitationButton;
