import React from 'react';
import styled from 'styled-components';
import { TCV_DEFAULT, CV_DISTANT, CV_GRAY } from 'constant/CssVariables';
import { BO_RADIUS_CIRCLE } from 'constant/constants';

//TODO Move to the `src/components/...` folder
/**
 * @component - Stepper component
 * @param {object} props
 * @param {number} props.stepsCount - Sets the number of steps for Stepper component to render step buttons
 * @param {number} props.activeStep - Sets current active status for target step button (Starting from 1)
 * @param {React.ButtonHTMLAttributes[]} props.stepArguments - Accepts an array of objects to pass to the step buttons e.g: `stepArguments[0]` will be passed as the rest props to the first step button
 * @example
 * ```jsx
 * const stepperButtonArgs = [
 *  {
 *    className:"some-classes",
 *    onClick:()=>alert("first stepper clicked")
 *  },
 *  // omitted for brevity ...
 * ]
 *  (...)
 * <Stepper stepsCount={5} activeStep={1} /> // renders five step button that the first one is in "active" status
 * <Stepper stepsCount={5} activeStep={1} />
 * ```
 * @return {JSX.Element}
 */
function Stepper({ stepsCount, activeStep, stepArguments }) {
  return (
    <StyledStepperIndicatorWrapper>
      {Array(+stepsCount)
        .fill()
        .map((_, idx) => {
          return (
            <StyledStepperIndicator
              active={+activeStep === idx + 1}
              passed={+activeStep > idx + 1}
              disabled={+activeStep < idx + 1}
              {...(stepArguments[idx] ? stepArguments[idx] : {})}
            />
          );
        })
        .reverse()}
    </StyledStepperIndicatorWrapper>
  );
}

Stepper.defaultProps = {
  stepArguments: [],
};
export default Stepper;

const StyledStepperIndicatorWrapper = styled.div`
  display: inline-block;
`;
const StyledStepperIndicator = styled.button.attrs({
  className: BO_RADIUS_CIRCLE,
})`
  width: 1.1rem;
  margin: 0.5rem;
  aspect-ratio: 1;
  transition: background-color 0.3s, transform 0.3s;
  ${({ active }) =>
    active
      ? `background-color: ${TCV_DEFAULT};`
      : `
    background-color: ${CV_DISTANT};
  transform:scale(0.5);
  `}
  ${({ passed }) => passed && `background-color: ${CV_GRAY};`}
`;
