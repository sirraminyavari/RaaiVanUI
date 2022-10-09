import { BO_RADIUS_HALF } from 'constant/constants';
import {
  CV_WHITE,
  TCV_DEFAULT,
  CV_DISTANT,
  CV_GRAY,
} from 'constant/CssVariables';
import styled from 'styled-components';

export const AccordionDetails = styled.details.attrs({
  className: BO_RADIUS_HALF,
})<{
  isOpen?: boolean;
  active?: boolean;
}>`
  ${({ active }) => active && `background-color: ${CV_WHITE};`}
  padding: 0.7rem;
  margin-inline: 0.7rem;
  margin-block: 0.4rem;
  display: flex;
  align-items: center;
  transition: color 0.3s;
  & > svg {
    transition: transform 0.3s, color 0.3s;
    ${({ isOpen }) =>
      isOpen
        ? `transform: rotate(-90deg);color: ${TCV_DEFAULT};`
        : `color: ${CV_DISTANT};`}
    margin-inline-end: 0.7rem;
  }
`;
AccordionDetails.displayName = 'AccordionDetails';

export const AccordionSummary = styled.summary.attrs({
  className: BO_RADIUS_HALF,
})<{
  isOpen?: boolean;
  active?: boolean;
}>`
  ${({ isOpen }) => (isOpen ? `color: ${TCV_DEFAULT};` : `color: ${CV_GRAY};`)}
  ${({ active }) => active && `background-color: ${CV_WHITE};`}
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: color 0.3s;
  & > svg {
    transition: transform 0.3s, color 0.3s;
    ${({ isOpen }) =>
      isOpen
        ? `transform: rotate(-90deg);color: ${TCV_DEFAULT};`
        : `color: ${CV_DISTANT};`}
    margin-inline-end: 0.7rem;
  }
`;
AccordionSummary.displayName = 'AccordionSummary';
