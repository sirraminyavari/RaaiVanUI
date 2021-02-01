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
  width: ${({ isOpen }) =>
    isOpen ? 'calc(100% - 250px)' : 'calc(100% - 55px)'};
  padding: 0 20px;
  z-index: 1;
  box-shadow: 0px 3px 10px #333;
  transition: all 0.7s ease;
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
  width: 18px;
  height: 18px;
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
