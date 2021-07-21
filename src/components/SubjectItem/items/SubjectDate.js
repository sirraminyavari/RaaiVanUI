/**
 * A 'component' for rendering the date of the item that has been created
 */
import React from 'react';
import styled from 'styled-components';

const SubjectDate = ({ date, liteMode }) => {
  return (
    <Date liteMode={liteMode} className="rv-gray">
      {date}
    </Date>
  );
};
export default SubjectDate;

const Date = styled.div`
  font-size: ${({ liteMode }) => liteMode && '0.5rem'};
  /* color: #707070; */
`;
