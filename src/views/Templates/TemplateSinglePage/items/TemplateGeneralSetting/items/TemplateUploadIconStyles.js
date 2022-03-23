import styled from 'styled-components';
import { FLEX_CCC } from 'constant/StyledCommonCss';
import { CV_RED, CV_WHITE, TCV_DEFAULT } from 'constant/CssVariables';

export const Container = styled.div`
  height: 8rem;
  width: 8rem;
`;

export const Icon = styled.div`
  position: relative;
  ${FLEX_CCC};
  height: 8rem;
  width: 8rem;
  border-radius: 100%;
  background-color: #eef1f5;
  color: ${TCV_DEFAULT};
`;

export const AddButton = styled.div`
  ${FLEX_CCC};
  height: 2rem;
  width: 2rem;
  border-radius: 100%;
  color: ${CV_WHITE};
  background-color: ${TCV_DEFAULT};
  position: absolute;
  ${({ rtl }) => (rtl ? 'left: 0' : 'right: 0;')};
  bottom: 0;
  transition: all 120ms linear;
  visibility: hidden;
  opacity: 0;
  cursor: pointer;

  ${Icon}:hover & {
    visibility: visible;
    opacity: 1;
  }
`;

export const UploaderLayout = styled.div`
  width: 25rem;
  height: 15rem;
  border-radius: 0.8rem;
  background-color: ${CV_WHITE};
  position: absolute;
  box-shadow: 1px 5px 20px #0000001f;
  top: 60%;
  right: 60%;
  z-index: 2;
`;

export const CloseButton = styled.button`
  height: 2rem;
  width: 2rem;
  outline: none;
  border: none;
  cursor: pointer;
  color: ${CV_RED};
`;
