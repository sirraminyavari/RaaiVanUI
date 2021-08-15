import TextContent from 'components/TextContent/TextContent';
import { CV_DISTANT } from 'constant/CssVariables';
import styled from 'styled-components';

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const StyledTextArea = styled.textarea`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  min-height: 37px;
  height: ${({ height }) => `${height}px`};
  padding: 9px;
  margin: 0;
  overflow: hidden;
  background: transparent;
  outline: 0;
  resize: none;
  line-height: 17px;
  font-size: 1rem;
  border-color: ${CV_DISTANT};
`;

export const Beautifier = styled(TextContent)`
  position: relative;
  padding: 10px;
  color: #fff;
  white-space: pre-wrap;
  word-wrap: break-word;
  width: 100%;
  line-height: 17px;
  min-height: 17px;
`;
