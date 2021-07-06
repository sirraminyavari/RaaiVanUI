import { TCV_DEFAULT } from 'constant/CssVariables';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';

export const Container = styled(Link)`
  border-radius: 0.75rem;
  display: flex;
  height: ${() => (DimensionHelper().isTabletOrMobile ? '13rem' : '7.5rem')};
  align-items: center;
  background-color: white;
  margin: 3px;
  justify-content: space-between;
  border-width: 0.05rem;
  border-style: solid;
  max-width: 100%;
  width: 100%;
  transition: max-width 0.5s;
  :hover {
    border-width: 0.1rem;
    border-color: ${TCV_DEFAULT};
    height: ${() => (DimensionHelper().isTabletOrMobile ? '13rem' : '7.5rem')};
  }
`;
export const IconContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 7.5rem;
  height: 100%;
  border-radius: 0.5rem;
  justify-content: space-evenly;
  align-items: center;
`;
export const Divider = styled.div`
  height: 80%;
  width: 0.05rem;
  /* background-color: #bac9dc; */
  /* border: 0.5px solid #bac9dc; */
  opacity: 1;
`;
export const Root = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
`;
export const InputMode = styled.div`
  background-color: green;
`;
