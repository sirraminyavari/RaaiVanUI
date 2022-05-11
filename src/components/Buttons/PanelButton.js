import styled from 'styled-components';
import { BO_RADIUS_HALF } from 'constant/constants';
import {
  CV_DISTANT,
  CV_GRAY,
  TCV_DEFAULT,
  TCV_VERY_TRANSPARENT,
} from 'constant/CssVariables';
import classNames from 'classnames';
import CheckCircleFilled from 'components/Icons/CheckIcons/CheckCircleFilled';

/**
 * @component - A squared Panel Button
 * @param {React.ButtonHTMLAttributes} props
 * @param {boolean} [props.active=false] - sets the toggle effect
 * @param {boolean} [props.secondary=false] - sets the secondary (Gray-ish) color
 * @param {boolean} [props.grayScale=false] - sets image/svg filter to grayScale on default state and normal color on hover/active state
 * @return {JSX.Element}
 */
function PanelButton({
  children,
  active,
  secondary,
  grayScale,
  className,
  checked,
  ...restProps
}) {
  return (
    <StyledPanelButton
      className={classNames(
        grayScale && 'grayScale',
        secondary && 'secondary',
        active && 'active',
        className
      )}
      {...restProps}
    >
      {checked && (
        <StyledPanelButtonCheckBox>
          <CheckCircleFilled />
        </StyledPanelButtonCheckBox>
      )}
      {children}
    </StyledPanelButton>
  );
}
const StyledPanelButtonCheckBox = styled.div`
  font-size: 1.5rem;
  position: absolute;
  inset-block-start: 0.6rem;
  inset-inline-start: 0.6rem;
`;
const StyledPanelButton = styled.button.attrs({
  className: BO_RADIUS_HALF,
})`
  cursor: pointer;
  padding: 0.5rem;
  margin: 0.5rem;
  width: 10rem;
  max-width: 100%;
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
  transition: border 0.3s ease-out, color 0.3s, filter 0.3s;
  box-sizing: border-box;
  position: relative;
  &.secondary {
    color: ${CV_GRAY};
  }
  &.grayScale {
    & > svg,
    & > img {
      filter: grayscale(1);
    }
  }

  & > svg,
  & > img {
    font-size: 4rem;
    margin-block-start: 1rem;
    margin-block-end: 2rem;
    transition: filter 0.3s;
  }
  &:hover {
    border-color: ${CV_DISTANT};
  }
  &:focus,
  &.active {
    border-width: 0.15rem;
    box-shadow: 1px 3px 20px ${TCV_VERY_TRANSPARENT};
    color: ${TCV_DEFAULT};
    border-color: ${TCV_DEFAULT};
    &.grayScale {
      & > svg,
      & > img {
        filter: grayscale(0);
      }
    }
  }
`;

PanelButton.displayName = 'PanelButton';
export default PanelButton;