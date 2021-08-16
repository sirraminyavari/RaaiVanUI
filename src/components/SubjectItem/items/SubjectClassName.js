/**
 * A component for rendering the class name of every item
 */
import React from 'react';
import styled from 'styled-components';

const SubjectClassName = ({ className }) => {
  return (
    <ClassName className="rv-default rv-bg-color-verysoft">
      {className}
    </ClassName>
  );
};
export default SubjectClassName;

const ClassName = styled.div`
  border-radius: 13px;
  /* height: 1.5rem; */
  border-radius: 0.75rem;
  /* color: #2b7be4; */
  min-width: 7.5rem;
  padding: 0.5rem 0.5rem 0.5rem 0.5rem;
  margin: 0.5rem 0.5rem 0.5rem 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: flex-start;
  text-align: center;
`;
