/**
 * Renders a list of items under the sidebar menu,
 */
import { useContext } from 'react';
import * as Styled from '../../Sidebar.styles';
import ListItem from './ListItem';
import BookmarkIcon from 'components/Icons/BookmarkIcon/FilledBookmark';
import DiamondIcon from 'components/Icons/DiamondIcon/Diamond';
import ContactIcon from 'components/Icons/ContactIcon/Contact';
import StatisticBarIcon from 'components/Icons/StatisticBarIcon/StatisticBar';
import { WindowContext } from 'context/WindowProvider';

const UnderMenuList = () => {
  const { RVDic } = useContext(WindowContext);

  return (
    <Styled.UnderMenuContainer>
      <ListItem title="موضوعات نشان شده" icon={BookmarkIcon} badge={67} />
      <ListItem title={RVDic.TemplatesGallery} icon={DiamondIcon} />
      <ListItem title={RVDic.KnowledgeWorkers} icon={ContactIcon} />
      <ListItem title={RVDic.Reports} icon={StatisticBarIcon} />
    </Styled.UnderMenuContainer>
  );
};

export default UnderMenuList;
