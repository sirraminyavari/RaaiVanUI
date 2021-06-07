/**
 * A component for rendering the name of the item creator.
 */
import React from 'react';
import styled from 'styled-components';

const SubjectCreator = ({ firstName, lastName, userProfile }) => {
  const isSaas = (window.RVGlobal || {}).SAASBasedMultiTenancy;

  return (
    <Container>
      <Profile src={userProfile} isSaas={isSaas} />
      {!isSaas && (
        <ProducerName className="rv-gray">
          {firstName}
          {lastName}
        </ProducerName>
      )}
    </Container>
  );
};
export default SubjectCreator;

const Profile = styled.img`
  width: ${({ isSaas }) => (isSaas ? '2rem' : '3rem')};
  aspect-ratio: 1;
  border-radius: 1.5rem;
`;
const ProducerName = styled.div`
  /* color: #707070; */
  margin-right: 0.5rem;
`;
const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
