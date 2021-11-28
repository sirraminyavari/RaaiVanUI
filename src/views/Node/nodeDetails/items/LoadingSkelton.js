import React from 'react';
import LoadParagraph from 'components/LoadParagraph/LoadParagraph';
import styled from 'styled-components';
import LoadReactangle from 'components/LoadRectangle/LoadReactangle';

const LoadingSkelton = () => {
  return (
    <Container>
      <LoadReactangle height={50} width={1000} />
    </Container>
  );
};

export default LoadingSkelton;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;
const LongRectangle = styled.div`
  background-color: green;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2rem;
  width: 10rem;
  border-radius: 2rem;
`;
