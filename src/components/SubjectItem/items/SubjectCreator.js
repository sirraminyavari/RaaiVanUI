/**
 * A component for rendering the name of the item creator.
 */
import Tooltip from 'components/Tooltip/react-tooltip/Tooltip';
import { random } from 'helpers/helpers';
import React from 'react';
import styled from 'styled-components';

const SubjectCreator = ({ firstName, lastName, userProfile, style }) => {
  const isSaas = (window.RVGlobal || {}).SAASBasedMultiTenancy;

  return (
    <Container style={style}>
      {!isSaas ? (
        <>
          <Profile src={userProfile} isSaas={isSaas} />
          <ProducerName className="rv-gray">
            {`${firstName} ${lastName}`}
          </ProducerName>
        </>
      ) : (
        <Tooltip
          tipId={'SubjectCreator' + random()}
          effect="solid"
          place="top"
          renderContent={() => `${firstName} ${lastName}`}
        >
          <Profile src={userProfile} isSaas={isSaas} />
        </Tooltip>
      )}
    </Container>
  );
};
export default SubjectCreator;

const Profile = styled.img`
  max-width: 3rem;
  max-height: 3rem;
  border-radius: 1.5rem;
  display: block;
  width: auto;
  height: auto;
`;
const ProducerName = styled.div`
  /* color: #707070; */
  margin-right: 0.5rem;
`;
const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
`;
