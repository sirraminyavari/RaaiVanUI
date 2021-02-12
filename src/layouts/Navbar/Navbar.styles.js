import styled from 'styled-components';
import { OPEN_WIDTH, CLOSE_WIDTH } from 'constant/constants';

export const NavbarContainer = styled.div`
  width: ${({ isSidebarOpen, isMobile }) =>
    `calc(100% - ${
      !isMobile ? (isSidebarOpen ? OPEN_WIDTH : CLOSE_WIDTH) : CLOSE_WIDTH
    }px)`};
  height: 4.1rem;
  position: fixed;
  display: flex;
  z-index: 100;
  justify-content: space-between;
  align-items: center;
  top: 0;
  left: 0;
  opacity: 1;
  padding: 0 1.5rem;
  background: #2b388f 0% 0% no-repeat padding-box;
  box-shadow: 0px 3px 10px #00000029;
  transition: all 0.7s ease;
`;

export const WideScreenMenu = styled.div`
  height: 100%;
  padding: 0.2rem 0;
  display: flex;
`;

export const ButtonContainer = styled.div`
  width: 3.7rem;
  margin: 0rem 0.5rem;
  padding: 1.5rem;
  border-radius: 60%;
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  :hover {
    background-color: #27499f;
  }
`;

export const ButtonIcon = styled.div`
  text-align: center;
  position: relative;
  font-size: 1.3rem;
  color: #e6f4f1;
`;

export const ButtonTitle = styled.span`
  font-size: 0.7rem;
  font-weight: bold;
  color: #e6f4f1;
  opacity: 1;
  position: relative;
  bottom: 5px;
  width: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Badge = styled.div`
  height: 1.3rem;
  min-width: 1.3rem;
  padding: 0.1rem;
  line-height: 1.1rem;
  border-radius: 50%;
  border: 0.15rem solid #2b388f;
  background-color: #e2234f;
  position: absolute;
  top: 0.3rem;
  left: -0.6rem;
  font-size: 0.7rem;
`;

export const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const SearchContainer = styled.div`
  position: relative;
  :focus-within input {
    width: 300px;
  }
  :focus-within div {
    color: #2b7be4;
  }
`;

export const SearchInput = styled.input`
  border: none;
  border-radius: 5px;
  outline: 0;
  color: #333;
  height: 32px;
  padding: 0 10px;
  width: 230px;
  transition: all 0.6s ease;
  :focus::placeholder {
    color: transparent;
  }
`;

export const SearchIcon = styled.div`
  position: absolute;
  left: 5px;
  top: 5px;
  font-size: 25px;
  color: #ddd;
`;

export const ButtonActionsContainer = styled.div`
  width: 150px;
  height: ${({ optionCount }) => `${optionCount * 45}px`};
  padding: 10px;
  overflow: hidden;
  display: ${({ isOptionShown }) => (isOptionShown ? 'revert' : 'none')};
  background-color: #fff;
  position: absolute;
  top: 55px;
  z-index: 1000;
  border-radius: 10px;
  box-shadow: 0px 1px 15px #9e9fff;
  transition: all 0.7s ease;
`;

export const ButtonAction = styled.div`
  display: flex;
  place-items: center;
  color: #000;
  border-radius: 5px;
  margin: 5px 0px;
  transition: all 0.5s ease;
  :hover {
    background-color: #e3e3e3;
  }
`;

export const NavMenuContainer = styled.div`
  cursor: pointer;
  position: relative;
`;

export const MenuOptionsWrapper = styled.div`
  height: 200px;
  width: 300px;
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  flex-wrap: wrap;
  align-items: center;
  box-shadow: 0px 1px 10px #333;
  border-radius: 5px;
  background-color: #fff;
  z-index: 100;
  position: absolute;
  top: 40px;
  transition: all 0.7s ease;
`;

export const NavMenuOption = styled.div`
  width: 33%;
  height: 33%;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #000;
`;
