import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  ${({ RV_RTL }) =>
    RV_RTL ? 'flex-direction:row' : 'flex-direction:row-reverse'}
  width: 100%;
  min-height: 100%;
  align-items: flex-start;
  justify-content: center;
`;
export const Maintainer = styled.div`
  width: calc(
    ${({ isAdvancedShow }) => (isAdvancedShow ? '100vw - 31rem' : '100%')}
  );
  /* min-width: ${({ fullWidth }) => (fullWidth ? '65%' : '95%')}; */

  min-height: calc(100vh - 2rem);
  margin-right: 1rem;
  margin-bottom: 1rem;

  /* align-items: center;
  display: flex;
  flex-direction: column; */
  transition: min-width 0.5s, width 0.5s;
  box-shadow: 1px 3px 20px #0000001f;
  border-radius: 1rem;
`;
export const SideFilter = styled.div`
  // display: flex;
  // overflow-y: auto;
  // max-width: ${({ isEnabled }) => (isEnabled ? '30%' : '0')};
  // background-color: white;
  // box-shadow: 1px 3px 20px #ababab;
  // border-radius: 1rem;
  // margin-right: 1rem;
  // transition: max-width 0.5s;
  // max-height: 90vh;
  // align-items: flex-start;
  // justify-content: center;
  /* width: 25rem; */

  position: fixed;
  top: 5rem;
  ${({ dir }) => dir}: 0;
  height: calc(100vh - 5.5rem);
  padding: ${({ rtl }) => (rtl ? '0 0.5rem 0 1rem' : '0 1rem 0 0.5rem')};
  opacity: ${({ isEnabled }) => (isEnabled ? '1' : '0')};
  width: ${({ isEnabled }) => (isEnabled ? '25rem' : '0rem')};
  transition: width 0.5s, opacity 0.5s;

  // min-width: 25rem;
`;
export const Space = styled.div`
  /* width: 25rem; */
  width: ${({ isEnabled }) => (isEnabled ? '25rem' : '0rem')};
  ${({ dir }) => dir}: 0;
  height: 1rem;
  padding: ${({ rtl }) => (rtl ? '0 0.5rem 0 1rem' : '0 1rem 0 0.5rem')};
  transition: width 0.5s;
`;
export const TopFilter = styled.div`
  width: 100%;

  margin-bottom: 1rem;
  align-self: center;
  display: flex;
`;
