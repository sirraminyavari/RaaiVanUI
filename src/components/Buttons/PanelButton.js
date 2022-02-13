import styled from 'styled-components';
import { BO_RADIUS_HALF } from 'constant/constants';
import {
  CV_DISTANT,
  TCV_DEFAULT,
  TCV_VERY_TRANSPARENT,
} from 'constant/CssVariables';

/**
 * @component - A squared Panel Button
 * @param {React.ButtonHTMLAttributes} props
 * @return {JSX.Element}
 */
function PanelButton({ children, ...restProps }) {
  return <StyledPanelButton {...restProps}>{children}</StyledPanelButton>;
}
const StyledPanelButton = styled.button.attrs({
  className: BO_RADIUS_HALF,
})`
  cursor: pointer;
  padding: 1rem;
  margin: 0.5rem;
  width: clamp(6rem, 100%, 12rem);
  aspect-ratio: 1;
  flex-shrink: 0;
  flex-grow: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: ${TCV_DEFAULT};
  font-size: 0.8rem;
  border: 1px solid transparent;
  transition: border 0.3s ease-out;
  box-sizing: border-box;

  & > svg {
    font-size: 4rem;
    margin-block-start: 2rem;
    margin-block-end: 3rem;
  }
  &:hover {
    border-color: ${CV_DISTANT};
  }
  &:focus {
    border-width: 0.15rem;
    box-shadow: 1px 3px 20px ${TCV_VERY_TRANSPARENT};
    border-color: ${TCV_DEFAULT};
  }
`;

PanelButton.displayName = 'PanelButton';
export default PanelButton;
