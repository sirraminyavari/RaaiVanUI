import styled, { css } from 'styled-components';
import {
  C_DISTANT,
  C_GRAY,
  C_RED,
  C_GRAY_DARK,
  BG_GRAY_LIGHT,
  BG_WHITE,
  BO_DISTANT,
  TC_VERY_TRANSPARENT,
} from 'constant/Colors';
import {
  BO_RADIUS_CIRCLE,
  BO_RADIUS_HALF,
  BO_RADIUS_QUARTER,
} from 'constant/constants';
import {
  CV_DISTANT,
  CV_FREEZED,
  CV_GRAY,
  CV_GRAY_DARK,
  CV_GRAY_LIGHT,
  CV_RED,
  CV_WHITE,
  TCV_DEFAULT,
  TCV_VERYWARM,
  TCV_VERY_TRANSPARENT,
  TCV_VERY_TRANSPARENT_WARM,
  TCV_WARM,
} from 'constant/CssVariables';
import { FLEX_CSC, FLEX_RCS } from 'constant/StyledCommonCss';

const { RV_Float, RV_RTL, RV_RevFloat } = window;

export const ConfirmSpaceWrapper = styled.div`
  margin: 0 2.5rem;
`;

export const ConfirmSpaceTitle = styled.div.attrs({
  className: C_GRAY,
})`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 1rem;
`;

export const ConfirmQuestion = styled.div.attrs({
  className: C_GRAY_DARK,
})`
  margin: 3rem 0 1rem 0;
  font-size: 0.9rem;
  font-weight: bold;
`;

export const ConfirmWarning = styled.div.attrs({
  className: C_RED,
})`
  font-size: 0.8rem;
`;

const getBorderCss = (props) => {
  if (props.isNew) {
    return css`
      border-width: 2px;
      border-style: dashed;
      :hover {
        border-color: ${TCV_DEFAULT};
      }

      :hover > div > * {
        color: ${TCV_DEFAULT};
      }
    `;
  }
  if (props.isArchive) {
    return css`
      border: none;
      :hover {
        border: 1px solid ${CV_DISTANT};
        padding: calc(0.5rem - 1px) calc(1.5rem - 1px);
      }
    `;
  }
  return css`
    border-width: 1px;
    border-style: solid;
    :hover {
      border-width: 2.5px;
      border-color: ${TCV_DEFAULT};
      padding: calc(0.5rem - 1.5px) calc(1.5rem - 1.5px);
    }
  `;
};

const getDragCss = (props) => {
  return (
    props.isDragging &&
    css`
      opacity: 0.3;
      border: 0.15rem dashed ${TCV_DEFAULT};
    `
  );
};

export const TeamContainer = styled.div.attrs({
  className: `${BG_WHITE} ${BO_DISTANT} ${BO_RADIUS_HALF}`,
})`
  max-width: 50vw;
  width: calc(${({ isMobile }) => (isMobile ? '100%' : '50% - 0.5rem')});
  height: 12.7rem;
  padding: 0.5rem 1.5rem;
  ${getBorderCss}
  position: relative;
  float: ${RV_Float};
  margin-bottom: 1rem;
  overflow: hidden;
  user-select: none;
  ${({ isArchive }) => isArchive && `background-color: ${CV_FREEZED};`}
  ${getDragCss}
  ${({ isMobile }) =>
    !isMobile &&
    `
    :nth-child(2n+1){
      margin-${RV_RevFloat}: 0.5rem;
    }
    :nth-child(2n){
      margin-${RV_Float}: 0.5rem;
    }
  `}

  .team-extra-users {
    background-color: ${CV_FREEZED};
    width: 2.5rem;
    height: 2.5rem;
    font-size: 0.8rem;
    color: ${TCV_DEFAULT};
    line-height: 2.5rem;
    user-select: none;
  }

  .inactive {
    background-color: #f6f6f7;
    color: #b8b8b8;
  }

  .hidden-arrow {
    display: none;
  }

  .extra-users-popup {
    width: 13rem;
    max-height: 11.4rem;
    margin: 0;
    padding: 0.7rem 0.2rem 0.7rem 0.2rem;
    border: 0;
    box-shadow: 1px 3px 20px ${TCV_VERY_TRANSPARENT};
    position: relative;
    background-color: ${CV_WHITE};
    ${RV_Float}: 8rem;
    bottom: -2.8rem;
    // overflow: hidden;
  }

  .invite-modal-container {
    margin-top: 4rem;
  }
`;

export const DragIconWrapper = styled.div`
  position: absolute;
  top: 0.15rem;
  ${({ dir }) => dir}: -0.2rem;
  cursor: move; /* fallback: no url() support or images disabled */
  cursor: url('https://www.google.com/intl/en_ALL/mapfiles/openhand.cur'),
    all-scroll !important;
  z-index: 100;
  padding: 0.5rem;
`;

export const TeamEditWrapper = styled.div.attrs({
  className: `${BO_RADIUS_CIRCLE}`,
})`
  width: 1.6rem;
  height: 1.6rem;
  position: absolute;
  bottom: 0;
  right: 2rem;
  padding: 0.15rem 0.1rem 0 0;
  background-color: ${TCV_DEFAULT};
  border: 2px solid ${CV_DISTANT};
  opacity: 0;
  cursor: pointer;
  transition: all 0.3s ease;
`;

export const DesktopWelcomeSide = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  user-select: none;
`;

export const WorkspaceImageWrapper = styled.div`
  width: 70%;
  // max-width: 18rem;
  margin-block-start: 5rem;
  aspect-ratio: 1;
  justify-content: center;
  display: flex;
  align-items: center;
`;

export const WorkspaceImage = styled.img`
  user-drag: none;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-drag: none;
  -webkit-user-select: none;
  -ms-user-select: none;
`;

export const WelcomeMSGContainer = styled.div`
  margin: 1rem 0 1.5rem 0;
`;

export const SocialMediaContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem 0 0 0;
`;

export const IconWrapper = styled.div.attrs({
  className: `${C_DISTANT} ${BO_RADIUS_CIRCLE}`,
})`
  margin: 0 0.5rem;
  display: flex;
  align-items: center;
  padding: 0.5rem;
  cursor: pointer;
  :hover {
    color: #2b7be4;
  }
`;

export const WelcomeMessage = styled.span.attrs({
  className: C_GRAY,
})`
  font-size: 1rem;
  text-transform: capitalize;
`;

export const TeamConfirmMessage = styled.span`
  font-size: 1rem;
  color: ${CV_GRAY_DARK};
`;

export const WorkspaceDeleteContainer = styled.div`
  width: 100%;
  padding-top: 2rem;
  font-size: 1rem;
`;

export const WorkspaceDeleteString = styled.p`
  ${({ type }) =>
    type &&
    `color: ${(type === 'alert' && CV_RED) || (type === 'email' && TCV_WARM)};`}
  ${({ size }) => size && `font-size: ${size};`};
  ${({ fontWeight = 'normal' }) => fontWeight && `font-weight: ${fontWeight}`};
  margin-block-start: ${({ marginTop }) => (marginTop ? marginTop : '0.5rem')};
`;

export const WorkspaceDeleteConsequencesList = styled.ul`
  padding-inline-start: 0;
  margin-block-start: 2rem;
  list-style: none;
`;

export const WorkspaceDeleteConsequencesListItem = styled.li`
  padding-inline-start: 0;
  margin-block: 0.5rem;
  text-indent: 0.5rem;
  font-weight: 500;
  :before {
    content: '-';
    text-indent: 0.5rem;
    padding-inline: 0.2rem;
  }
`;

export const WorkspaceDeleteActionsContainer = styled.div`
  margin-block: 1.5rem;
  display: flex;
  align-items: center;
`;
export const WorkspaceDeleteWelcomeHeader = styled.div`
  margin: 0.8rem;
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;

export const WorkspaceSettingsHeaderContainer = styled.div`
  padding-block: 1.5rem;
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: flex-start;

  .headerContainer {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .breadcrumb {
    display: inline-flex;
    position: initial;
    justify-content: start;
  }
  .pageTitle {
    padding-block: 1.5rem;
  }
`;

export const WorkspacePlansHeaderContainer = styled(
  WorkspaceSettingsHeaderContainer
)`
  .paymentType {
    margin-block-start: 2rem;
    display: flex;
    justify-content: center;
    > span {
      margin-inline: 1rem;
      color: ${CV_DISTANT};
      &.active {
        color: ${TCV_WARM};
        font-weight: bold;
      }
    }
  }
`;

export const WorkspacePlansActionContainer = styled.div`
  display: flex;
  justify-content: center;
`;

export const WorkspacePrimaryText = styled.span`
  color: ${TCV_WARM};
  font-weight: bold;
  text-align: center;
  font-size: 1rem;
`;

export const WorkspaceSecondaryText = styled.span`
  color: ${CV_GRAY};
  text-align: center;
  font-size: 0.8rem;
`;

export const WorkspacePlanImage = styled.div.attrs({
  className: 'rv-border-radius-1',
})`
  ${({ size = '4rem' }) => `
  width: ${size};
  height: ${size};
`}
  font-size: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ muted }) => (muted ? CV_GRAY : TCV_WARM)};
  background: transparent
    linear-gradient(134deg, ${CV_WHITE} 0%, ${CV_WHITE} 100%) 0% 0% no-repeat
    padding-box;
  border: 1px solid ${({ borderColor }) => borderColor || CV_DISTANT};
  // padding: 20%;
  ${({ pop }) =>
    pop &&
    `
  margin-block-start: -4.5rem;
  margin-block-end: 1.5rem;
  `}

  > svg {
    font-size: 0.8em;
  }
`;

export const WorkspacePlanContent = styled.div.attrs({
  className: 'rv-border-black rv-border-radius-half',
})`
  padding: 0.8rem;
  padding-block-start: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  color: ${TCV_WARM};
  border: 1px solid ${CV_DISTANT};
  border-radius: 0.8rem;
  background: transparent
    linear-gradient(149deg, ${CV_WHITE} 0%, ${CV_WHITE} 100%) 0% 0% no-repeat
    padding-box;
`;

export const WorkspacePlanItem = styled.div`
  padding: 1rem;
  padding-block-start: 5rem;
  min-width: 17rem;
  max-width: 18rem;
  width: 100%;
  justify-self: center;
  &.active {
    ${WorkspacePlanContent} {
      box-shadow: 0px 7px 20px ${CV_DISTANT};
    }
    ${WorkspacePlanImage} {
      box-shadow: 0px 2px 7px ${CV_DISTANT};
    }
  }
`;

export const WorkspacePlansContainer = styled.div`
  padding-inline: 1rem;
  padding-block: 0.5rem;
  display: grid;
  ${({ wrapContent, rowItemsCount = 3, columnWidth = '1fr' }) =>
    !wrapContent &&
    `
  grid-auto-flow: column dense;
  grid-template-columns: ${new Array(+rowItemsCount)
    .fill(columnWidth)
    .join(' ')};
  `}

  ${WorkspacePlanContent} {
    > div:not(${WorkspacePlanImage}) {
      width: 100%;
    }
  }

  ${WorkspaceSecondaryText} {
    padding-block-start: 0.5rem;
    padding-block-end: 1.5rem;
  }

  ${WorkspacePrimaryText} {
    padding-block: 0.5rem;
  }

  .planDescription {
    color: ${TCV_WARM};
    display: flex;
    justify-content: start;
    align-items: center;
    padding-inline: 1rem;
    padding-block: 0.5rem;
    font-size: 0.8rem;
    svg {
      margin-inline-end: 0.4rem;
      font-size: 0.7rem;
      color: ${TCV_DEFAULT};
    }
  }
  .planPrice {
    display: flex;
    justify-content: center;
    align-items: center;
    .noPriceTag,
    .price {
      color: ${TCV_DEFAULT};
      font-weight: bold;
      padding-inline: 0.5rem;
      text-align: center;
      font-size: 1.2rem;
    }
    .offPrice {
      margin-block-start: -0.8rem;
      text-decoration: line-through;
      color: ${CV_RED};
      font-size: 0.8rem;
    }
  }

  .planActionButton {
    margin-block-start: 1.5rem;
  }
`;

export const WorkspacePlansTableContainer = styled.div`
  width: 100%;
  padding-top: 4rem;
  overflow-x: auto;
  scroll-behavior: smooth;
  scrollbar-width: thin;
  table {
    min-width: 100%;
    thead {
      tr {
        border-bottom: 1px solid ${CV_DISTANT};
      }
      th {
        padding-inline: 2rem;
        padding-block-end: 0.6rem;
        font-size: 0.8rem;
        white-space: nowrap;
        color: ${TCV_WARM};
        :not(:first-of-type) {
          text-align: center;
        }
      }
    }
    tbody {
      tr {
        border-bottom: 1px solid ${CV_DISTANT};
        :last-of-type {
          border-bottom-color: transparent;
        }
      }
      td {
        padding-block: 1rem;
        padding-inline: 2rem;

        > div {
          .disabled {
            color: ${CV_RED};
          }
          .enabled {
            color: ${TCV_DEFAULT};
          }
          .info {
            color: ${CV_DISTANT};
          }
        }
        :not(:first-of-type) {
          text-align: center;
          > div {
            text-align: center;
            svg {
              font-size: 1.2rem;
            }
          }
        }
      }
    }
  }
`;

export const WorkspaceAccountSubscriptionContainer = styled.section`
  margin-block-end: 10rem;
`;

export const WorkspaceAccountSubscriptionItem = styled.div.attrs({
  className: 'rv-border-radius-1',
})`
  width: 100%;
  border: 1px solid ${CV_DISTANT};
  padding-inline: 2rem;
  padding-block: 1.2rem;
  margin-block-start: 1.8rem;
  margin-block-end: 1.8rem;
  display: block;
  background: transparent
    linear-gradient(134deg, ${CV_WHITE} 0%, ${CV_WHITE} 100%) 0% 0% no-repeat
    padding-box;

  > div {
    justify-content: space-between;
    display: flex;
    align-items: center;
    text-align: end;

    &:not(:first-of-type) {
      margin-block-start: 2rem;
    }
  }
`;

export const WorkspaceAccountSubscriptionItemTitleContainer = styled.div`
  display: flex;
  text-align: start;
`;

export const WorkspaceAccountSubscriptionItemTitle = styled.div`
  padding-inline-start: 0.5rem;
  padding-block: 0.5rem;
  span {
    text-align: start;
    display: block;

    &:first-of-type {
      padding-block-end: 0.5rem;
    }
  }
`;

export const WorkspaceAccountSubscriptionItemIcon = styled.div`
  display: inline-block;
  padding-inline-end: 0.6rem;

  svg {
    background-color: ${CV_DISTANT};
    color: ${CV_WHITE};
    border-radius: 100%;
    font-size: 1.2rem;
    padding: 0.15rem;
    display: block;
  }
  span {
    text-align: start;
    display: block;
    margin-block-start: 0.5rem;
    color: ${TCV_WARM};
    font-size: 0.9rem;
  }
`;

export const WorkspaceAccountSubscriptionItemIconWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  min-width: 10rem;
  text-align: start;
`;

export const WorkspaceAccountSubscriptionProgressBar = styled.div.attrs({
  className: 'rv-border-radius-1',
})`
  width: 100%;
  height: 0.5rem;
  margin-block-start: 0.5rem;
  background-color: ${TCV_VERY_TRANSPARENT_WARM};
  overflow: hidden;
  display: flex;
  justify-content: flex-end;
  &::after {
    content: '';
    width: ${({ progressPercentage = 0 }) => `${progressPercentage}%`};
    height: 100%;
    border-radius: 1rem;
    background-color: ${TCV_WARM};
  }
`;

export const WorkspaceInvoicePlanHeader = styled.div.attrs({
  className: 'rv-border-radius-1 rv-ignore-bottom-radius',
})`
  background-color: ${CV_WHITE};
  font-size: 1rem;
  justify-content: space-between;
  align-items: center;
  display: flex;
  color: ${TCV_WARM};
  padding-block: 1rem;
  padding-inline: 0.5rem;
  // margin-block-start: 4rem;

  &::before {
    content: '';
    width: 5%;
  }
  svg {
    color: ${TCV_DEFAULT};
    font-size: 1.2rem;
  }
`;

export const WorkspaceInvoicePlanDetailsContainer = styled.div`
  font-size: 1rem;
  justify-content: space-between;
  align-items:center;
  display: flex;
  border-bottom: 1px dashed ${({ noSeparator }) =>
    noSeparator ? `transparent` : CV_GRAY};

  &:last-of-type {
    border-color: transparent;
  }
}

  & > * {
    display: inline-block;
    width: 100%;
    padding: 1rem 0.25rem !important;

    &:first-child {
      text-align: start;
    }
    &:last-child {
      text-align: end;
    }
`;

export const WorkspaceInvoicePlanDetailsPrice = styled(WorkspaceSecondaryText)`
  color: ${TCV_VERYWARM};
  font-weight: bold;
`;

export const WorkspaceInvoicePlanDetailsCoupon = styled(WorkspaceSecondaryText)`
  color: ${CV_RED};
  font-weight: bold;
`;

export const WorkspaceInvoicePlanFormDetailsContainer = styled(
  WorkspaceInvoicePlanDetailsContainer
)`
  color: ${CV_GRAY_DARK};
  > * {
    display: inline-grid;
    font-size: 0.9rem;
  }
  > *:first-child {
    width: 30%;
  }
  > *:last-child {
    width: 20%;
    text-align: start;
    padding-inline-start: 0.5rem;
  }
  > *:nth-child(2) {
    width: 50%;
  }
`;

export const WorkspaceInvoiceCouponIconWrapper = styled.span`
  svg {
    font-size: 1.5rem;
    margin-inline: 1rem;
    color: ${TCV_DEFAULT};
  }
`;

export const WorkspaceInvoicePaymentGatewayContainer = styled.div`
  margin-block-start: 4rem;
`;

export const WorkspaceInvoicePaymentGatewayChoice = styled.div.attrs({
  className: 'rv-border-radius-1',
})`
  margin: 0.5rem;
  overflow: hidden;
  border: 0.15rem solid transparent;
  ${({ active }) =>
    active &&
    `border-color:${TCV_DEFAULT};
   `}
`;

export const WorkspaceInvoicePaymentGatewayChoicesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-block-start: 1.5rem;
`;

export const TeamPattern = styled.img`
  width: 7rem;
  position: absolute;
  top: 0;
  ${({ dir }) => dir}: 0;
  ${({ rtl }) =>
    !rtl &&
    `-webkit-transform: scaleX(-1);
  transform: scaleX(-1);`}
`;
/// workspaceUserManagementContent
export const ExtraUserItem = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 0.45rem 0;
  padding-inline-start: 0.2rem;
  position: relative;
`;

export const ExtraUserTitle = styled.span.attrs({
  className: C_GRAY,
})`
  margin: 0 0.5rem;
`;
