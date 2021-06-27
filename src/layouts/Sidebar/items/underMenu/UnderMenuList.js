/**
 * Renders a list of items under the sidebar menu,
 */
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import * as Styled from 'layouts/Sidebar/Sidebar.styles';
import ListItem from './ListItem';
import BookmarkIcon from 'components/Icons/BookmarkIcon/FilledBookmark';
import DiamondIcon from 'components/Icons/DiamondIcon/Diamond';
import ContactIcon from 'components/Icons/ContactIcon/Contact';
import StatisticBarIcon from 'components/Icons/StatisticBarIcon/StatisticBar';
import useWindow from 'hooks/useWindowContext';

const selectFavoriteNodesCount = createSelector(
  (state) => state.sidebarItems,
  (theme) => theme.favoriteNodesCount
);

const UnderMenuList = () => {
  const { RVDic } = useWindow();
  const favoriteNodesCount = useSelector(selectFavoriteNodesCount);

  return (
    <Styled.UnderMenuContainer>
      <ListItem
        title={RVDic.BookmarkedSubjects}
        icon={BookmarkIcon}
        badge={favoriteNodesCount}
      />
      <ListItem title={RVDic.TemplatesGallery} icon={DiamondIcon} />
      <ListItem title={RVDic.KnowledgeWorkers} icon={ContactIcon} />
      <ListItem title={RVDic.Reports} icon={StatisticBarIcon} />
    </Styled.UnderMenuContainer>
  );
};

export default UnderMenuList;
