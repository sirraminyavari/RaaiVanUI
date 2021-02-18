import styled, { css } from 'styled-components';
import Edit from 'components/Icons/EditIcon/Edit';

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
`;

export const CenterIcon = styled.div`
  ${FlexCenter}
`;

export const SidebarContainer = styled.div`
  height: 100%;
  width: ${({ width }) => `${width}px`};
  position: fixed;
  z-index: 100;
  top: 0;
  right: 0;
  background-color: #15113c;
  overflow: hidden;
  color: #fff;
  box-shadow: 10px 0px 15px 10px #000;
  transition: all 0.7s ease;
`;

export const ContentWrapper = styled.div`
  width: ${({ options }) => (options.isSidebarOpen ? '110%' : '140%')};
  position: absolute;
  top: 0;
  bottom: ${({ options }) => (options.isSettingShown ? '-10vh' : '-3vh')};
  left: -1.1rem;
  overflow: scroll;
  margin-bottom: 6vh;
  padding: 0 1.1rem;
  margin-top: 10vh;
`;

export const SidebarHeader = styled.div`
  ${FlexBetween}
  height: 4.1rem;
  z-index: 1000;
  padding: 0 1.1rem;
  background-color: #15113c;
`;

export const ToggleArrow = styled.div`
  height: 1.5rem;
  margin-left: -0.5rem;
  cursor: pointer;
`;

export const SidebarTitle = styled.div`
  ${FlexBetween}
  font-size: 16px;
  height: 12%;
`;

export const SearchWrapper = styled.div`
  ${FlexBetween}
  border-bottom: 1px solid #707070;
  margin-bottom: 1rem;
`;

export const SearchInput = styled.input.attrs((props) => ({
  type: props.type || 'search',
  placeholder: props.text || 'جستجو ...',
}))`
  width: 100%;
  background-color: inherit;
  color: #fff;
  border: none;
  outline: 0;
`;

export const SidebarFooter = styled.div`
  background-color: #2b388f;
  height: 6%;
  display: flex;
  position: relative;
  top: 84%;
  justify-content: center;
  align-items: center;
  color: #fff;
  cursor: pointer;
  transition: all 0.7s ease;
`;

export const FooterTitle = styled.span`
  margin-right: 0.5rem;
  position: relative;
  top: ${({ isSidebarOpen }) => (isSidebarOpen ? '0px' : '100px')};
  transition: all 0.5s linear;
`;

export const MenuContainer = styled.div`
  ${FlexBetween}
  border: 0.1rem solid #222;
  height: 2.2rem;
  margin: 0.5rem 0;
  padding: 0 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  background-color: ${({ isDragging }) => (isDragging ? '#15113c' : 'inherit')};
  &:hover {
    background-color: #19265e;
  }
`;

export const MenuTitle = styled.div`
  ${FlexCenter}
  color: #fff;
`;

export const SubMenuContainer = styled.div`
  max-height: ${({ isOpen, itemsCount }) =>
    isOpen ? `${itemsCount * 2.8}rem` : '0'};
  overflow: hidden;
  padding: 0 0.3rem;
  border-radius: 0.5rem;
  background-color: ${({ isDraggingOver }) =>
    isDraggingOver ? '#383388' : 'inherit'};
  transition: all 0.5s ease;
`;

export const SubMenu = styled.div`
  margin: 0.3rem 0;
  border-radius: 0.5rem;
  padding: 0.5rem 1.3rem;
  display: flex;
  color: #fff;
  background-color: ${({ isDragging }) => (isDragging ? '#15113c' : 'inherit')};
  &:hover {
    background-color: #19265e;
  }
`;

export const BadgeWrapper = styled.div`
  height: 1.3rem;
  padding: 0 0.3rem;
  line-height: 1.5rem;
  border-radius: 1rem;
  background-color: blue;
  text-align: center;
  font-size: 0.8rem;
`;

export const ListItemWrapper = styled.div`
  ${FlexBetween}
  color: #fff;
`;

export const SettingWrapper = styled.div`
  background-color: #171c4d;
  border-radius: 50%;
  padding: 0.3rem;
  margin-left: -0.5rem;
  line-height: 0.5rem;
  cursor: pointer;
`;

export const SettingList = styled.div`
  ${FlexCenter}
  margin: 0.5rem 0;
  margin-right: 0.5rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  :hover {
    background-color: #171c4d;
  }
  transition: all 0.3s linear;
`;

export const CloseContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  height: 70vh;
`;

const arrowCss = css`
  position: absolute;
  right: -0.3rem;
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
  position: absolute;
  padding: 0 0.3rem;
  top: 0;
  left: -1rem;
  box-sizing: content-box;
  text-align: center;
`;

export const MiniIconWrapper = styled.div`
  display: block;
  margin: 1rem 0px;
  font-size: 1.6rem;
  color: #fff;
`;

export const MenuTreeContainer = styled.div`
  background-color: ${({ isDraggingOver }) =>
    isDraggingOver ? '#383388' : 'inherit'};
  padding: 0.1rem 0.2rem;
  border-radius: 0.5rem;
  transition: all 0.5s ease;
`;

export const EditIcon = styled(Edit).attrs(({ size }) => ({ size }))`
  margin-left: ${({ isSidebarOpen }) => (isSidebarOpen ? '0' : '-2rem')};
`;

export const UnderMenuContainer = styled.div`
  padding-bottom: 3rem;
`;
