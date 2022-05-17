import styled from 'styled-components';
import { FLEX_CCC, FLEX_RCS, FLEX_RSB } from 'constant/StyledCommonCss';
import {
  CV_DISTANT,
  CV_GRAY,
  CV_RED,
  CV_WHITE,
  TCV_DEFAULT,
} from 'constant/CssVariables';

export const ItemInputContainer = styled.div`
  ${FLEX_RSB};
  max-width: 30rem;
  width: 100%;
  border-radius: 0.3rem;
  border: 0.0625rem solid ${CV_DISTANT};
  cursor: text;
  min-height: 3rem;
  gap: 0.5rem;
  padding: 0.5rem;
`;

export const ArrowButton = styled.button`
  height: 1.5rem;
  width: 1.5rem;
  border-radius: 100%;
  background-color: ${TCV_DEFAULT};
  color: ${CV_WHITE};
  ${FLEX_CCC};
  border: none;
  outline: none;
  cursor: pointer;
`;

export const SelectItemContainer = styled.div`
  ${FLEX_RCS};
  height: 2.2rem;
  border: 1px solid ${CV_DISTANT};
  border-radius: 0.8rem;
  padding: 0.25rem;
  gap: 0.25rem;
  color: ${CV_GRAY};
`;

export const SelectedItemContainer = styled.div`
  min-height: 2.5rem;
  flex: 1;
  ${FLEX_RCS};
  gap: 0.25rem;
  flex-wrap: wrap;
`;

export const SelectedItemTitle = styled.div`
  font-weight: 500;
  color: ${TCV_DEFAULT};
`;

export const SelectedItemRemove = styled.button`
  background-color: transparent;
  color: ${CV_RED};
  height: 2.2rem;
  width: 2.2rem;
  ${FLEX_CCC};
`;

export const SelectedItemImg = styled.img.attrs({
  alt: 'item icon',
})`
  height: 1.25rem;
  width: 1.25rem;
  border-radius: 100%;
`;
