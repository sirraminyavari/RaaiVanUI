import { BG_WHITE } from 'constant/Colors';
import styled from 'styled-components';

export const FormFilterContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #fcfcfd;
  box-shadow: 1px 3px 15px #00000026;
  border: 0.5px solid #e6f4f1;
  border-radius: 10px;
`;

export const FiltersWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1.5rem;
  overflow: scroll;

  ::-webkit-scrollbar {
    display: none; /*! Hide scrollbar for Chrome, Safari and Opera */
  }
  * {
    -ms-overflow-style: none; /*! IE and Edge */
    scrollbar-width: none; /*! Firefox */
  }
`;

export const FilterButtonWrapper = styled.div.attrs({
  className: BG_WHITE,
})`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom-left-radius: 0.6rem;
  border-bottom-right-radius: 0.6rem;
`;

export const FormFilterHeader = styled.div.attrs({
  className: BG_WHITE,
})`
  width: 100%;
  min-height: 3.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.5rem;
  margin-bottom: 1.5rem;
  border-top-left-radius: 0.6rem;
  border-top-right-radius: 0.6rem;
`;

export const FormFilterTitle = styled.div`
  font-size: 1.1rem;
  color: #002479;
`;

export const FilterToggleContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin: 1rem 0;
`;

export const FilterToggleTitle = styled.span`
  font-size: 0.9rem;
  color: #707070;
  margin: 0 0.5rem;
  text-transform: capitalize;
`;
