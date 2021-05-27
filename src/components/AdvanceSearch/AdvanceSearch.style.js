import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
`;
export const Maintainer = styled.div`
  width: 65%;
  min-width: ${({ fullWidth }) => (fullWidth ? '65%' : '95%')};

  height: 100%;
  margin-right: 1rem;
  /* align-items: center;
  display: flex;
  flex-direction: column; */
  transition: min-width 0.5s;
`;
export const SideFilter = styled.div`
  width: 30%;
  max-width: ${({ isEnabled }) => (isEnabled ? '30%' : '0')};
  height: 100rem;
  background-color: white;
  box-shadow: 1px 3px 20px #ababab;
  border-radius: 1rem;
  margin-right: 1rem;
  transition: max-width 0.5s;
`;
export const TopFilter = styled.div`
  height: 15rem;
  width: 100%;
  background-color: white;
  box-shadow: 1px 3px 20px #ababab;
  border-radius: 1rem;
  margin-bottom: 1rem;
  align-self: center;
  display: flex;
`;
