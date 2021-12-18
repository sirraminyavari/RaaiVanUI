import React from 'react';
import LoadParagraph from 'components/LoadParagraph/LoadParagraph';
import styled from 'styled-components';
import LoadReactangle from 'components/LoadRectangle/LoadReactangle';

const LoadingSkelton = () => {
  return <LoadReactangle height={'10rem'} width={'10rem'} />;
};

export default LoadingSkelton;

const Container = styled.div`
  display: flex;
  position: absolute;
  align-items: center;
  justify-content: center;
  border-radius: 10rem;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
`;
const Circle = styled.div`
  border-radius: 3rem;
  width: 3rem;
  height: 3rem;
  background-color: purple;
`;
const Maintainer = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  background-color: red;
  width: 10rem;
  height: 10rem;
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
