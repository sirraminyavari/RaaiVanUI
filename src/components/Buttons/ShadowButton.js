import { CV_DISTANT, CV_WHITE, TCV_DEFAULT } from 'constant/CssVariables';
import styled from 'styled-components';
import Button from './Button';

/**
 * @description a customized version of Button component that has a shadow in active mode
 * @param {boolean} active determines if the button is active
 */
const ShadowButton = ({ active, ...props } = {}) => {
  return <StyledButton active={active} {...props} />;
};

export default ShadowButton;

const StyledButton = styled(Button).attrs({
  className: 'rv-border-white rv-circle',
})`
  box-shadow: ${({ active }) => !!active && `1px 3px 20px ${CV_DISTANT}`};
  background-color: ${CV_WHITE};
  padding: 0.5rem;
  transition: border-color 0.5s, box-shadow 0.5s, color 0.5s;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${({ active }) => (active ? TCV_DEFAULT : CV_DISTANT)};

  :hover {
    color: ${TCV_DEFAULT};
    border-color: ${CV_DISTANT};
  }
`;
