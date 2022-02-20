import styled from 'styled-components';
import { CV_WHITE, TCV_DEFAULT, TCV_VERYWARM } from 'constant/CssVariables';

export const InvitationTypeButton = ({ render, children, ...props }) => {
  return (
    <ButtonContainer {...props}>
      {render}
      <div>{children}</div>
    </ButtonContainer>
  );
};
const ButtonContainer = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  height: 3rem;
  width: 16rem;
  color: ${({ selected }) => (selected ? TCV_VERYWARM : TCV_DEFAULT)};
  background-color: ${CV_WHITE};
  border: 1px solid ${({ selected }) => (selected ? TCV_VERYWARM : CV_WHITE)};
  padding: 0 1rem;
  border-radius: 0.8rem;
  gap: 0.5rem;
  cursor: pointer;
  transition: border 0.3s ease-out;
  user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  -moz-user-select: none;

  &:hover {
    border: 1px solid ${({ selected }) => !selected && TCV_DEFAULT};
  }

  &:disabled {
    color: ${({ selected }) => (selected ? TCV_VERYWARM : TCV_DEFAULT)};
    border: 1px solid ${({ selected }) => (selected ? TCV_VERYWARM : CV_WHITE)};
  }
`;
export default InvitationTypeButton;
