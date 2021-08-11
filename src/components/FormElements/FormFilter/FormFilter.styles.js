import styled from 'styled-components';
import {
  BG_WHITE,
  BG_GRAY_LIGHT,
  C_GRAY,
  TBG_DEFAULT,
  C_WHITE,
  TC_DEFAULT,
  TC_VERYWARM,
} from 'constant/Colors';
import {
  FLEX_CCB,
  FLEX_CCC,
  FLEX_RCB,
  FLEX_RCC,
  FLEX_RCE,
} from 'constant/StyledCommonCss';
import { CV_DISTANT } from 'constant/CssVariables';

export const FormFilterContainer = styled.div.attrs({
  className: `${BG_GRAY_LIGHT}`,
})`
  width: 100%;
  height: 100%;
  ${FLEX_CCC}
  box-shadow: 1px 3px 15px #00000026;
  border: 0.5px solid #e6f4f1;
  border-radius: 0.6rem;
`;

export const FiltersWrapper = styled.div`
  width: 100%;
  ${FLEX_CCB}
  padding: 0 1.5rem;
  overflow: scroll;
`;

export const FilterButtonWrapper = styled.div.attrs({
  className: BG_WHITE,
})`
  width: 100%;
  ${FLEX_RCC}
  padding: 1rem 0;
  border-bottom-left-radius: 0.6rem;
  border-bottom-right-radius: 0.6rem;
`;

export const FormFilterHeader = styled.div.attrs({
  className: BG_WHITE,
})`
  width: 100%;
  min-height: 3.75rem;
  ${FLEX_RCB}
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
  ${FLEX_RCE}
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
  ${FLEX_RCB}
  width: 6rem;
  height: 2.2rem;
  border: 1px solid ${CV_DISTANT};
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
  ${FLEX_RCC}
  font-size: 1rem;
  height: 100%;
  text-transform: capitalize;
`;
