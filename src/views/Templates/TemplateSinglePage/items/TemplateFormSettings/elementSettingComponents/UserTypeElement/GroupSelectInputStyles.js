import styled from 'styled-components';
import { FLEX_RCB, FLEX_RCS, FLEX_RSB } from 'constant/StyledCommonCss';
import { CV_DISTANT } from 'constant/CssVariables';

export const ObjectItemContainer = styled.div`
  ${FLEX_RCB};
  height: 2rem;
  margin: 0.7rem 0;
`;

export const ObjectListWrapper = styled.div`
  width: 100%;
  height: 19rem;
  padding: 1rem;
  overflow: auto;
`;

export const UserInputContainer = styled.div`
  ${FLEX_RSB};
  max-width: 30rem;
  width: 100%;
  border-radius: 0.3rem;
  border: 0.0625rem solid ${CV_DISTANT};
  cursor: text;
  min-height: 3rem;
`;

export const ModalActionBar = styled.div`
  ${FLEX_RCS};
  gap: 1rem;
`;

export const buttonStyles = {
  height: '3rem',
  width: '7.5rem',
};
