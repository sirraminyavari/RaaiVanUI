import withTheme from 'components/withTheme/withTheme';
import styled, { css } from 'styled-components';
import {
  CLOSE_WIDTH,
  BO_RADIUS_HALF,
  BO_RADIUS_CIRCLE,
  TEAMS_PATH,
} from 'constant/constants';
import Input from 'components/Inputs/Input';
import {
  TBG_WARM,
  TC_DEFAULT,
  TC_WARM,
  C_GRAY,
  BG_GRAY_LIGHT,
  C_GRAY_DARK,
  C_BLACK,
  C_FREEZED,
  BG_FREEZED,
  BG_WHITE,
  C_DISTANT,
  BO_FREEZED,
} from 'constant/Colors';
import {
  CV_DISTANT,
  CV_FREEZED,
  CV_RED,
  CV_WHITE,
  TCV_DEFAULT,
  TCV_VERY_TRANSPARENT,
} from 'constant/CssVariables';

const { RV_RevFloat, RV_Float, RV_RTL, RVGlobal } = window;

const getNavbarWidth = ({ theme, isMobile }) => {
  if (!!theme.states.selectedTeam?.id || !!RVGlobal.ApplicationID) {
    if (theme.states.activePath === TEAMS_PATH) {
      return css`
        width: 100%;
      `;
    }
    return css`
      width: calc(
        100% -
          ${!theme.states.hideSidebar /*//! hide sidebar view completely*/
            ? !isMobile
              ? theme.states.isSidebarOpen
                ? theme.states.sidebarCurrentWidth / 16
                : CLOSE_WIDTH
              : CLOSE_WIDTH
            : 0}rem
      );
    `;
  }
  return css`
    width: 100%;
  `;
};

const commonNavCss = css`
  height: 4rem;
  position: fixed;
  display: flex;
  z-index: 900;
  justify-content: space-between;
  align-items: center;
  top: 0;
  ${RV_RevFloat}: 0;
  opacity: 1;
  padding: 0 1.5rem;
  box-shadow: 0 3px 10px #00000029;
`;

export const NavbarContainer = withTheme(styled.div.attrs({
  className: TBG_WARM,
})`
  ${getNavbarWidth}
  ${commonNavCss}
  user-select: none;

  .avatar-tooltip {
    background-color: ${CV_WHITE} !important;
    opacity: 1 !important;
    box-shadow: 1px 3px 20px ${TCV_VERY_TRANSPARENT} !important;
    padding: 0 !important;
    border-radius: 0.8rem !important;
  }
`);

export const InitialNavbarContainer = styled.div.attrs({
  className: TBG_WARM,
})`
  width: 100%;
  ${commonNavCss}
`;

export const WideScreenMenu = styled.div`
  height: 100%;
  padding: 0.2rem 0;
  display: flex;
`;

//! Due to this error >>>> "React does not recognize the {prop} prop on a DOM element"
const DIV = styled.div``;

export const ButtonContainer = styled(({ isActive, ref, ...props }) => (
  <DIV {...props} />
))`
  width: 4.7rem;
  height: 111%;
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  top: -0.2rem;
  padding: 0.5rem;
  border-bottom: ${({ isActive }) => (isActive ? '0.2rem solid #fff' : '')};

  &:hover {
    background-color: ${TCV_VERY_TRANSPARENT};
  }

  &:hover span {
    transform: rotateX(180deg);
  }
`;
export const ButtonIcon = styled.div.attrs({
  className: C_FREEZED,
})`
  text-align: center;
  position: relative;
  font-size: 1.3rem;
`;

export const ButtonTitle = styled.div.attrs({
  className: C_FREEZED,
})`
  font-size: 0.7rem;
  font-weight: bold;
  opacity: 1;
  position: relative;
  bottom: 5px;
  width: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: capitalize;
`;

export const BadgeWrapper = styled.div`
  position: absolute;
  top: 0.3rem;
  ${`${RV_Float}: 0.7rem;`}
`;

export const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  color: inherit;

  .navbar-avatar {
    cursor: pointer;
    min-width: 2.5rem;
    width: 2.5rem;
    min-height: 2.5rem;
  }
`;

export const ExitAndHelpWrapper = styled.div`
  display: flex;
  align-items: center;
  color: inherit;
`;

export const ExitIconWrapper = styled.div.attrs({
  className: `${C_FREEZED} ${BO_RADIUS_CIRCLE}`,
})`
  display: flex;
  align-items: center;
  justify-content: center;
  ${RV_RTL &&
  `-webkit-transform: scaleX(-1);
  transform: scaleX(-1);`}
  cursor: pointer;
  padding: 0.5rem;
`;

export const QuestionIconWrapper = styled.div.attrs({
  className: `${C_FREEZED} ${BO_RADIUS_CIRCLE}`,
})`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0.85rem 0.75rem;
`;

export const SearchContainer = styled.div`
  margin: 0 1rem;
  position: relative;
  height: 4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;

  :focus-within input {
    width: 16rem;
  }
  :focus-within svg {
    color: ${TCV_DEFAULT} !important;
  }
`;

export const SearchInput = styled(Input)`
  border: none;
  outline: 0;
  height: 2rem;
  padding: 0.1rem 0.6rem;
  width: 14rem;
  transition: all 0.6s ease;
  :focus::placeholder {
    color: transparent;
  }
  ::placeholder {
    color: ${CV_DISTANT};
    text-transform: capitalize;
  }
`;

export const SearchIcon = styled.div`
  position: absolute;
  ${`${RV_RevFloat}: 0.3rem;`}
  top: 0.3rem;
  font-size: 1.5rem;
  color: ${CV_DISTANT};
`;

export const FixActionsContainer = styled.div.attrs({
  className: `${BG_GRAY_LIGHT} ${BO_RADIUS_HALF}`,
})`
  width: 12rem;
  height: auto;
  padding: 0.5rem;
  margin: -0.7rem;
  overflow: hidden;
  box-shadow: 1px 3px 20px ${TCV_VERY_TRANSPARENT};
`;

export const NotificationsMenuContainer = styled.div.attrs({
  className: `${BG_GRAY_LIGHT} ${BO_RADIUS_HALF}`,
})`
  width: 23rem;
  height: auto;
  min-height: 3rem;
  padding-bottom: 0;
  margin: -0.7rem 0;
  overflow: hidden;
  box-shadow: 1px 3px 20px ${TCV_VERY_TRANSPARENT};
`;

export const EmptyNotifs = styled.div`
  text-align: center;
  line-height: 3rem;
  font-size: 0.9rem;
`;

export const NotifItemContainer = styled.div.attrs({
  className: `${BO_FREEZED} ${BO_RADIUS_HALF} ${BG_WHITE}`,
})`
  width: 100%;
  height: 5rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  max-height: 6rem;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  position: relative;
`;

export const NotifItemCloseIcon = styled.div.attrs({
  className: `${BO_RADIUS_CIRCLE}`,
})`
  color: ${CV_RED};
  position: absolute;
  top: 0.3rem;
  ${RV_RevFloat}: 0rem;
  padding: 0.1rem 0.25rem;
  cursor: pointer;
`;

export const NotifAvatarWrapper = styled.div`
  border: 1px solid #fff;
  border-left-color: ${CV_FREEZED};
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-inline-end: 0.3rem;
`;

export const NotifContentWrapper = styled.div`
  height: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  margin-inline-start: 1rem;
  padding: 0;
`;

export const NotifMessageWrapper = styled.div.attrs({
  className: TC_WARM,
})`
  max-height: 2.2rem;
  overflow: hidden;
`;

export const NotifTimeWrapper = styled.div.attrs({
  className: C_GRAY,
})`
  font-size: 0.8rem;
`;

export const NotifHeaderContainer = styled.div`
  margin: 0.2rem 0;
  padding: 0.2rem 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const CheckAllNotifsWrapper = styled.div.attrs({
  className: `${TC_DEFAULT} ${BG_WHITE} ${BO_RADIUS_CIRCLE}`,
})`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  padding: 0 0.3rem;
`;

export const UnreadNotifs = styled.span.attrs({
  className: `${C_DISTANT}`,
})`
  font-size: 0.9rem;
`;

export const AlertFooterNavigation = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const AlertFooterArrowWrapper = styled.div.attrs({
  className: `${TC_DEFAULT} ${BG_FREEZED} ${BO_RADIUS_CIRCLE}`,
})`
  min-width: 1.4rem;
  padding: 0.1rem;
  margin: 0 0.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  user-select: none;
`;

export const ButtonAction = styled.div.attrs({
  className: `${C_GRAY_DARK} ${BO_RADIUS_HALF}`,
})`
  display: flex;
  place-items: center;
  margin: 0.3rem 0;
  padding: 0.3rem 0.8rem;
  transition: all 0.5s ease;
  :hover {
    background-color: ${CV_FREEZED};
  }
`;

export const ActionTitle = styled.span`
  margin: 0.3rem 0.5rem;
  text-transform: capitalize;
`;

export const NavMenuContainer = styled.div`
  cursor: pointer;
  position: relative;
`;

export const MenuOptionsWrapper = styled.div.attrs({
  className: `${BG_GRAY_LIGHT} ${BO_RADIUS_HALF}`,
})`
  height: 12rem;
  width: 17rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  box-shadow: 1px 3px 20px ${TCV_VERY_TRANSPARENT};
  margin: -10px;
`;

export const NavMenuOption = styled.div.attrs({
  className: TC_WARM,
})`
  width: 33%;
  height: 33%;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
`;

export const Arrow = styled.span`
  width: 0;
  height: 0;
  margin: 0 0.2rem;
  border-left: 0.3rem solid transparent;
  border-right: 0.3rem solid transparent;
  border-top: 0.3rem solid ${CV_WHITE};
  transition: all 0.5s ease;
`;

export const AvatarMenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 14rem;
  margin: 0.5rem;
  margin-inline-start: 1rem;
  margin-inline-end: 0;
`;

export const AvatarMenuItem = styled.div.attrs({
  className: C_BLACK,
})`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0.4rem 0;
  cursor: pointer;
`;

export const AvatarMenuTitle = styled.span`
  padding: 0 0.6rem;
  font-size: 0.85rem;
  text-transform: capitalize;
  color: ${({ color }) => color};
  width: 12rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Divider = styled.div`
  margin: 0.5rem;
  margin-inline-start: -1rem;
  margin-inline-end: 0;
  border-top: 0.1rem solid ${CV_DISTANT};
`;
