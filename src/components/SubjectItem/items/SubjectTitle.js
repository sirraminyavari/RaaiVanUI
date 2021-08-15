/**
 * A 'component' for rendering the title of the item.
 */
import Heading from 'components/Heading/Heading';
import React from 'react';
import styled from 'styled-components';

const SubjectTitle = ({ title, AdditionalID }) => {
  const titleReducer = (text) => text;
  return (
    <Title>
      <Heading type={'h2'}>{titleReducer(title)}</Heading>
      <Heading type={'h6'}>{AdditionalID}</Heading>
    </Title>
  );
};
export default SubjectTitle;

const Title = styled.div`
  display: flex;
  align-self: flex-start;
  align-items: center;
`;
