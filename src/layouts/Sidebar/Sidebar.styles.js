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
`;

export const SidebarContent = styled.div`
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
