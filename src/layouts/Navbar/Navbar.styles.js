import styled from 'styled-components';

export const NavbarContainer = styled.div`
  background-color: #2b388f;
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

export const ButtonContainer = styled.div`
  margin: 0 10px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  color: #fff;
`;

export const ButtonIcon = styled.div`
  text-align: center;
  position: relative;
  font-size: 20px;
`;

export const BadgeWrapper = styled.div`
  width: 20px;
  height: 20px;
  line-height: 22px;
  border-radius: 10px;
  background-color: red;
  position: absolute;
  top: 5px;
  left: -10px;
  font-size: 10px;
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
