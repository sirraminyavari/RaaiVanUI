/**
 * A 'component' for rendering the date of the item that has been created
 */
import React from 'react';
import styled from 'styled-components';

const SubjectDate = ({ date }) => {
  return <Date>{date}</Date>;
};
export default SubjectDate;

const Date = styled.div`
  color: #707070;
`;
