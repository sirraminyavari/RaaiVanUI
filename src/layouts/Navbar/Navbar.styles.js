import withTheme from 'components/withTheme/withTheme';
import styled, { css } from 'styled-components';
import {
  CLOSE_WIDTH,
  BO_RADIUS_HALF,
  BO_RADIUS_CIRCLE,
} from 'constant/constants';
import Input from 'components/Inputs/Input';
import {
  TBG_WARM,
  TC_DEFAULT,
  TC_WARM,
  C_GRAY,
  BG_GRAY_LIGHT,
  BO_DISTANT,
  C_GRAY_DARK,
  C_BLACK,
  C_FREEZED,
  BG_FREEZED,
} from 'constant/Colors';
import {
  CV_DISTANT,
  CV_WHITE,
  TCV_VERY_TRANSPARENT,
} from 'constant/CssVariables';

const { RV_RevFloat, RV_Float, RV_RTL } = window;

const getNavbarWidth = ({ theme, isMobile }) => {
  if (!!theme.states.selectedTeam?.id) {
    return css`
      width: calc(
        100% -
          ${!isMobile
            ? theme.states.isSidebarOpen
              ? theme.states.sidebarCurrentWidth / 16
              : CLOSE_WIDTH
            : CLOSE_WIDTH}rem
      );
    `;
  }
  return css`
    width: 100%;
  `;
};

export const NavbarContainer = withTheme(styled.div.attrs({
  className: TBG_WARM,
})`
  ${getNavbarWidth}
  height: 4rem;
  position: fixed;
  display: flex;
  z-index: 900;
  justify-content: space-between;
  align-items: center;
  top: 0;
  ${`${RV_RevFloat}: 0;`}
  opacity: 1;
  padding: 0 1.5rem;
  box-shadow: 0 3px 10px #00000029;
  // transition: all 0.7s ease;

  // .no-arrow {
  //   display: none;
  // }

  .avatar-tooltip {
    background-color: ${CV_WHITE} !important;
    opacity: 1 !important;
    box-shadow: 1px 3px 20px ${TCV_VERY_TRANSPARENT} !important;
    padding: 0 !important;
  }
`);

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
  :focus-within input {
    width: 16rem;
  }
  :focus-within svg {
    color: #2b7be4 !important;
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
  color: #ddd;
`;

export const FixActionsContainer = styled.div.attrs({
  className: `${BG_GRAY_LIGHT} ${BO_RADIUS_HALF}`,
})`
  width: 12rem;
  height: auto;
  padding: 0.5rem;
  margin: -0.7rem;
  overflow: hidden;
  box-shadow: 1px 3px 20px #2b7be44d;
`;

export const AlertActionsContainer = styled.div.attrs({
  className: `${BG_GRAY_LIGHT} ${BO_RADIUS_HALF}`,
})`
  width: 23rem;
  height: auto;
  min-height: 3rem;
  padding: 1rem;
  padding-bottom: 0;
  margin: -0.7rem 0;
  overflow: hidden;
  box-shadow: 1px 3px 20px #2b7be44d;
`;

export const AlertListContainer = styled.div`
  width: 100%;
  height: auto;
  margin: 0;
  margin-bottom: 1.7rem;
  padding: 0;
`;

export const EmptyAlert = styled.div`
  text-align: center;
`;

export const AlertItemContainer = styled.div.attrs({
  className: `${BO_DISTANT} ${BO_RADIUS_HALF}`,
})`
  width: 100%;
  height: 5rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  max-height: 6rem;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
`;

export const AlertContentWrapper = styled.div`
  height: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  margin-right: 1rem;
  padding: 0.3rem 0;
`;

export const AlertMessageWrapper = styled.div.attrs({
  className: TC_WARM,
})`
  max-height: 2.2rem;
  overflow: hidden;
`;

export const AlertTimeWrapper = styled.div.attrs({
  className: C_GRAY,
})`
  font-size: 0.7rem;
`;

export const AlertFooterContainer = styled.div`
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  bottom: 1rem;
`;

export const AlertFooterCheckWrapper = styled.div.attrs({
  className: TC_DEFAULT,
})`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
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
    background-color: #eef0f5;
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
  box-shadow: 1px 3px 20px #2b7be44d;
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
  border-top: 0.3rem solid #fff;
  transition: all 0.5s ease;
`;

export const AvatarMenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 14rem;
  margin: 0.5rem;
  margin-${RV_Float}: 1rem;
  margin-${RV_RevFloat}: 0;

  .ps__rail-y {
    ${RV_RTL ? 'right: 13rem !important;' : 'left: 13.3rem !important;'}
  }
`;

// export const AvatarTeamsListWrapper = styled.div`
// max-height: calc(100vh - 18rem);
// overflow: scroll;
// margin-bottom: 3rem;
// `;

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
  margin-${RV_Float}: -1rem;
  margin-${RV_RevFloat}: 0;
  border-top: 0.1rem solid ${CV_DISTANT};
`;
