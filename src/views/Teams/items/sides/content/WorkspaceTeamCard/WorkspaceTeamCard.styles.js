import styled from 'styled-components';
import {
  BG_WHITE,
  C_GRAY,
  C_GRAY_DARK,
  TC_VERY_TRANSPARENT,
  C_DISTANT,
  BO_DISTANT,
} from 'constant/Colors';
import {
  BO_RADIUS_CIRCLE,
  BO_RADIUS_HALF,
  BO_RADIUS_QUARTER,
} from 'constant/constants';
import { FLEX_CSC, FLEX_RCS } from 'constant/StyledCommonCss';
import {
  CV_FREEZED,
  CV_RED,
  CV_WHITE,
  TCV_DEFAULT,
  TCV_VERYWARM,
  TCV_VERY_TRANSPARENT,
  CV_DISTANT,
  CV_GRAY,
  CV_GRAY_DARK,
  TCV_WARM,
} from 'constant/CssVariables';
import Avatar from 'components/Avatar/Avatar';

const { RV_Float, RV_RTL, RV_RevFloat } = window;

export const TeamActionContainer = styled.div.attrs({
  className: `${C_GRAY} ${BG_WHITE} ${BO_RADIUS_QUARTER}`,
})`
  ${FLEX_CSC}
  cursor: pointer;
  min-width: 7rem;
  min-height: 2.2rem;
  padding: 0 0.8rem;
  box-shadow: 1px 3px 20px ${TCV_VERY_TRANSPARENT};

  .team-action-title {
    margin: 0.5rem;
    font-size: 0.8rem;
    font-weight: 500;
    &:first-letter {
      text-transform: uppercase;
    }
  }
  .team-action-icon {
    ${FLEX_RCS}
    width: 1rem;
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

export const TeamTitle = styled.div.attrs({
  className: C_GRAY_DARK,
})`
  font-size: 1rem;
  margin: 0.5rem 0;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;

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

export const TeamFooterContainer = styled.div`
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

export const ExtraUsersWrapper = styled.div`
  position: relative;
  ${RV_RevFloat}: 1.7rem;
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

export const AddUserWrapper = styled.div.attrs({
  className: `${BO_RADIUS_CIRCLE}`,
})`
  width: 2.5rem;
  height: 2.5rem;
  background-color: ${CV_FREEZED};
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 3.5rem;
  ${({ rtl }) => rtl && 'transform: scaleX(-1);'}
  position: relative;
  ${getPosition}
`;

export const MoreIconWrapper = styled.div.attrs({
  className: `${BO_RADIUS_CIRCLE}`,
})`
  ${FLEX_RCS}
  padding: 0.2rem;
  background-color: ${CV_FREEZED};
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
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

export const ExtraUserItemAvatar = styled(Avatar)`
  flex-shrink: 0;
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
export const NewTeamLabel = styled.div.attrs({
  className: C_DISTANT,
})`
  margin: 1rem 0 0 0;
  font-size: 1.2rem;

  &:first-letter {
    text-transform: uppercase;
  }
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
    margin-inline-start: auto;
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
