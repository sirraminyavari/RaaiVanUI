import { BO_RADIUS_HALF } from 'constant/constants';
import {
  CV_DISTANT,
  TCV_DEFAULT,
  TCV_VERY_TRANSPARENT,
} from 'constant/CssVariables';
import styled from 'styled-components';

export const OnboardingTeamWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: calc(100vh - 20rem);
  width: 100%;
  padding: 1rem;
  & > * {
    flex-shrink: 0;
  }
`;
OnboardingTeamWrapper.displayName = 'OnboardingTeamWrapper';

export const OnboardingTeamFlatPanelButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
`;
OnboardingTeamFlatPanelButtonGroup.displayName =
  'OnboardingTeamFlatPanelButtonGroup';

export const OnboardingTeamFlatPanelButton = styled.button.attrs({
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
OnboardingTeamFlatPanelButton.displayName = 'OnboardingTeamFlatPanelButton';
