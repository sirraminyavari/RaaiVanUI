import styled from 'styled-components';

export const SortableContainer = styled.div`
  background-color: #ddd;
  margin-left: -8px;
  margin-right: -8px;
  white-space: nowrap;
  &:after {
    content: '';
    clear: both;
    display: table;
  }
`;

export const SortableItem = styled.div`
  float: left;
  padding: 8px;
  margin: 10px;
  width: calc(25% - 16px);
  padding: 8px 12px;
  background-color: #ddd;
  height: 150px;
  background-color: blue;
`;
