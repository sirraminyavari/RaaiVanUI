import type { CSSProperties, MouseEventHandler } from 'react';
import * as Styled from 'components/RelatedTopicsTab/RelatedTopicsTab.style';
import { forwardRef } from 'react';
import Badge from 'components/Badge/Badge';
import { CV_WHITE, TCV_DEFAULT } from 'constant/CssVariables';
import ShowMoreIcon from 'components/Icons/ShowMoreIcons/ShowMore';
import Tooltip from 'components/Tooltip/react-tooltip/Tooltip';
import { decodeBase64 } from 'helpers/helpers';
import ChevronIcon from 'components/Icons/ChevronIcons/Chevron';

const BADGE_LIMIT_COUNT = 100;

export type IRelatedTopicsTabItem = {
  isActive?: boolean;
  noImage?: boolean;
  hasMore?: boolean;
  item?: { [key: string]: any };
  onTabClick?: MouseEventHandler<HTMLDivElement>;
  style?: CSSProperties;
};

const RelatedTopicsTabItem = forwardRef<HTMLDivElement, IRelatedTopicsTabItem>(
  ({ isActive, noImage, hasMore, item, onTabClick, style }, ref) => {
    const getIcon = () => {
      if (!!noImage) return;
      if (!!hasMore) {
        return (
          <ShowMoreIcon size={20} color={isActive ? CV_WHITE : TCV_DEFAULT} />
        );
      }
      return (
        <Styled.RelatedTopicsTabItemImage
          src="/images/Preview.png"
          alt="tab-logo"
        />
      );
    };

    return (
      <Styled.RelatedTopicsTabItemContainer
        ref={ref}
        hasMore={!!hasMore}
        isActive={isActive}
        onClick={onTabClick}
        style={style}
      >
        {getIcon()}
        <Styled.RelatedTopicsTabItemTitle isActive={isActive}>
          {decodeBase64(item?.NodeType)}
        </Styled.RelatedTopicsTabItemTitle>
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
            renderContent={() => item?.Count}
          >
            <Badge
              value={item?.Count}
              limit={BADGE_LIMIT_COUNT}
              //@ts-expect-error
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
      </Styled.RelatedTopicsTabItemContainer>
    );
  }
);

export default RelatedTopicsTabItem;
