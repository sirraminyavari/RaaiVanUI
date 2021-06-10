import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  ${({ RV_RTL }) =>
    RV_RTL ? 'flex-direction:row' : 'flex-direction:row-reverse'}
  width: 100%;
  height: 100%;
  align-items: flex-start;
  justify-content: center;
  background-color: #ffffff;
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
  background-color: #fcfcfd;
  box-shadow: 1px 3px 20px #0000001f;
  border-radius: 1rem;
`;
export const SideFilter = styled.div`
  // display: flex;
  // overflow-y: auto;
  // width: 30%;
  // max-width: ${({ isEnabled }) => (isEnabled ? '30%' : '0')};
  // background-color: white;
  // box-shadow: 1px 3px 20px #ababab;
  // border-radius: 1rem;
  // margin-right: 1rem;
  // transition: max-width 0.5s;
  // max-height: 90vh;
  // align-items: flex-start;
  // justify-content: center;
  height: 85vh;
  padding: 0 0.5rem 0 1rem;
  // min-width: 25rem;
`;
export const TopFilter = styled.div`
  width: 100%;

  margin-bottom: 1rem;
  align-self: center;
  display: flex;
`;
