import styled from 'styled-components';

export const NavbarContainer = styled.div`
  background-color: #2b7be4;
  height: 10%;
  overflow: hidden;
  position: fixed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  top: 0;
  width: calc(100% - 250px);
  padding: 0 20px;
  z-index: 1;
  box-shadow: 0px 3px 10px #333;
`;

export const ButtonsWrapper = styled.div`
  height: 100%;
  display: flex;
`;

export const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const SearchContainer = styled.div`
  position: relative;
`;

export const SearchInput = styled.input`
  border: none;
  border-radius: 5px;
  outline: 0;
  color: #333;
  height: 32px;
  padding: 0 10px;
  width: ${(props) => (props.inFocus ? '300px' : '230px')};
  transition: all 0.6s ease;
`;

export const SearchIcon = styled.i`
  position: absolute;
  left: 10px;
  top: 5px;
  font-size: 20px;
  color: ${(props) => (props.inFocus ? `#2b7be4` : `#ddd`)};
`;

export const AvatarImage = styled.img`
  vertical-align: middle;
  width: ${(props) => `${props.radius}px`};
  height: ${(props) => `${props.radius}px`};
  border-radius: 50%;
`;

export const AvatarWrapper = styled.div`
  border-radius: 50%;
  padding: 0;
  margin-right: 25px;
  overflow: hidden;
  border: 2px solid #fff;
`;
