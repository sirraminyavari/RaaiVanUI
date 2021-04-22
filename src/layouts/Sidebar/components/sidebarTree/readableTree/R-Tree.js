/**
 * Renders all menu items at once.
 */
import { memo } from 'react';
import { useSelector } from 'react-redux';
import ReadableBranch from './R-Branch';
import * as Styled from '../../../Sidebar.styles';
import { createSelector } from 'reselect';

const selectTree = createSelector(
  (state) => state.sidebarItems,
  (sidebarItems) => sidebarItems.tree
);

const ReadableTree = () => {
  const tree = useSelector(selectTree);

  return (
    <Styled.MenuTreeContainer>
      {tree.map((item) => {
        return <ReadableBranch key={item.NodeTypeID} item={item} />;
      })}
    </Styled.MenuTreeContainer>
  );
};

export default memo(ReadableTree);
