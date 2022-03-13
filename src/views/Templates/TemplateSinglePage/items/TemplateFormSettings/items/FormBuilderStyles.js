import styled from 'styled-components';
import { FLEX_RCS } from 'constant/StyledCommonCss';
import { CV_DISTANT, CV_WHITE, TCV_DEFAULT } from 'constant/CssVariables';

export const DroppableContainer = styled.div`
  margin-top: 2rem;
  height: calc(100vh - 29rem);
  width: 100%;
  overflow: scroll;
`;

export const DraggableFormObject = styled.div`
  ${FLEX_RCS};
`;

export const DraggableFormObjectHandle = styled.div`
  width: 1.5rem;
`;

export const DraggableFormObjectMainContent = styled.div`
  min-height: 9rem;
  border-radius: 0.8rem;
  border: 0.0625rem solid ${CV_DISTANT};
  flex: 1;
  margin-bottom: 1rem;
  transition: border 0.3s ease-out;
  background-color: ${CV_WHITE};
  padding: 0.5rem 1rem;

  &:hover {
    border: 0.0625rem solid ${TCV_DEFAULT};
  }
`;
