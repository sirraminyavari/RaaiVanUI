/**
 * A 'component' for rendering the icon of the item.
 */
import React from 'react';
import styled from 'styled-components';

const SubjectIcon = ({ iconUrl }) => {
  return <Icon src={iconUrl} />;
};
export default SubjectIcon;

const Icon = styled.img`
  width: 4rem;
  aspect-ratio: 1;
  margin-bottom: 0.5rem;
`;
