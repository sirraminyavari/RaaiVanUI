import styled from 'styled-components';

export const ColumnsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 10vh auto;
  width: 90%;
  height: 80vh;
  text-align: center;
`;

export const Column = styled.div`
  padding: 24px 0;
  display: flex;
  flex-direction: column;
  margin-top: 8px;
  width: 22%;
`;

export const List = styled.div`
  background-color: #888;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin-top: 8px;
  width: 100%;
`;

export const Item = styled.div`
  background-color: #eee;
  border-radius: 4px;
  padding: 4px 8px;
  transition: background-color 0.8s ease;
  margin-top: 8px;

  &:hover {
    background-color: #fff;
    transition: background-color 0.1s ease;
  }
`;
