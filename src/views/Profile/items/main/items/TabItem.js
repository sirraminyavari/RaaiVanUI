import * as Styled from 'views/Profile/Profile.styles';
import Badge from 'components/Badge/Badge';
import { CV_WHITE, TCV_DEFAULT } from 'constant/CssVariables';
import ShowMoreIcon from 'components/Icons/ShowMoreIcons/ShowMore';
import Tooltip from 'components/Tooltip/react-tooltip/Tooltip';
import { decodeBase64 } from 'helpers/helpers';
import ChevronIcon from 'components/Icons/ChevronIcons/Chevron';

const BADGE_LIMIT_COUNT = 100;

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
        {decodeBase64(item?.NodeType)}
      </Styled.TabItemTitle>
      {hasMore && (
        <ChevronIcon
          size={25}
          small
          dir={isActive ? 'up' : 'down'}
          color={isActive ? CV_WHITE : TCV_DEFAULT}
        />
      )}
      {!hasMore && (
        <Tooltip
          tipId={`profile-tab-${decodeBase64(item?.NodeType)}`}
          effect="solid"
          place="top"
          disable={item?.Count < BADGE_LIMIT_COUNT}
          ignoreTip={decodeBase64(item?.NodeType) !== 'همه قالب ها'}
          className="tab-item-tooltip"
          renderContent={() => item?.Count}>
          <Badge
            value={item?.Count}
            limit={BADGE_LIMIT_COUNT}
            style={{
              backgroundColor: isActive ? CV_WHITE : TCV_DEFAULT,
              fontSize: '0.8rem',
              width: '1.5rem',
              minWidth: '1.5rem',
              maxWidth: '1.5rem',
              color: isActive ? TCV_DEFAULT : CV_WHITE,
            }}
          />
        </Tooltip>
      )}
    </Styled.TabItemContainer>
  );
};

export default TabItem;
