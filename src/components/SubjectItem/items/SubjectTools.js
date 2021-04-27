/**
 * A 'component' for rendering the tools for editting the item.
 */
import BookmarkIcon from 'components/Icons/BookmarkIcon/Bookmark';
import EditIcon from 'components/Icons/EditIcon/Edit';
import TrashIcon from 'components/Icons/TrashIcon';
import React from 'react';
import styled from 'styled-components';

const SubjectTools = ({ removable, editable, ...props }) => {
  const onEdit = () => {};
  const onDelete = () => {};
  const onBookmark = () => {};

  return (
    <Tools {...props}>
      {editable && (
        <button
          style={{ width: '1rem', marginRight: '1.7rem' }}
          onClick={onEdit}>
          <EditIcon size={30} color={'#bac9dc'} />
        </button>
      )}
      {removable && (
        <button
          style={{ width: '1rem', marginRight: '1.7rem' }}
          onClick={onDelete}>
          <TrashIcon size={30} color={'#bac9dc'} />
        </button>
      )}
      <button
        style={{
          width: '1rem',
          marginRight: '1.7rem',
          marginLeft: '2.5rem',
        }}
        onClick={onBookmark}>
        <BookmarkIcon size={30} color={'#bac9dc'} />
      </button>
    </Tools>
  );
};
export default SubjectTools;

const Tools = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;
