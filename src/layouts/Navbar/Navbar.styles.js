import withTheme from 'components/withTheme/withTheme';
import styled from 'styled-components';
import { OPEN_WIDTH, CLOSE_WIDTH } from 'constant/constants';

export const NavbarContainer = withTheme(styled.div`
  width: ${({ theme, isMobile }) =>
    `calc(100% - ${
      !isMobile
        ? theme.states.isSidebarOpen
          ? OPEN_WIDTH
          : CLOSE_WIDTH
        : CLOSE_WIDTH
    }px)`};
  height: 4rem;
  position: fixed;
  display: flex;
  z-index: 100;
  justify-content: space-between;
  align-items: center;
  top: 0;
  left: 0;
  opacity: 1;
  padding: 0 1.5rem;
  box-shadow: 0 3px 10px #00000029;
  transition: all 0.7s ease;
`);

export const WideScreenMenu = styled.div`
  height: 100%;
  padding: 0.2rem 0;
  display: flex;
`;

export const ButtonContainer = styled.div`
  width: 3.7rem;
  margin: 0rem 0.5rem;
  padding: 0.4rem;
  border-radius: 60%;
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  &:hover {
    background-color: #27499f;
  }
  &:hover span {
    transform: rotateX(180deg);
  }
`;

export const ButtonIcon = styled.div`
  text-align: center;
  position: relative;
  font-size: 1.3rem;
  color: #e6f4f1;
`;

export const ButtonTitle = styled.div`
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
    width: 16rem;
  }
  :focus-within div {
    color: #2b7be4;
  }
`;

export const SearchInput = styled.input`
  border: none;
  border-radius: 0.3rem;
  outline: 0;
  color: #333;
  height: 2rem;
  padding: 0 0.6rem;
  width: 14rem;
  transition: all 0.6s ease;
  :focus::placeholder {
    color: transparent;
  }
`;

export const SearchIcon = styled.div`
  position: absolute;
  left: 0.3rem;
  top: 0.3rem;
  font-size: 1.5rem;
  color: #ddd;
`;

export const ButtonActionsContainer = styled.div`
  width: 12rem;
  height: ${({ optionCount }) => `${optionCount * 2.8}rem`};
  padding: 0.7rem;
  margin: -0.7rem;
  overflow: hidden;
  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: 0px 1px 15px #9e9fff;
`;

export const ButtonAction = styled.div`
  display: flex;
  place-items: center;
  color: #000;
  border-radius: 0.3rem;
  margin: 0.3rem 0;
  padding: 0 0.3rem;
  transition: all 0.5s ease;
  :hover {
    background-color: #d3d3d3;
  }
`;

export const ActionTitle = styled.span`
  margin: 0.3rem 0.5rem;
`;

export const NavMenuContainer = styled.div`
  cursor: pointer;
  position: relative;
`;

export const MenuOptionsWrapper = styled.div`
  height: 12rem;
  width: 17rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  box-shadow: 0px 1px 10px #333;
  border-radius: 0.5rem;
  margin: -10px;
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
  width: 14rem;
  padding: 0.5rem 0.7rem;
`;

export const AvatarMenuItem = styled.div`
  display: flex;
  flex-direction: row-reverse;
  justify-content: end;
  align-items: center;
  padding: 0.4rem;
  color: #000;
  border-radius: 0.4rem;
  cursor: pointer;
`;

export const AvatarMenuTitle = styled.span`
  padding: 0 0.6rem;
  color: ${({ color }) => color};
`;

export const Divider = styled.div`
  margin: 0.5rem 0;
`;
