import { forwardRef } from 'react';
import styled, { css, keyframes } from 'styled-components';
import withTheme from 'components/withTheme/withTheme';
import { OPEN_WIDTH, CLOSE_WIDTH } from 'constant/constants';
import sidebarPattern from 'assets/images/pattern_soft.svg';

const { RV_Float, RV_RevFloat } = window;

const FooterInAnim = keyframes`
  from {
    ${RV_RevFloat}: 15rem;
  }

  to {
    ${RV_RevFloat}: 0rem;
  }
`;

const FooterOutAnim = keyframes`
  from {
    ${RV_RevFloat}: 0rem;
  }

  to {
    ${RV_RevFloat}: 15rem;
  }
`;

const FooterUpAnim = keyframes`
  from {
    top: 5rem;
  }

  to {
    top: 0;
  }
`;

const FooterDownAnim = keyframes`
  from {
    top: 0;
  }

  to {
    top: 5rem;
  }
`;

const FlexBetween = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FlexCenter = css`
  display: flex;
  place-items: center;
`;

export const TitleText = styled.span`
  color: #fff;
  margin: 0.5rem;
  text-transform: capitalize;
`;

export const CenterIcon = styled.div`
  ${FlexCenter}
`;

export const SidebarContainer = withTheme(styled.div`
  height: 100%;
  width: ${(props) =>
    `${props.theme.states.isSidebarOpen ? OPEN_WIDTH : CLOSE_WIDTH}px`};
  position: fixed;
  z-index: 100;
  top: 0;
  ${`${RV_Float}: 0;`}
  overflow: hidden;
  color: #fff;
  box-shadow: 1px 0px 15px 1px #000;
  background-image: url(${sidebarPattern});
  transition: all 0.7s ease;
`);

export const ContentWrapper = withTheme(styled.div`
  width: ${(props) => (props.theme.states.isSidebarOpen ? '110%' : '140%')};
  position: absolute;
  top: 0;
  bottom: ${(props) => (props.theme.states.isSettingShown ? '-6%' : '0')};
  ${`${RV_RevFloat}: -1.1rem;`}
  overflow: auto;
  padding: 0 1.5rem;
  margin-top: 4rem;
  margin-bottom: 9vh;
`);

export const SidebarHeader = withTheme(styled.div`
  ${FlexBetween}
  height: 4rem;
  width: ${(props) =>
    props.theme.states.isSidebarOpen ? OPEN_WIDTH : CLOSE_WIDTH}px;
  z-index: 10;
  padding: 0 1.3rem;
  position: fixed;
  top: 0;
  background-image: url(${sidebarPattern});
  transition: all 0.7s ease;
`);

export const OpenContentWrapper = styled.div`
  max-width: 13.5rem;
`;

export const ToggleArrow = styled.div`
  height: 1.5rem;
  margin-${RV_Float}: -0.3rem;
  cursor: pointer;
`;

export const SidebarTitle = styled.div`
  ${FlexBetween}
  font-size: 1rem;
  height: 3.7rem;
`;

export const SearchWrapper = styled.div`
  border-bottom: 1px solid #707070;
  margin-bottom: 1rem;
  padding: 0.3rem;
  position: relative;

  :focus-within svg {
    color: #fff;
  }

  // :focus-within div:first-child {
  //   display: revert;
  // }

  :focus-within ::placeholder {
    color: #fff;
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
      transform: translate(-1.5rem);
      width: 80%;
      `
      : null}

  ::placeholder {
    color: #bac9dc;
    opacity: 50;
  }

  transition: all 0.3s ease;
`;

export const SearchList = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0 1rem;
`;

export const SearchListItem = styled.div`
  margin: 0.2rem 0;
  padding: 0.4rem;
  color: #fff;
`;

export const SidebarFooter = styled.div`
  height: 6%;
  position: relative;
  top: 94%;
  transition: all 0.7s ease;
`;

export const OpenFooterButton = withTheme(styled.div`
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  margin: 0 1.4rem;
  margin-top: -0.6rem;
  padding: 0.3rem;
  color: #fff;
  cursor: pointer;
  animation: ${(props) =>
    props.theme.states.isSidebarOpen
      ? css`
          ${FooterInAnim} 1s ease 0.1s both
        `
      : css`
          ${FooterOutAnim} 0.3s linear both
        `};
`);

export const CloseFooterButton = withTheme(styled.div`
  position: absolute;
  color: #fff;
  ${RV_Float}: 0.5rem;
  padding: 0.3rem 0.5rem;
  animation-timing-function: ease;
  animation: ${(props) =>
    props.theme.states.isSidebarOpen
      ? css`
          ${FooterDownAnim} 0.2s both
        `
      : css`
          ${FooterUpAnim} 0.4s both
        `};
`);

export const FooterIconWrapper = withTheme(styled.div`
  margin-${RV_Float}: 0;
  margin-top: 0;
`);

export const FooterTitle = withTheme(styled.span`
  margin-${RV_Float}: 0.5rem;
  position: relative;
  top: 0;
  transition: all 0.5s linear;
`);

//! This solution used because of conflict with DnD props passing down to styled component.
//! Use ''forwardedAs'' instead of ''as'' in this solution.
const DIV = styled.div``;

export const MenuContainer = styled.div`
  ${FlexBetween}
  border: 1px solid #222;
  height: 2.2rem;
  margin: 0.5rem 0;
  padding: 0 0.5rem;
  background-color: ${({ isDragging }) => (isDragging ? '#2B388F' : 'inherit')};
  &:hover {
    background: rgb(66, 133, 244, 0.4);
    border: none;
  }
`;

export const MenuTitleWrapper = styled.div`
  ${FlexCenter}
  color: #fff;
  width: 100%;
`;

export const SubMenuTitleWrapper = styled.span`
  margin: 0 0.4rem;
`;

export const MenuTitle = styled.span`
  margin-${RV_Float}: 0.6rem;
  color: #fff;
  display: inline-block;
  width: 100%;
`;

export const MenuItemImage = styled.img`
  max-width: 1.8rem;
  border-radius: 50%;
  border: 0.12rem solid #fff;
`;

export const HighlightedTitle = styled.span`
  margin-${RV_Float}: 0.6rem;
`;

export const SubMenuContainer = styled.div`
  max-height: ${({ isOpen, itemsCount }) =>
    isOpen ? `${itemsCount * 2.8}rem` : '0'};
  overflow: hidden;
  margin: -0.3rem 0 0 0;
  padding: 0 0.3rem;
  border-radius: 0.5rem;
  background-color: inherit;
  transition: all 0.5s ease;
`;

export const SubMenu = styled(
  forwardRef(({ isDragging, ...props }, ref) => <DIV {...props} ref={ref} />)
)`
  margin: 0;
  padding: 0.5rem 1.3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  background-color: ${({ isDragging }) => (isDragging ? '#2B388F' : 'inherit')};
  &:hover {
    background: rgb(66, 133, 244, 0.4);
  }

  &:last-child {
    margin: 0 0 1.5rem 0;
  }
`;

export const ListItemWrapper = styled.div`
  ${FlexBetween}
  color: #fff;
`;

export const DragIconWrapper = styled.div`
  line-height: 0.5rem;
`;

export const SettingWrapper = styled.div`
  border-radius: 50%;
  margin-${RV_RevFloat}: 0.2rem;
  line-height: 0.5rem;
  cursor: pointer;
`;

export const PanelWrapper = styled.div`
  ${FlexCenter}
  margin: 0.5rem 0;
  margin-${RV_Float}: 0.5rem;
  padding: 0.5rem;
  cursor: pointer;
  color: #fff;
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
  margin: -0.55rem;
`;

const arrowCss = css`
  position: absolute;
  ${RV_Float}: -0.3rem;
  font-size: 2.5rem;
`;

export const Up = styled.div`
  ${arrowCss}
  color: ${({ isUp }) => (isUp ? '#444' : '#fff')};
  cursor: ${({ isUp }) => (isUp ? 'revert' : 'pointer')};
  top: 0;
`;

export const Down = styled.div`
  ${arrowCss}
  color: ${({ isDown }) => (isDown ? '#444' : '#fff')};
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
  color: #fff;
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

export const FilterIconWrapper = styled.div`
  position: absolute;
  ${`${RV_RevFloat}: 0.3rem;`}
  bottom: 0;
  color: #bac9dc;
  opacity: 50;
`;

export const CancelIconWrapper = styled.div`
  position: absolute;
  ${`${RV_Float}: 0.5rem;`}
  bottom: 0.1rem;
  color: #bac9dc;
  opacity: 50;
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
