import { IButton } from './Button';
import { CV_DISTANT, CV_WHITE, TCV_DEFAULT } from 'constant/CssVariables';
import styled from 'styled-components';
import Button from './Button';

export interface IShadowButton extends IButton {
  active?: boolean;
}

/**
 * @description a customized version of Button component that has a shadow in active mode
 */
const ShadowButton = ({ active, ...props }: IShadowButton) => {
  return <StyledButton active={active} {...props} />;
};

export default ShadowButton;

const StyledButton = styled(Button).attrs({
  className: 'rv-border-white rv-circle' as string,
  isCustomButton: true as boolean,
})<IButton & { active?: boolean }>`
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
  column-gap: 0.25rem;

  :hover {
    color: ${TCV_DEFAULT};
    border-color: ${CV_DISTANT};
  }
`;
