import { CV_DISTANT, CV_GRAY } from 'constant/CssVariables';
import React from 'react';
import styled from 'styled-components';

const FormCell = ({ children, title, iconComponent }) => {
  return (
    <Container>
      <CellName>
        {iconComponent}
        <Title>{title}</Title>
      </CellName>
      {children}
    </Container>
  );
};
export default FormCell;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 1.25rem 0 1.25rem 0;
`;
const CellName = styled.div`
  display: flex;
  flex-direction: row;
  width: 16rem;
  align-items: center;
  min-width: 17rem;
`;
const Title = styled.div`
  color: ${CV_GRAY};
  padding: 0 1rem 0 1rem;
`;
