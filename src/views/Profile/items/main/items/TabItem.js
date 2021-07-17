import * as Styled from 'views/Profile/Profile.styles';
import Badge from 'components/Badge/Badge';
import { CV_WHITE, TCV_DEFAULT } from 'constant/CssVariables';
import ShowMoreIcon from 'components/Icons/ShowMoreIcons/ShowMore';

const TabItem = (props) => {
  const { isActive, noImage, hasMore, item, onTabClick } = props;

  const getIcon = () => {
    if (!!noImage) return;
    if (!!hasMore) {
      return (
        <ShowMoreIcon size={20} color={isActive ? CV_WHITE : TCV_DEFAULT} />
      );
    }
    return (
      <Styled.TabItemImage src="../../images/Preview.png" alt="tab-logo" />
    );
  };

  return (
    <Styled.TabItemContainer
      hasMore={!!hasMore}
      isActive={isActive}
      onClick={onTabClick}>
      {getIcon()}
      <Styled.TabItemTitle isActive={isActive}>
        {item?.title}
      </Styled.TabItemTitle>
      <Badge
        value={item?.count}
        limit={100}
        style={{
          backgroundColor: isActive ? CV_WHITE : TCV_DEFAULT,
          fontSize: '0.8rem',
          width: '1.5rem',
          minWidth: '1.5rem',
          maxWidth: '1.5rem',
          color: isActive ? TCV_DEFAULT : CV_WHITE,
          lineHeight: '1.7rem',
        }}
      />
    </Styled.TabItemContainer>
  );
};

export default TabItem;
