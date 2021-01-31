import styled from 'styled-components';

export const SidebarContainer = styled.div`
  height: 100%;
  width: ${(props) => `${props.width}px`};
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

export const InnerWrapper = styled.div`
  width: ${(props) => (props.isOpen ? '110%' : '140%')};
  position: absolute;
  top: 0;
  bottom: -20px;
  left: -20px;
  overflow: scroll;
  display: flex;
  flex-direction: column;
  margin-bottom: 39px;
`;

export const SidebarContentWrap = styled.div`
  flex-grow: 1;
  padding: 0 20px;
`;

export const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 10%;
`;

export const ToggleArrow = styled.div`
  border-radius: 2px;
  height: 20px;
  line-height: 22px;
  padding: 0 2px;
  margin-right: 5px;
  cursor: pointer;
  ${(props) =>
    props.isOpen
      ? 'border-left: 3px solid #fff'
      : 'border-right: 3px solid #fff'}
`;

export const SidebarTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  height: 12%;
`;

export const SearchWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #707070;
  margin-bottom: 30px;
`;

export const SearchInput = styled.input`
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
  top: 94%;
  justify-content: center;
  align-items: center;
  color: #fff;
`;

export const FooterTitle = styled.span`
  margin-right: 5px;
  position: relative;
  top: ${(props) => (props.isOpen ? '0px' : '100px')};
  transition: all 0.5s linear;
`;

export const MenuContainer = styled.div`
  border: 1px solid #222;
  height: 35px;
  margin: 10px 0;
  padding: 0 5px;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  &:hover {
    background-color: #19265e;
  }
`;

export const MenuTitle = styled.div`
  display: flex;
  place-items: center;
  color: #fff;
`;

export const SubMenuContainer = styled.div`
  max-height: ${({ show, itemsCount }) =>
    show ? `${itemsCount * 35}px` : '0px'};
  overflow: hidden;
  transition: all 0.5s ease;
`;

export const SubMenu = styled.div`
  margin: 5px 0;
  margin-right: 10px;
  border-radius: 5px;
  padding: 5px 10px;
  display: flex;
  color: #fff;
  &:hover {
    background-color: #19265e;
  }
`;

export const BadgeWrapper = styled.div`
  width: 20px;
  height: 20px;
  line-height: 22px;
  border-radius: 10px;
  background-color: blue;
  text-align: center;
  font-size: 10px;
`;

export const BookmakedWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
`;
