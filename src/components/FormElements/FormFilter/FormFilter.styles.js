import styled from 'styled-components';

export const FormFilterContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #fcfcfd;
  box-shadow: 1px 3px 15px #00000026;
  border: 0.5px solid #e6f4f1;
  border-radius: 10px;
  padding: 1.5rem;
`;

export const FormFilterHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

export const FormFilterTitle = styled.div`
  font-size: 1.1rem;
  color: #002479;
`;

export const FilterToggleContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin: 1rem 0;
`;

export const FilterToggleTitle = styled.span`
  font-size: 0.9rem;
  color: #707070;
  margin: 0 0.5rem;
  text-transform: capitalize;
`;
