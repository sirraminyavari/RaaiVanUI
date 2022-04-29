import { CV_DISTANT } from 'constant/CssVariables';
import React from 'react';
import styled from 'styled-components';
import FormCell from '../../FormCell';

const { RV_RTL } = window;
const SeparatorField = ({
  value,
  decodeInfo,
  decodeTitle,
  onAnyFieldChanged,
  elementId,
  type,
  ...props
}) => {
  return (
    <Maintainer>
      <Vertical />
      <FormCell title={decodeTitle} {...props}></FormCell>
    </Maintainer>
  );
};
export default SeparatorField;

const Maintainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 3rem;
`;
const Vertical = styled.div`
  width: 0.25rem;
  border-radius: 0.125rem;
  background-color: ${CV_DISTANT};
  height: 95%;
  margin: ${RV_RTL ? '0 0rem 0 1rem' : '0 1rem 0 0rem'};
`;
