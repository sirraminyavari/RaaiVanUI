import { forwardRef } from 'react';
import styled, { css } from 'styled-components';
import withTheme from 'components/withTheme/withTheme';
import { CLOSE_WIDTH } from 'constant/constants';
import sidebarPattern from 'assets/images/pattern_soft.svg';
import {
  TBO_WARM,
  TC_DISTANT,
  C_WHITE,
  TBO_DEFAULT,
  BO_GRAY_DARK,
  C_RED,
  BO_GRAY,
  C_GRAY,
  TBG_VERYWARM,
} from 'constant/Colors';

const { RV_Float, RV_RevFloat, RV_RTL } = window;

const FlexBetween = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FlexCenter = css`
  display: flex;
  place-items: center;
`;

export const TitleText = styled.span.attrs({ className: C_WHITE })`
  margin: 0.5rem;
  text-transform: capitalize;
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
  const { isSidebarOpen } = props.theme.states;
  if (isSidebarOpen) {
    return openSidebar;
  } else {
    return closeSidebar;
  }
};

export const SidebarContainer = withTheme(styled.div.attrs({
  className: `${TBG_VERYWARM} ${C_WHITE}`,
})`
  height: 100%;
  ${getSidebarCss}
  ${`${RV_Float}: 0;`}
  overflow: hidden;
  box-shadow: 1px 0px 15px 1px #000;
  background-image: url(${sidebarPattern});

  .subMenuContainer {
    overflow: hidden;
    margin: -0.3rem 0 0 0;
    padding: 0 0.3rem;
    border-radius: 0.5rem;
    background-color: inherit;
    transition: all 0.5s ease;

    &.close {
      height: 0;
    }
  }
`);

export const ContentWrapper = withTheme(styled.div`
  width: ${(props) => (props.theme.states.isSidebarOpen ? '111%' : '180%')};
  position: absolute;
  top: 0;
  ${(props) => !props.theme.states.isSidebarOpen && 'right: 0rem;'}
  bottom: ${(props) => (props.theme.states.isSettingShown ? '-6%' : '0')};
  ${`${RV_RevFloat}: -1.1rem;`}
  overflow: auto;
  padding: 0 0.5rem;
  margin-top: 4rem;
  margin-right: -2.5rem;
  margin-bottom: ${({ isMainContent }) => (isMainContent ? '10vh' : '3vh')};
`);

export const SidebarHeader = withTheme(styled.div`
  ${FlexBetween}
  height: 4rem;
  width: ${(props) => {
    const {
      isSidebarOpen,
      sidebarCurrentWidth,
      sidebarCloseWidth,
    } = props.theme.states;
    return isSidebarOpen
      ? `${sidebarCurrentWidth / 16}rem`
      : `${sidebarCloseWidth / 16}rem`;
  }};
  z-index: 10;
  padding: 0 1%;
  position: fixed;
  top: 0;
  background-image: url(${sidebarPattern});
`);

export const OpenContentWrapper = styled.div`
  width: 95%;
  margin: 0;
  position: relative;
  right: 3%;
  padding: 0 5% 0 0.7rem;
  margin-${RV_Float}: 0;
`;

export const ToggleArrow = styled.div`
  height: 1.5rem;
  margin-${RV_Float}: 0.7rem;
  cursor: pointer;
`;

export const SidebarTitle = styled.div`
  ${FlexBetween}
  font-size: 1rem;
  height: 3.7rem;
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
    opacity: 70%;
    color: #bac9dc;
  }

  :focus-within svg {
    opacity: 100%;
    color: #fff;
  }

  // :focus-within div:first-child {
  //   display: revert;
  // }

  :focus-within ::placeholder {
    color: #fff;
    opacity: 100%;
  }
`;

export const SearchInput = styled.input.attrs((props) => ({
  type: props.type || 'search',
  placeholder: props.text || 'جستجو ...',
}))`
  width: 100%;
  background-color: inherit;
  border: none;
  outline: 0;
  ${({ isTyping }) =>
    isTyping
      ? `
      transform: translate(${RV_RTL ? '-1.5rem' : '1.5rem'});
      width: 80%;
      `
      : null}

  ::placeholder {
    color: #bac9dc;
    opacity: 70%;
  }

  transition: all 0.3s ease;
`;

export const SearchList = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0 1rem;
`;

// export const SearchListItem = styled.div`
//   margin: 0.2rem 0;
//   padding: 0.4rem;
// `;

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
  display: ${(props) =>
    props.theme.states.isSidebarOpen ? 'revert' : ' none'};
`);

export const MenuContainer = styled.div.attrs((props) => ({
  className: `BorderRadius4 ${props.isOpen ? TBO_DEFAULT : BO_GRAY_DARK}`,
}))`
  ${FlexBetween}
  border-width: 1px;
  border-style: solid;
  height: 2.2rem;
  margin: 0.5rem 0;
  padding: 0 0.5rem;
  background-color: ${({ isDragging, isOpen }) =>
    isDragging ? '#2B388F' : isOpen ? 'rgb(43,123,228, 0.2)' : 'inherit'};

  &:hover {
    background: rgb(43, 123, 228, 0.2);
    border: ${({ isOpen }) => (isOpen ? 'initial' : 'none')};
  }

  &:hover > div > div:first-child {
    display: revert !important;
  }

  &:focus-within > div > div:first-child {
    display: revert !important;
  }
`;

export const MenuTitleWrapper = styled.div`
  ${FlexCenter}
  width: ${({ isManageContent }) => (isManageContent ? '80%' : '100%')};
`;

export const SubMenuTitleWrapper = styled.div`
  margin: 0 0.4rem;
  width: 85%;
  display: flex;
  align-items: center;
`;

export const MenuTitle = styled.span.attrs({ className: C_WHITE })`
  margin-${RV_Float}: 0.6rem;
  display: inline-block;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const CaretIconWrapper = styled.div`
  display: inline-block;
  margin-top: 0.5rem;
`;

//TODO: fallback image.
export const MenuItemImage = styled.img`
  max-width: 1.8rem;
  min-width: 1.75rem;
  max-height: 1.8rem;
  width: 1.8rem;
  border-radius: 50%;
  border: 0.12rem solid;
  overflow: hidden;
`;

export const HighlightedTitle = styled.span`
  margin-${RV_Float}: 0.6rem;
`;

export const SubMenuContainer = styled.div`
  height: ${({ isOpen, itemsCount }) =>
    isOpen ? `${itemsCount * 2.35}rem` : '0'};
  overflow: hidden;
  margin: -0.3rem 0 0 0;
  padding: 0 0.3rem;
  border-radius: 0.5rem;
  background-color: inherit;
  transition: all 0.5s ease;
`;

//! This solution used because of conflict with DnD props passing down to styled component.
//! Use ''forwardedAs'' instead of ''as'' in this solution.
const DIV = styled.div.attrs({
  className: `${C_WHITE} BorderRadius4`,
})``;

export const SubMenu = styled(
  forwardRef(({ isDragging, ...props }, ref) => <DIV {...props} ref={ref} />)
)`
margin: 0.2rem 0;
  margin-${RV_Float}: 0.5rem;
  padding: 0 0.4rem;
  padding-${RV_Float}: 1.4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ isDragging }) => (isDragging ? '#2B388F' : 'inherit')};
  &:hover {
    background: rgb(43, 123, 228, 0.2);
  }

  //! Child classes style
  // &:hover > div > div:first-child {
  //   color: #e2234f;
  //   display: revert !important;
  // }
`;

export const ListItemWrapper = styled.div.attrs({
  className: C_WHITE,
})`
  ${FlexBetween}
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

export const SettingWrapper = styled.div`
  border-radius: 50%;
  margin-${RV_RevFloat}: 0.2rem;
  line-height: 0.5rem;
  cursor: pointer;
`;

export const PanelWrapper = styled.div.attrs({
  className: `${C_WHITE} BorderRadius4`,
})`
  ${FlexCenter}
  margin: 0.5rem 0;
  margin-${RV_Float}: 0.5rem;
  padding: 0.5rem;
  cursor: pointer;
  :hover {
    background: rgb(66,133,244, 0.4);
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
  height: 73vh;
  width: 2rem;
  margin: 0;
  margin-right: 3rem;
  margin-top: -0.55rem;
`;

const arrowCss = css`
  position: absolute;
  ${RV_Float}: -0.3rem;
  font-size: 2.5rem;
`;

export const Up = styled.div.attrs((props) => ({
  className: props.isUp ? C_GRAY : C_WHITE,
}))`
  ${arrowCss}
  cursor: ${({ isUp }) => (isUp ? 'revert' : 'pointer')};
  top: 0;
`;

export const Down = styled.div.attrs((props) => ({
  className: props.isDown ? C_GRAY : C_WHITE,
}))`
  ${arrowCss}
  cursor: ${({ isDown }) => (isDown ? 'revert' : 'pointer')};
  bottom: -20px;
`;

export const IconListContainer = styled.div`
  height: 90%;
  overflow: hidden;
  position: relative;
`;

export const IconListWrap = styled.div`
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  position: absolute;
  top: 0;
  box-sizing: content-box;
  text-align: center;
`;

export const MiniIconWrapper = styled.div`
  width: 2rem;
  display: block;
  margin: 1rem 0;
  font-size: 1.6rem;
`;

export const MenuTreeContainer = styled.div`
  background-color: inherit;
  padding: 0.1rem 0.2rem;
  border-radius: 0.5rem;
  transition: all 0.5s ease;
`;

export const UnderMenuContainer = styled.div`
  padding: 0 0.3rem 3rem 0.3rem;
`;

export const FilterIconWrapper = styled.div.attrs({ className: TC_DISTANT })`
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
`;

const getHighlightCss = ({ isMatch }) => {
  return isMatch
    ? `
    font-weight: bold;
    padding: 0 0.2rem;
    border-radius: 0.5rem;
    `
    : null;
};

export const HighlightedText = styled.span`
  ${getHighlightCss}
`;

export const Divider = styled.hr.attrs({ className: TBO_WARM })`
  margin: 1rem 0;
`;
