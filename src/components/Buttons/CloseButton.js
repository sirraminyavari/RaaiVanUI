import styled from 'styled-components';
import { BO_RADIUS_CIRCLE } from 'constant/constants';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';

/**
 * @component - Circular exit button
 * @param {Omit<React.ButtonHTMLAttributes,"children">} props
 * @return {JSX.Element}
 */
function CloseButton(props) {
  return (
    <ExitButton {...props}>
      <CloseIcon />
    </ExitButton>
  );
}

CloseButton.displayName = 'CloseButton';
export default CloseButton;

const ExitButton = styled.button.attrs({ className: `${BO_RADIUS_CIRCLE}` })`
  flex: 0 0 auto;
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: center;
  font-weight: bolder;
  color: red;
  width: 1.5rem;
  height: 1.5rem;
  font-size: 0.8rem;

  &:hover {
    color: white;
    background-color: red;
  }
`;
