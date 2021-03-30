import styled, { css } from 'styled-components';
const { RV_Float } = window;

const activeCss = css`
  font: inherit;
  color: inherit;
  text-align: inherit;
  padding: 0;
  background: none;
  border: none;
  outline: none;
`;

const textActiveCss = css`
  ${activeCss}
  cursor: pointer;
`;

const inputActiveCss = css`
  ${activeCss}
  padding: 0.3rem;
  border-bottom: 0.15rem solid #fff;
  text-align: ${RV_Float};
`;

export const SpanText = styled.span`
  ${textActiveCss}
`;

export const Input = styled.input`
  ${inputActiveCss}
`;
