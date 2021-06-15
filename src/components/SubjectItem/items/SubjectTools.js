/**
 * A 'component' for rendering the tools for editting the item.
 */
import APIHandler from 'apiHelper/APIHandler';
import Button from 'components/Buttons/Button';
import FilledBookmarkIcon from 'components/Icons/BookmarkIcon/FilledBookmark';
import OutLineBookmarkIcon from 'components/Icons/BookmarkIcon/OutlineBookmark';
import BookmarkIcon from 'components/Icons/BookmarkIcon/OutlineBookmark';
import EditIcon from 'components/Icons/EditIcon/Edit';
import TrashIcon from 'components/Icons/TrashIcon';
import React from 'react';
import styled from 'styled-components';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';

const likeNode = new APIHandler('CNAPI', 'Like');
const unlikeNode = new APIHandler('CNAPI', 'Unlike');

const SubjectTools = ({
  removable,
  editable,
  isHover,
  isLiked,
  nodeId,
  reload,
  ...props
}) => {
  const onEdit = () => {};
  const onDelete = () => {};
  const onBookmark = (e) => {
    console.log(e, 'like pressed');
    // e.stopPropagation();
    e.stopPropagation();

    if (isLiked) {
      unlikeNode.fetch({ NodeID: nodeId }, (response) => {
        console.log(response, 'unlike response');
        reload();
      });
    } else {
      likeNode.fetch({ NodeID: nodeId }, (response) => {
        console.log(response, 'like response');
        reload();
      });
    }
  };

  return (
    <Tools isHover={isHover} isLiked={isLiked} {...props}>
      {editable && (
        <button
          style={{ width: '1rem', marginRight: '1.7rem' }}
          onClick={onEdit}>
          <EditIcon className="rv-distant" size={30} />
        </button>
      )}
      {removable && (
        <button
          style={{ width: '1rem', marginRight: '1.7rem' }}
          onClick={onDelete}>
          <TrashIcon size={30} className="rv-distant" />
        </button>
      )}

      <button
        style={{
          width: '1rem',
          marginRight: '1.7rem',
          marginLeft: '2.5rem',
        }}
        type={'secondary-o'}
        onClick={onBookmark}>
        {isLiked ? (
          <FilledBookmarkIcon size={'1.5rem'} className={'rv-default'} />
        ) : (
          <OutLineBookmarkIcon
            size={'1.5rem'}
            className={isHover ? 'rv-default' : 'rv-distant'}
          />
        )}
      </button>
    </Tools>
  );
};
export default SubjectTools;

const Tools = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  z-index: ${({ isHover, isLiked }) =>
    isHover === undefined ? 1 : isLiked ? 1 : !isHover ? -10 : 1};
`;
