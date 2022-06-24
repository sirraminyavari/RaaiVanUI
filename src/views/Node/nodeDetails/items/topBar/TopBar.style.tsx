import Button from 'components/Buttons/Button';
import styled from 'styled-components';
import { C_DISTANT } from 'constant/Colors';
import { CV_DISTANT, CV_GRAY, CV_RED } from 'constant/CssVariables';
import { FLEX_RCS } from 'constant/StyledCommonCss';

export const NodeTopBarShadowButton = styled(Button)<{ $isEnabled?: boolean }>`
  box-shadow: ${({ $isEnabled }) => $isEnabled && `1px 3px 20px ${CV_DISTANT}`};
  border-radius: 100rem;
  background-color: white;
  border-width: 0.06rem;
  padding: 0.5rem;
  /* border-color: ${({ $isEnabled }) => ($isEnabled ? '#BAC9DC' : 'white')}; */
  border-style: solid;
  transition: border-color 0.5s, box-shadow 0.5s;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  /* color: ${({ $isEnabled }) => ($isEnabled ? '#2B7BE4' : '#BAC9DC')}; */
  /* :hover {
    border-width: 0.06rem;
    border-color: #bac9dc;
    border-style: solid;
  } */
  /* ${({ $isEnabled }) => $isEnabled && 'rv-border-warm-red'} */
`;

NodeTopBarShadowButton.displayName = 'NodeTopBarShadowButton';
export const NodeTopBarBottomRow = styled.div<{ mobileView?: boolean }>`
  display: flex;
  flex-direction: ${({ mobileView }) => (mobileView ? 'column' : 'row')};
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 5rem;
`;
NodeTopBarBottomRow.displayName = 'NodeTopBarBottomRow';

export const NodeTopBarRelatedTopicsContainer = styled.div`
  ${FLEX_RCS}
  // gap: 1rem;

  max-width: 100%;
`;
NodeTopBarRelatedTopicsContainer.displayName =
  'NodeTopBarRelatedTopicsContainer';

export const NodeTopBarRelatedTopicsTitle = styled.div`
  margin-inline-end: 3vw;
  color: ${CV_GRAY};
  height: 2rem;
  font-size: 1rem;
  width: clamp(5rem, 12vw, 17rem);
  flex-shrink: 0;
`;
NodeTopBarRelatedTopicsTitle.displayName = 'NodeTopBarRelatedTopicsTitle';

export const NodeTopBarTopRow = styled.div<{ isTabletOrMobile?: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  margin: 1rem 1rem 1rem 0rem;
  justify-content: space-between;

  ${({ isTabletOrMobile }) =>
    isTabletOrMobile
      ? `
      flex-direction: column;
      align-self: center;
      `
      : `
      flex-direction: row;
  align-self: flex-end;
  `}
`;
NodeTopBarTopRow.displayName = 'NodeTopBarTopRow';

export const NodeTopBarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 0 2rem 0 2rem;
  position: relative;
`;
NodeTopBarContainer.displayName = 'NodeTopBarContainer';

export const NodeTopBarBreadcrumbItem = styled.span.attrs({
  className: C_DISTANT,
})`
  padding: 0 0.2rem;
  display: inline-block;
  font-size: 0.9rem;
  user-select: none;
  cursor: pointer;

  :hover {
    color: #000;
  }
`;
NodeTopBarBreadcrumbItem.displayName = 'NodeTopBarBreadcrumbItem';

export const NodeTopBarBackButton = styled(Button)`
  :hover {
    border-width: 0.05rem;
    border-style: solid;
    border-color: ${CV_RED};
    padding: 0.5rem;
  }
`;
NodeTopBarBackButton.displayName = 'NodeTopBarBackButton';
export const NodeTopBarProfile = styled.img`
  max-width: 3rem;
  max-height: 3rem;
  border-radius: 1.5rem;
  display: block;
  width: auto;
  height: auto;
  background-color: grey;
`;
NodeTopBarProfile.displayName = 'NodeTopBarProfile';
export const NodeTopBarViewCount = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${CV_DISTANT};
  margin: 0 2.5rem 0 2.5rem;
`;
NodeTopBarViewCount.displayName = 'NodeTopBarViewCount';

export const NodeTopBarCounterBookmarkContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
NodeTopBarCounterBookmarkContainer.displayName =
  'NodeTopBarCounterBookmarkContainer';

export const NodeTopBarSpace = styled.div`
  display: flex;
  flex-grow: 1;
`;
NodeTopBarSpace.displayName = 'NodeTopBarSpace';

export const NodeTopBarBreadcrumbWrapper = styled.div`
  width: 100%;
  height: 4rem;
  position: relative;
  > div {
    > a > div {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 8rem;
    }
  }
`;
NodeTopBarBreadcrumbWrapper.displayName = 'NodeTopBarBreadcrumbWrapper';
