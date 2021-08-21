/**
 * Renders a list of items under the sidebar menu,
 */
import { lazy, Suspense, useState } from 'react';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import * as Styled from 'layouts/Sidebar/Sidebar.styles';
import ListItem from './ListItem';
import BookmarkIcon from 'components/Icons/BookmarkIcon/FilledBookmark';
import DiamondIcon from 'components/Icons/DiamondIcon/Diamond';
// import ContactIcon from 'components/Icons/ContactIcon/Contact';
import StatisticBarIcon from 'components/Icons/StatisticBarIcon/StatisticBar';
import useWindow from 'hooks/useWindowContext';
import { getURL } from 'helpers/helpers';

const TemplatesGalleryModal = lazy(() =>
  import(
    /* webpackChunkName: "templates-gallery"*/ 'components/TemplatesGallery/TemplatesGallery'
  )
);

const selectFavoriteNodesCount = createSelector(
  (state) => state?.sidebarItems,
  (sidebarItems) => sidebarItems?.favoriteNodesCount
);
const selectUnderMenuList = createSelector(
  (state) => state?.sidebarItems,
  (sidebarItems) => sidebarItems?.underMenuList
);

const UnderMenuList = () => {
  const { RVDic } = useWindow();
  const favoriteNodesCount = useSelector(selectFavoriteNodesCount);
  const items = useSelector(selectUnderMenuList);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);

  const openTemplatesGallery = () => {
    setIsGalleryModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsGalleryModalOpen(false);
  };

  return (
    <Styled.UnderMenuContainer>
      {isGalleryModalOpen && (
        <TemplatesGalleryModal
          onModalClose={handleCloseModal}
          isOpen={isGalleryModalOpen}
        />
      )}
      <ListItem
        title={RVDic.BookmarkedSubjects}
        icon={BookmarkIcon}
        badge={favoriteNodesCount}
        linkTo={getURL('Classes', { Bookmarked: true })}
      />
      <ListItem
        title={RVDic.TemplatesGallery}
        icon={DiamondIcon}
        onClick={openTemplatesGallery}
      />
      {/* <ListItem title={RVDic.KnowledgeWorkers} icon={ContactIcon} /> */}
      {items?.map((item, key) => {
        return (
          <ListItem
            key={key}
            title={RVDic[item]}
            icon={StatisticBarIcon}
            linkTo={getURL(item)}
          />
        );
      })}
    </Styled.UnderMenuContainer>
  );
};

export default UnderMenuList;
