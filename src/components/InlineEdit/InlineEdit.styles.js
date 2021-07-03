import styled, { css } from 'styled-components';
import { BO_WHITE } from 'constant/Colors';
const { RV_Float } = window;

export const InlineEditContainer = styled.div`
  width: 100%;
`;

const activeCss = css`
  font: inherit;
  color: inherit;
  text-align: inherit;
  padding: 0;
  background: none;
  outline: none;
  display: inline-block;
`;

export const SpanText = styled.span`
  ${activeCss}
  border: none;
  cursor: pointer;
`;

export const Input = styled.input.attrs({
  className: BO_WHITE,
})`
  ${activeCss}
  text-align: ${RV_Float};
  width: 100%;
  border-top: 0;
  border-left: 0;
  border-right: 0;
`;
