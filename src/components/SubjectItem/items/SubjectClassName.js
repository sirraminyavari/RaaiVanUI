/**
 * A component for rendering the class name of every item
 */
import React from 'react';
import styled from 'styled-components';

const SubjectClassName = ({ className }) => {
  return <ClassName>{className}</ClassName>;
};
export default SubjectClassName;

const ClassName = styled.div`
  background-color: #f3f7fd;
  border-radius: 13px;
  height: 1.5rem;
  border-radius: 0.75rem;
  color: #2b7be4;
  padding: 0 1rem 0 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;
