/**
 * A 'component' for rendering the tools for editting the item.
 */
import APIHandler from 'apiHelper/APIHandler';
import FilledBookmarkIcon from 'components/Icons/BookmarkIcon/FilledBookmark';
import OutLineBookmarkIcon from 'components/Icons/BookmarkIcon/OutlineBookmark';
import EditIcon from 'components/Icons/EditIcons/Edit';
import LoadingIconCircle from 'components/Icons/LoadingIcons/LoadingIconCircle';
import TrashIcon from 'components/Icons/TrashIcon';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { useSidebarSlice } from 'store/slice/sidebar';
import { selectSidebar } from 'store/slice/sidebar/selectors';

const likeNode = new APIHandler('CNAPI', 'Like');
const unlikeNode = new APIHandler('CNAPI', 'Unlike');

const SubjectTools = ({
  removable,
  editable,
  isHover,
  isLiked,
  nodeId,
  reload,
  onBookmarLocally,
  ...props
}) => {
  const dispatch = useDispatch();

  const { favoriteNodesCount } = useSelector(selectSidebar);

  const { actions: sidebarActions } = useSidebarSlice();

  const [bookmarkFetching, setBookmarkFetching] = useState(false);

  const onEdit = () => {};
  const onDelete = () => {};

  const onBookmark = (e) => {
    setBookmarkFetching(true);
    e.stopPropagation();
    e.preventDefault();

    if (isLiked) {
      unlikeNode.fetch({ NodeID: nodeId }, (response) => {
        console.log(response, 'unlike response');
        if (
          response?.Succeed &&
          response.Succeed === 'OperationCompletedSuccessfully'
        ) {
          dispatch(
            sidebarActions.setFavoriteNodesCount(favoriteNodesCount - 1)
          );

          onBookmarLocally && onBookmarLocally(nodeId);
        }
        setBookmarkFetching(false);
      });
    } else {
      likeNode.fetch({ NodeID: nodeId }, (response) => {
        console.log(response, 'like response');
        if (
          response?.Succeed &&
          response.Succeed === 'OperationCompletedSuccessfully'
        ) {
          dispatch(
            sidebarActions.setFavoriteNodesCount(favoriteNodesCount + 1)
          );

          onBookmarLocally && onBookmarLocally(nodeId);
        }
        setBookmarkFetching(false);
      });
    }
  };

  return (
    <Tools isHover={isHover} isLiked={isLiked} {...props}>
      {editable && (
        <button
          style={{ width: '1rem', marginRight: '1.7rem' }}
          onClick={onEdit}
        >
          <EditIcon className="rv-distant" size={30} />
        </button>
      )}
      {removable && (
        <button
          style={{ width: '1rem', marginRight: '1.7rem' }}
          onClick={onDelete}
        >
          <TrashIcon size={30} className="rv-distant" />
        </button>
      )}

      {!isHover ? (
        <div
          style={{
            width: '2rem',
            marginRight: '0.7rem',
            marginLeft: '0.7rem',
            alignContent: 'center',
          }}
        />
      ) : (
        <button
          style={{
            width: '2rem',
            marginRight: '0.7rem',
            marginLeft: '0.7rem',
            display: isLiked ? 'flex' : 'flex',
            alignContent: 'center',
          }}
          type={'secondary-o'}
          onClick={onBookmark}
        >
          {bookmarkFetching ? (
            <LoadingIconCircle
              style={{
                display: 'flex',
                justifySelf: 'center',
              }}
              className="rv-default"
            />
          ) : isLiked ? (
            <FilledBookmarkIcon size={'4rem'} className={'rv-default'} />
          ) : (
            <OutLineBookmarkIcon
              size={'4rem'}
              className={isHover ? 'rv-default' : 'rv-distant'}
            />
          )}
        </button>
      )}
    </Tools>
  );
};
export default SubjectTools;

const Tools = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  /* z-index: ${({ isHover, isLiked }) =>
    isHover === undefined ? 1 : isLiked ? 1 : !isHover ? -10 : 1}; */
`;
