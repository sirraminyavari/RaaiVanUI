/**
 * A 'component' for rendering the icon of the item.
 */
import React from 'react';
import styled from 'styled-components';

const SubjectIcon = ({ iconUrl, liteMode }) => {
  return <Icon liteMode={liteMode} src={iconUrl} />;
};
export default SubjectIcon;

const Icon = styled.img`
  margin-bottom: 0.5rem;
  max-width: ${({ liteMode }) => (liteMode ? '2rem' : '4rem')};
  max-height: ${({ liteMode }) => (liteMode ? '2rem' : '4rem')};
  display: block;
  width: auto;
  height: auto;
`;
