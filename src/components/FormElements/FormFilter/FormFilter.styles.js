import {
  BG_WHITE,
  BG_GRAY_LIGHT,
  C_GRAY,
  TBG_DEFAULT,
  C_WHITE,
  TC_DEFAULT,
  TC_VERYWARM,
} from 'constant/Colors';
import styled from 'styled-components';

export const FormFilterContainer = styled.div.attrs({
  className: `${BG_GRAY_LIGHT}`,
})`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 1px 3px 15px #00000026;
  border: 0.5px solid #e6f4f1;
  border-radius: 0.6rem;
`;

export const FiltersWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.5rem;
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
  padding: 1rem 0;
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
  border-top-left-radius: 0.6rem;
  border-top-right-radius: 0.6rem;
`;

export const FormFilterTitle = styled.div.attrs({
  className: TC_VERYWARM,
})`
  font-size: 1.1rem;
`;

export const FilterToggleContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin: 1rem 0;
`;

export const FilterToggleTitle = styled.span.attrs({
  className: C_GRAY,
})`
  font-size: 0.9rem;
  margin: 0 0.5rem;
  text-transform: capitalize;
`;

export const OrAndButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 6rem;
  height: 2.2rem;
  border: 1px solid #bac9dc;
  border-radius: 0.6rem;
  overflow: hidden;
  user-select: none;
  cursor: pointer;
`;

export const OrAndOption = styled.div.attrs((props) => ({
  className: props.isChecked
    ? `${TBG_DEFAULT} ${C_WHITE}`
    : `${BG_WHITE} ${TC_DEFAULT}`,
}))`
  width: 100%;
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  height: 100%;
  text-transform: capitalize;
`;
