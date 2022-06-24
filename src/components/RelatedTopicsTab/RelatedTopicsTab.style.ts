import {
  BG_WHITE,
  BO_DISTANT,
  BO_FREEZED,
  TBG_DEFAULT,
  TBG_WARM,
} from 'constant/Colors';
import {
  BO_RADIUS_CIRCLE,
  BO_RADIUS_HALF,
  BO_RADIUS_QUARTER,
} from 'constant/constants';
import {
  CV_WHITE,
  TCV_DEFAULT,
  TCV_VERY_TRANSPARENT,
} from 'constant/CssVariables';
import { FLEX_RCB } from 'constant/StyledCommonCss';
import styled, { css } from 'styled-components';

const getFloatCss = ({ isFloat }: { isFloat?: boolean }) => {
  return (
    isFloat &&
    css`
      position: absolute;
      z-index: 3999;
    `
  );
};

export const RelatedTopicsTabContainer = styled.div`
  position: relative;
  user-select: none;
  width: 100%;
  flex-grow: 0;
`;
RelatedTopicsTabContainer.displayName = 'RelatedTopicsTabContainer';

export const RelatedTopicsTabInnerContainer = styled.div`
  display: flex;
  flex-flow: row;
  flex-wrap: wrap;
`;
RelatedTopicsTabInnerContainer.displayName = 'RelatedTopicsTabInnerContainer';

export const RelatedTopicsTabMoreTopicsContainer = styled.div.attrs({
  className: `${BO_RADIUS_QUARTER}`,
})<{ isOpen?: boolean; isFloat?: boolean }>`
  margin-top: 0.5rem;
  padding: ${({ isOpen }) => (isOpen ? '1rem' : '0')};
  width: 100%;
  background-color: ${CV_WHITE};
  max-height: ${({ isOpen }) => (isOpen ? '10.4rem' : '0')};
  overflow: hidden;
  box-shadow: 1px 3px 20px ${TCV_VERY_TRANSPARENT};
  transition: all 0.5s ease;

  ${getFloatCss}

  .more-topics-button {
    width: 35%;
    height: 2rem;
    margin: auto;
    margin-top: 1rem;

    a {
      color: ${CV_WHITE};
    }
  }
`;
RelatedTopicsTabMoreTopicsContainer.displayName =
  'RelatedTopicsTabMoreTopicsContainer';

export const RelatedTopicsTabMoreTopicsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(9rem, auto));
  gap: 0.5rem;
  justify-content: space-between;
`;
RelatedTopicsTabMoreTopicsWrapper.displayName =
  'RelatedTopicsTabMoreTopicsWrapper';

export const RelatedTopicsTabItemContainer = styled.div.attrs<{
  isActive?: boolean;
  hasMore?: boolean;
}>((props) => ({
  className: `${BO_RADIUS_HALF} ${BO_DISTANT} ${
    props.isActive ? (props.hasMore ? TBG_WARM : TBG_DEFAULT) : BG_WHITE
  }`,
}))<{ isActive?: boolean; hasMore?: boolean }>`
  flex: 0 0 auto;
  ${FLEX_RCB}
  height: 2.5rem;
  padding: 0 0.5rem;
  cursor: pointer;
  ${({ hasMore }) => !!hasMore && 'border: none;'}
  margin-inline-end: 0.5rem;
  margin-block: 0.25rem;

  .tab-item-tooltip {
    border-radius: 50%;
    width: auto;
    min-width: 2.2rem;
    padding: 0.4rem 0.35rem;
    font-size: 0.9rem;
    text-align: center;
  }
`;
RelatedTopicsTabItemContainer.displayName = 'RelatedTopicsTabItemContainer';

export const RelatedTopicsTabItemTitle = styled.span<{ isActive?: boolean }>`
  font-size: 1rem;
  color: ${({ isActive }) => (isActive ? CV_WHITE : TCV_DEFAULT)};
  display: inline-block;
  width: 100%;
  padding: 0 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
RelatedTopicsTabItemTitle.displayName = 'RelatedTopicsTabItemTitle';

export const RelatedTopicsTabItemImage = styled.img.attrs({
  className: BO_RADIUS_CIRCLE,
})`
  width: 2rem;
  min-width: 2rem;
`;
RelatedTopicsTabItemImage.displayName = 'RelatedTopicsTabItemImage';
