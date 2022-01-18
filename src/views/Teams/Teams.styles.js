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
  TCV_WARM,
} from 'constant/CssVariables';
import { FLEX_CSC, FLEX_RCS } from 'constant/StyledCommonCss';

const { RV_Float, RV_RTL, RV_RevFloat } = window;

export const HeaderContainer = styled.div.attrs({
  className: BG_GRAY_LIGHT,
})`
  padding: 0;
  margin: 0;
  width: 100%;
  height: 5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ModalContentWrapper = styled.div`
  width: calc(100% + 2rem);
  height: calc(100vh - 9rem);
  overflow: scroll;
  margin-top: 2.5rem;
  margin-${RV_Float}: -1rem;
  padding: 0 1rem;

  .ps__rail-y {
    ${RV_Float}: calc(100% - 1rem) !important;
  }
`;

export const ArchivedTeamWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0.9rem 0;
`;

export const ArchivedTeamDescription = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-grow: 1;
  width: calc(100% - 5rem);
`;

export const ArchivedTeamTitle = styled.span`
  margin: 0 1rem;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const HeaderTitle = styled.span.attrs({
  className: C_GRAY,
})`
  font-size: 1.1rem;
  font-weight: 500;
`;

export const SpaceListContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  //TODO: remove it when space exists.
  margin-top: 2rem;
`;

export const SpaceConatiner = styled.div`
  width: 100%;
  margin: 0 0 1rem 0;
`;

export const SpaceHeaderContainer = styled.div.attrs({
  className: `${BG_GRAY_LIGHT}`,
})`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 0 0.2rem 0;
  position: sticky;
  top: 4rem;
  z-index: 200;
  padding: 1rem 0;
`;

export const SpaceHeaderTitle = styled.div.attrs({
  className: C_GRAY_DARK,
})`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 1rem;
  font-size: 1rem;
  font-weight: bold;
`;

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

export const SpaceHeaderActions = styled.div`
  width: 3rem;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const IconWrapperCss = css`
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 50%;
`;

export const TrashIconWrapper = styled.div.attrs((props) => ({
  className: `${C_DISTANT} ${BG_WHITE}`,
}))`
  ${IconWrapperCss}
  padding: 0.5rem;
  :hover {
    color: ${CV_RED} !important;
  }
`;

export const SettingIconWrapper = styled.div.attrs((props) => ({
  className: `${C_DISTANT} ${BG_WHITE}`,
}))`
  ${IconWrapperCss}
  padding: 0.4rem;
  margin: 0 0.2rem;
  :hover {
    color: ${TCV_DEFAULT} !important;
  }
`;

export const TeamListConatiner = styled.div`
  white-space: wrap;
  &:after {
    content: '';
    clear: both;
    display: table;
  }
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

  .extra-users-scrollbar {
    height: 8rem;
    padding-${RV_Float}: 0.5rem;

    .ps__rail-y {
      ${RV_Float}: ${RV_RTL ? '-0.35rem' : '-0.1rem'} !important;
    }
  }

  .invite-modal-container {
    margin-top: 4rem;
  }
`;

export const ArchivedTeamsModalContainer = styled.div`
  .archived-teams-title {
    position: fixed;
    width: ${({ modalWidth }) => modalWidth};
    padding: 1rem;
    background-color: ${CV_GRAY_LIGHT};
    z-index: 1000;
  }

  .archived-teams {
    max-height: calc(100vh - 4.5rem);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
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

export const TeamContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

export const TeamDescription = styled.div`
  flex-grow: 1;
`;

export const TeamAvatarWrapper = styled.div.attrs({
  className: `${BO_RADIUS_CIRCLE}`,
})`
  width: 3.2rem;
  position: relative;

  :hover > div {
    opacity: 1;
  }
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

export const TeamTitle = styled.div.attrs({
  className: C_GRAY_DARK,
})`
  font-size: 1rem;
  margin: 0.5rem 0;
  font-weight: 500;

  .team-inline-edit-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 50%;
    padding: 0.2rem 0.5rem;

    :hover {
      border: 1px solid ${CV_DISTANT};
      border-radius: 0.3rem;
    }
  }
`;

export const TeamExcerpt = styled.div.attrs({
  className: C_GRAY,
})`
  font-size: 0.8rem;
  margin: 0.5rem 0;
`;

export const TeamFooterConatiner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;

  .team-more-icon {
    color: ${CV_DISTANT};

    :hover {
      color: ${TCV_DEFAULT};
    }
  }

  .team-more-tooltip {
    // background-color: ${CV_WHITE} !important;
    // box-shadow: 1px 3px 20px ${TC_VERY_TRANSPARENT} !important;
  }
`;

export const TeamAvatarsWrapper = styled.div`
  ${FLEX_RCS}
`;

export const MoreIconWrapper = styled.div.attrs({
  className: `${BO_RADIUS_CIRCLE}`,
})`
  ${FLEX_RCS}
  padding: 0.2rem;
  background-color: ${CV_FREEZED};
`;

const getPosition = ({ dir, usersCount }) => {
  if (usersCount === 4) {
    return `${dir}: 1.7rem`;
  } else if (usersCount === 3) {
    return `${dir}: 1.2rem`;
  } else if (usersCount === 2) {
    return `${dir}: 0.6rem`;
  } else {
    return `${dir}: 0`;
  }
};

export const ExtraUsersWrapper = styled.div`
  position: relative;
  ${RV_RevFloat}: 1.7rem;
`;

export const ExtraUsersPopupHeader = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: ${TCV_DEFAULT};
  margin: 0.1rem 0.55rem;
`;

export const ExtraUsersPopupTitle = styled.span`
  margin: 0 0.5rem;
`;

export const AddUserWrapper = styled.div.attrs({
  className: `${BO_RADIUS_CIRCLE}`,
})`
  width: 2.5rem;
  height: 2.5rem;
  background-color: ${CV_FREEZED};
  text-align: center;
  line-height: 3.5rem;
  ${({ rtl }) => rtl && 'transform: scaleX(-1);'}
  position: relative;
  ${getPosition}
`;

export const ExtraUserItem = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 0.45rem 0;
  padding-${RV_Float}: 0.2rem;
  position: relative;
`;

export const ExtraUserTitle = styled.span.attrs({
  className: C_GRAY,
})`
  margin: 0 0.5rem;
`;

export const TeamActionContainer = styled.div.attrs({
  className: `${C_GRAY} ${BG_WHITE} ${BO_RADIUS_QUARTER}`,
})`
  ${FLEX_CSC}
  cursor: pointer;
  min-width: 7rem;
  min-height: 2.2rem;
  padding: 0 0.8rem;
  box-shadow: 1px 3px 20px ${TCV_VERY_TRANSPARENT};
  text-transform: capitalize;

  .team-action-title {
    margin: 0.5rem;
    font-size: 0.8rem;
    font-weight: 500;
  }
`;

export const TeamDeleteWrapper = styled.div`
  ${FLEX_RCS}

  :hover {
    color: ${CV_RED} !important;
  }
`;

export const TeamExitWrapper = styled.div`
  ${FLEX_RCS}

  & svg {
    transform: scaleX(-1);
  }

  :hover {
    color: ${TCV_VERYWARM} !important;
  }
`;

export const NewTeamWrapper = styled.div.attrs({
  className: C_DISTANT,
})`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const ArchivedWrapper = styled.div.attrs({
  className: C_RED,
})`
  width: 100%;
  height: 90%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  font-size: 1rem;
`;

export const NewTeamLabel = styled.div.attrs({
  className: C_DISTANT,
})`
  margin: 1rem 0 0 0;
  font-size: 1.2rem;
`;

export const ArchivedTeamsLabel = styled.div.attrs({
  className: C_RED,
})`
  margin: 1rem 0 0 0;
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
  width: 60%;
  // max-width: 18rem;
  margin-block-start: 5rem;
  aspect-ratio: 1;
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

export const AddUserModalHeader = styled.div`
  text-align: center;
  position: relative;
  width: 3.2rem;
  margin: auto;
  color: ${CV_DISTANT};
`;

export const AddUserPlusSign = styled.span`
  position: absolute;
  top: -0.3rem;
  left: 0;
  font-weight: bold;
  font-size: 1rem;
`;

export const AddUserActionsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;

  .active-tab {
    width: 47%;
    background-color: #fff;
    font-size: 1rem;
    font-weight: 500;
    color: ${TCV_WARM};
  }

  .inactive-tab {
    width: 47%;
    border-color: #fff;
    background-color: #fff;
    font-size: 1rem;
    font-weight: 500;

    :hover {
      border-color: ${TCV_DEFAULT};
    }
  }
`;

export const InviteContent = styled.div.attrs({
  className: `${BO_RADIUS_HALF} ${BO_DISTANT}`,
})`
  margin-top: 1.5rem;
  padding: 1.5rem;

  .send-invitation-button {
    width: 8rem;
    margin-${RV_Float}: auto;
  }
`;

export const GetLinkTitle = styled.span`
  font-size: 1rem;
  font-weight: 500;
  color: ${CV_GRAY_DARK};
`;

export const GetLinkInfoWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

export const GetLinkInfoTitle = styled.span`
  font-size: 0.8rem;
  color: ${CV_DISTANT};
  margin: 0.3rem;
`;

export const GetLinkFieldWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.8rem;

  .get-link-input {
    width: 100%;
    margin: 0 1rem;
    text-align: left;
    color: ${CV_GRAY};
    background-color: ${CV_FREEZED};
    border-color: ${CV_DISTANT};
    padding-left: 1rem;
    padding-right: 1rem;
    font-size: 1rem;
  }
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
