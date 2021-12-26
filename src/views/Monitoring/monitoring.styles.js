import styled from 'styled-components';

export const Container = styled.div`
  border-radius: 0.35rem;
  position: relative;
  box-shadow: 1px 5px 15px #0000001f;
  margin: 1.5rem;
  padding: 1.5rem;
`;

export const Title = styled.h1`
  font-size: 1.5rem;
  padding: 0.3rem;
`;

export const GridButton = styled.div`
  display: grid
  grid-template-columns: repeat(1, 1fr);
  grid-gap: 2px
`;

export const ExcelContainer = styled.div`
  display: flex;
  margin: 0rem 1rem;
  align-items: center;
  padding: 0.5rem;

  &:hover {
    cursor: pointer;
    border-radius: 50px;
    border: 0.01rem solid gray;
    // padding: 0.6rem;
  }
`;
