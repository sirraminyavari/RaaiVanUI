import styled from 'styled-components';
import Accordion from 'components/Accordion/Accordion';
import {
  CV_GRAY,
  TCV_VERY_TRANSPARENT_WARM,
  TCV_WARM,
} from 'constant/CssVariables';
import AnimatedInput from 'components/Inputs/AnimatedInput';
import Button from 'components/Buttons/Button';

export const WorkflowFieldAccordion = styled(Accordion)`
  margin: 0;
  padding: 0;
  width: 100%;
`;
WorkflowFieldAccordion.displayName = 'WorkflowFieldAccordion';

export const WorkflowFieldAccordionLabelContainer = styled.div`
  font-size: 1rem;
  user-select: none;
  padding-block: 0.5rem;
  // padding-inline: 1rem;
  color: ${CV_GRAY};
`;
WorkflowFieldAccordionLabelContainer.displayName =
  'WorkflowFieldAccordionLabelContainer';

export const WorkflowFieldAccordionLabelStatus = styled.span`
  font-weight: 700;
  padding-inline: 1rem;
  color: ${TCV_WARM};
`;
WorkflowFieldAccordionLabelStatus.displayName =
  'WorkflowFieldAccordionLabelStatus';

export const WorkflowFieldContainer = styled.div`
  padding-inline: 1rem;
  padding-block: 0.5rem;
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
`;
WorkflowFieldContainer.displayName = 'WorkflowFieldContainer';

export const WorkflowFieldInput = styled(AnimatedInput)`
  max-width: 100%;
  input {
    width: 20rem;
  }
`;
WorkflowFieldInput.displayName = 'WorkflowFieldInput';

export const WorkflowFieldButton = styled(Button).attrs({
  type: 'primary',
})`
  width: 100%;
  margin-inline: 2rem;
`;
WorkflowFieldButton.displayName = 'WorkflowFieldButton';

export const WorkflowFieldLabel = styled.div`
  width: 100%;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  font-size: 1rem;
  margin-block-start: 1rem;
  color: ${CV_GRAY};

  & > span {
    width: 100%;
    height: 0.1rem;
    background-color: ${TCV_VERY_TRANSPARENT_WARM};
    inset-block-start: 50%;
    inset-inline-start: 0;
    border-radius: 0.5rem;
    display: block;
  }
`;
WorkflowFieldLabel.displayName = 'WorkflowFieldLabel';

export const WorkflowFieldItemContainer = styled.div`
  border-style: solid;
  border-width: 0.05rem;
  border-color: ${TCV_VERY_TRANSPARENT_WARM};
  padding-inline: 0.5rem;
  border-radius: 0.5rem;
  padding-block: 0.5rem;
  display: flex;
  flex-direction: column;
  column-gap: 0.5rem;
`;
WorkflowFieldItemContainer.displayName = 'WorkflowFieldItemContainer';

export const WorkflowFieldItemLabelContainer = styled.div<{
  actionsOnly?: boolean;
}>`
  margin-inline: 0.4rem;
  min-width: 1.5rem;
  font-size: 1rem;
  color: ${CV_GRAY};
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${({ actionsOnly }) =>
    actionsOnly &&
    `padding-inline-start: 3.25rem;gap:0.5rem;justify-content: flex-end;`}
`;
WorkflowFieldItemLabelContainer.displayName = 'WorkflowFieldItemLabelContainer';

export const WorkflowFieldItemLabelTitle = styled.div`
  font-size: 0.7rem;
  // padding-block: 0.5rem;
  padding-inline: 0.5rem;
  color: ${CV_GRAY};
  display: flex;
  flex-direction: column;
  font-weight: 700;
  row-gap: 0.4rem;
  align-items: flex-start;
`;
WorkflowFieldItemLabelTitle.displayName = 'WorkflowFieldItemLabelTitle';

export const WorkflowFieldItemLabelTitleDate = styled.div`
  font-size: 0.7rem;
  font-weight: 500;
  color: ${TCV_VERY_TRANSPARENT_WARM};
`;
WorkflowFieldItemLabelTitleDate.displayName = 'WorkflowFieldItemLabelTitleDate';

export const WorkflowFieldItemContent = styled.div<{ muted?: boolean }>`
  font-size: 0.9rem;
  padding-block: 1rem;
  padding-inline: 0.75rem;
  ${({ muted }) =>
    muted && ` color: ${TCV_VERY_TRANSPARENT_WARM};text-align:center;`}

  font-weight: 500;
`;
WorkflowFieldItemContent.displayName = 'WorkflowFieldItemContent';

export const WorkflowFieldItemActionsContainer = styled.div`
  // padding-inline: 1rem;
  padding-block: 0.5rem;
  display: flex;
  column-gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
`;
WorkflowFieldItemActionsContainer.displayName =
  'WorkflowFieldItemActionsContainer';

export const WorkflowFieldItemButton = styled(Button).attrs({
  type: 'primary-o',
})`
  font-size: 0.7rem;
  padding-block: 0.2rem;
  padding-inline: 0.4rem;
`;
WorkflowFieldItemButton.displayName = 'WorkflowFieldItemButton';
