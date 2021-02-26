/**
 * Renders a list of items under the sidebar menu,
 */
import * as Styled from '../Sidebar.styles';
import ListItem from './ListItem';
import BookmarkIcon from 'components/Icons/BookmarkIcon/Bookmark';
import DiamondIcon from 'components/Icons/DiamondIcon/Diamond';
import ContactIcon from 'components/Icons/ContactIcon/Contact';
import StatisticBarIcon from 'components/Icons/StatisticBarIcon/StatisticBar';

const UnderMenuList = () => {
  return (
    <Styled.UnderMenuContainer>
      <ListItem title="موضوعات نشان شده" icon={BookmarkIcon} badge={55} />
      <ListItem title="گالری تمپلیت ها" icon={DiamondIcon} />
      <ListItem title="دانشکاران" icon={ContactIcon} />
      <ListItem title="گزارشات" icon={StatisticBarIcon} />
    </Styled.UnderMenuContainer>
  );
};

export default UnderMenuList;
