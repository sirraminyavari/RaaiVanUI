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
  height: 1.5rem;
  border-radius: 0.75rem;
  /* color: #2b7be4; */
  padding: 2rem 0rem 1rem 0rem;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: flex-start;
`;
