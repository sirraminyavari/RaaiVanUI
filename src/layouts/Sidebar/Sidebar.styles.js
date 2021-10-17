import styled, { css } from 'styled-components';
import withTheme from 'components/withTheme/withTheme';
import {
  BO_RADIUS_CIRCLE,
  BO_RADIUS_QUARTER,
  CLOSE_WIDTH,
} from 'constant/constants';
import sidebarPattern from 'assets/images/pattern_soft.svg';
import {
  TBO_WARM,
  C_DISTANT,
  C_WHITE,
  C_RED,
  BO_GRAY,
  C_GRAY,
  TBG_VERYWARM,
  BO_WHITE,
} from 'constant/Colors';
import { CV_FREEZED, CV_WHITE } from 'constant/CssVariables';
import { FLEX_RCC } from 'constant/StyledCommonCss';

const { RV_Float, RV_RevFloat, RV_RTL, RVDic } = window;

const FlexBetween = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FlexCenter = css`
  display: flex;
  place-items: center;
`;

const TruncateTextCss = css`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const TitleText = styled.span.attrs({ className: C_WHITE })`
  margin: 0.5rem;
  text-transform: capitalize;
  user-select: none;
  ${TruncateTextCss}
`;

export const CenterIcon = styled.div`
  ${FlexCenter}
`;

const openSidebar = css`
  width: 100%;
`;

const closeSidebar = css`
  width: ${CLOSE_WIDTH}rem;
  position: fixed;
  z-index: 1000;
  top: 0;
`;

const getSidebarCss = (props) => {
  const { isOpen } = props;
  if (isOpen) {
    return openSidebar;
  } else {
    return closeSidebar;
  }
};

export const SidebarContainer = styled.div.attrs({
  className: `${TBG_VERYWARM} ${C_WHITE}`,
})`
  height: 100%;
  ${getSidebarCss}
  ${`${RV_Float}: 0;`}
  overflow: hidden;
  user-select: none;
  box-shadow: 1px 0px 15px 1px #000;
  ${({ hasPattern }) =>
    hasPattern && `background-image: url(${sidebarPattern});`}
`;

export const SidebarMobileContainer = styled.div.attrs({
  className: `${TBG_VERYWARM} ${C_WHITE}`,
})`
  height: 100%;
  width: 70vw;
  position: fixed;
  z-index: 1000;
  top: 0;
  ${`${RV_Float}: 0;`}
  overflow: hidden;
  box-shadow: 1px 0px 15px 1px #000;
  ${({ hasPattern }) =>
    hasPattern && `background-image: url(${sidebarPattern});`}
`;

export const ContentWrapper = withTheme(styled.div`
  width: 100%;
  position: absolute;
  top: 0;
  bottom: ${(props) => (props.theme.states.isSettingShown ? '-6%' : '-1rem')};
  overflow: auto;
  margin-top: 4rem;
  // padding: 0 ${(props) =>
    props.theme.states.isSidebarOpen ? '1.5rem' : '0'};
  margin-bottom: ${({ isMainContent }) => (isMainContent ? '11.5vh' : '3vh')};
  display: flex;
  flex-direction: column;
  align-items: center;

  .ps__thumb-y {
    background-color: ${CV_WHITE} !important;
  }
  .ps__rail-y:hover {
    background-color: transparent !important;
  }
  .ps__rail-y {
    ${RV_Float}: 0rem !important;
  }
`);

const getHeaderWidth = (props) => {
  const {
    isSidebarOpen,
    sidebarCurrentWidth,
    sidebarCloseWidth,
  } = props.theme.states;
  const openWidth = css`
    width: ${sidebarCurrentWidth / 16}rem;
  `;
  const closeWidth = css`
    width: ${sidebarCloseWidth / 16}rem;
  `;

  const openMobileWidth = css`
    width: 70vw;
  `;

  if (isSidebarOpen) {
    return props.isMobile ? openMobileWidth : openWidth;
  } else {
    return closeWidth;
  }
};

export const SidebarHeader = withTheme(styled.div.attrs({
  className: TBG_VERYWARM,
})`
  ${FlexBetween}
  height: 4rem;
  ${getHeaderWidth}
  z-index: 10;
  padding: 0
    ${(props) => (props.theme.states.isSidebarOpen ? '1.4rem' : '0.8rem')};
  position: fixed;
  top: 0;
  ${({ hasPattern }) =>
    hasPattern && `background-image: url(${sidebarPattern});`}
`);

// export const OpenContentWrapper = styled.div`
//   width: 100%;
//   position: relative;
// `;

export const ToggleArrow = styled.div.attrs({
  className: C_WHITE,
})`
  height: 1.5rem;
  margin-${RV_Float}: 0.7rem;
  cursor: pointer;
`;

export const SidebarTitle = styled.div`
  ${FlexBetween}
  font-size: 1rem;
  height: 3.7rem;
  margin-${RV_Float}: 0.5rem;
`;

export const SearchWrapper = styled.div.attrs({
  className: BO_GRAY,
})`
  border-width: 1px;
  border-style: solid;
  border-top: 0;
  border-left: 0;
  border-right: 0;
  margin-bottom: 1rem;
  padding: 0.3rem;
  position: relative;

  svg {
    color: ${CV_FREEZED};
  }

  :focus-within svg {
    color: ${CV_WHITE};
  }

  // :focus-within div:first-child {
  //   display: revert;
  // }

  :focus-within ::placeholder {
    color: ${CV_WHITE};
  }
`;

export const SearchInput = styled.input.attrs((props) => ({
  type: props.type || 'search',
  placeholder: props.text || RVDic.Search,
}))`
  width: 100%;
  background-color: inherit;
  border: none;
  outline: 0;
  user-select: none;
  ${({ isTyping }) =>
    isTyping
      ? `
      transform: translate(${RV_RTL ? '-1.5rem' : '1.5rem'});
      width: 80%;
      `
      : null}

  ::placeholder {
    color: ${CV_FREEZED};
    text-transform: capitalize;
  }

  transition: all 0.3s ease;
`;

export const SearchList = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0 1rem;
`;

export const SidebarFooter = styled.div`
  height: 6%;
  position: relative;
  top: 94%;
`;

export const FooterButton = styled.div`
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  margin: 0 1.2rem 0 1.3rem;
  margin-top: -0.6rem;
  padding: 0.3rem;
  cursor: pointer;
`;

export const FooterIconWrapper = withTheme(styled.div`
  margin-${RV_Float}: 0;
  margin-top: 0;
`);

export const FooterTitle = withTheme(styled.span`
  margin: 0 0.5rem;
  position: relative;
  top: 0;
  transition: all 0.5s linear;
  text-transform: capitalize;
  user-select: none;
  display: ${(props) =>
    props.theme.states.isSidebarOpen ? 'revert' : ' none'};
`);

export const MenuContainer = styled.div.attrs((props) => ({
  // ${props.isExpanded ? TBO_DEFAULT : BO_GRAY_DARK}
  className: `${BO_RADIUS_QUARTER}`,
}))`
  ${FlexBetween}
  width: ${({ indentStep }) => `calc(100% - ${indentStep}px)`};
  // border-width: 1px;
  // border-style: solid;
  height: 2.2rem;
  margin: 0.5rem 0;
  margin-${RV_Float}: ${({ indentStep }) => `${indentStep}px`};
  background-color: ${({ isExpanded, isSelected }) =>
    isExpanded
      ? 'rgb(43,123,228, 0.2)'
      : isSelected
      ? 'rgba(43,56,143, 0.4)'
      : 'inherit'};
  &:hover {
    background: rgb(43, 123, 228, 0.2);
    // border: ${({ isExpanded }) => (isExpanded ? 'initial' : 'none')};
  }

  &:hover > div > div:first-child {
    display: revert !important;
  }

  &:focus-within > div > div:first-child {
    display: revert !important;
  }
`;

export const MenuTitleWrapper = styled.div`
  ${FLEX_RCC}
  width: ${({ isManageContent }) => (isManageContent ? '80%' : '100%')};
  padding: 0 0.5rem;
`;

export const SubMenuTitleWrapper = styled.div`
  margin: 0 0.4rem;
  width: 85%;
  display: flex;
  align-items: center;
`;

export const MenuTitle = styled.span.attrs({ className: C_WHITE })`
  display: inline-block;
  width: 100%;
  margin-${RV_Float}: 0.6rem;
  user-select: none;
  padding: 0.35rem 0;
${TruncateTextCss}
`;

export const CaretIconWrapper = styled.div`
  display: inline-block;
  margin-top: 0.5rem;
`;

export const MenuItemImage = styled.img.attrs({
  className: `${BO_WHITE} ${BO_RADIUS_CIRCLE}`,
})`
  max-width: 1.8rem;
  min-width: 1.75rem;
  max-height: 1.8rem;
  width: 1.8rem;
  height: 1.8rem;
  overflow: hidden;
`;

export const HighlightedTitle = styled.span`
  margin-${RV_Float}: 0.6rem;
`;

export const ListItemWrapper = styled.div.attrs({
  className: `${C_WHITE} ${BO_RADIUS_QUARTER}`,
})`
  ${FlexBetween}
  padding: 0 0.5rem;
  cursor: pointer;
  &:hover {
    background: rgb(43, 123, 228, 0.2);
  }
`;

export const DragIconWrapper = styled.div`
  line-height: 0.5rem;
  cursor: move; /* fallback: no url() support or images disabled */
  cursor: url('https://www.google.com/intl/en_ALL/mapfiles/openhand.cur'),
    all-scroll !important;
`;

export const TrashIconWrapper = styled.div.attrs({ className: C_RED })`
  cursor: pointer;
  margin: 0 0.3rem;
  display: none;
`;

export const TickIconWrapper = styled.div`
  cursor: pointer;
`;

export const ActionsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 0.5rem;
`;

export const SettingWrapper = styled.div.attrs({
  className: BO_RADIUS_CIRCLE,
})`
  line-height: 0.5rem;
  cursor: pointer;
  padding: 0.3rem;
  position: relative;
  ${({ isClose }) => !!isClose && `${RV_RevFloat}: 0.25rem;`}
`;

export const PanelWrapper = styled.div.attrs({
  className: `${C_WHITE} ${BO_RADIUS_QUARTER}`,
})`
  ${FlexCenter}
  margin: 0.5rem 0;
  margin-${RV_Float}: 0.5rem;
  padding: 0.5rem;
  cursor: pointer;
  background-color: ${({ isSelected }) =>
    isSelected ? 'rgba(43,56,143, 0.2)' : 'inherit'};
  :hover {
    background-color: rgb(43, 123, 228, 0.2);
  }
  transition: all 0.3s linear;
`;

export const SettingItemWrapper = styled.div.attrs({
  className: `${C_WHITE} ${BO_RADIUS_QUARTER}`,
})`
  ${FlexCenter}
  margin: 0.5rem 0;
  margin-${RV_Float}: 0.5rem;
  padding: 0.5rem;
  cursor: pointer;
  :hover {
    background-color: rgb(43, 123, 228, 0.2);
  }
  transition: all 0.3s linear;
`;

export const PanelImage = styled.img`
  width: 1.2rem;
  filter: brightness(0) invert(100%);
`;

export const CloseContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: hidden;
  height: calc(100vh - 10rem);
  width: 4rem;
  margin: 0;
  margin-top: -0.55rem;
`;

const arrowCss = css`
  position: absolute;
  ${RV_Float}: -0.2rem;
  font-size: 2.5rem;
`;

export const Up = styled.div.attrs((props) => ({
  className: props.isUp ? C_GRAY : C_WHITE,
}))`
  ${arrowCss}
  // cursor: ${({ isUp }) => (isUp ? 'revert' : 'pointer')};
  top: 0.3rem;
  ${RV_Float}: 0.7rem;
  height: 2rem;
  width: auto;
  display: flex;
  align-items: center;
`;

export const Down = styled.div.attrs((props) => ({
  className: props.isDown ? C_GRAY : C_WHITE,
}))`
  ${arrowCss}
  // cursor: ${({ isDown }) => (isDown ? 'revert' : 'pointer')};
  bottom: 0.2rem;
  ${RV_Float}: 0.7rem;
  height: 2rem;
  width: auto;
  display: flex;
  align-items: center;
`;

export const IconListContainer = styled.div`
  height: 85%;
  overflow: hidden;
  position: relative;

  .ps__thumb-y {
    background-color: ${CV_WHITE} !important;
  }
  .ps__rail-y:hover {
    background-color: transparent !important;
  }
  .ps__rail-y {
    ${RV_RTL ? 'right: -0.3rem !important ' : 'left: 0 !important'};
  }
`;

export const IconListWrap = styled.div`
  height: 92%;
  overflow-y: scroll;
  overflow-x: hidden;
  position: absolute;
  top: 1rem;
  box-sizing: content-box;
  text-align: center;
`;

export const MiniIconWrapper = styled.div`
  width: 2rem;
  display: block;
  // margin: 0.4rem 0;
  font-size: 1.6rem;
`;

export const MenuTreeContainer = styled.div`
  background-color: inherit;
  padding: 0.1rem 0.2rem;
  transition: all 0.5s ease;
`;

export const UnderMenuContainer = styled.div`
  padding: 0 0 2.5rem 0;
`;

export const FilterIconWrapper = styled.div.attrs({ className: C_DISTANT })`
  position: absolute;
  ${`${RV_RevFloat}: 0.3rem;`}
  bottom: 0;
`;

export const CancelIconWrapper = styled.div`
  position: absolute;
  ${`${RV_Float}: 0.5rem;`}
  bottom: 0.1rem;
  cursor: pointer;
  display: ${({ isTyping }) => (isTyping ? 'revert' : 'none')};
`;

export const PanelLink = styled.div`
  margin-${RV_Float}: 0.4rem;
  text-transform: capitalize;
${TruncateTextCss}
`;

export const SettingItemTitle = styled.div`
  margin-${RV_Float}: 0.4rem;
  text-transform: capitalize;
`;

const getHighlightCss = ({ isMatch }) => {
  return isMatch
    ? `
    font-weight: bold;
    padding: 0 0.2rem;
    `
    : null;
};

export const HighlightedText = styled.span`
  ${getHighlightCss}
`;

export const Divider = styled.hr.attrs({ className: TBO_WARM })`
  margin: 1rem 0;
`;

export const PanelListWrapper = styled.div`
  width: 100%;
  user-select: none;

  .avtive-profile-navlink {
    background-color: rgba(43, 56, 143, 0.4);
  }
`;
