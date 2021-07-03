/**
 * A 'component' for rendering the view count of the item.
 */
import Eye from 'components/Icons/Edit';
import React from 'react';
import styled from 'styled-components';

const SubjectViewCount = ({ count }) => {
  return (
    <ViewCount className="rv-default">
      <Eye className="rv-default" style={{ margin: '0 0.5rem 0 0.5rem' }} />
      {count}
    </ViewCount>
  );
};
export default SubjectViewCount;

const ViewCount = styled.div`
  display: flex;
  align-items: center;
  /* color: #2b7be4; */
  align-self: center;
  justify-content: center;
  margin: 0 0.5rem 0 0.5rem;
`;
