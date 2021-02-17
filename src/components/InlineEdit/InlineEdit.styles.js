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

const hiddenCss = css`
  display: none;
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

const getSpanTextCss = ({ isInputActive }) => {
  if (!isInputActive) {
    return textActiveCss;
  } else {
    return hiddenCss;
  }
};

const getInputCss = ({ isInputActive }) => {
  if (isInputActive) {
    return inputActiveCss;
  } else {
    return hiddenCss;
  }
};

export const SpanText = styled.span`
  ${getSpanTextCss}
`;

export const Input = styled.input`
  ${getInputCss}
`;
