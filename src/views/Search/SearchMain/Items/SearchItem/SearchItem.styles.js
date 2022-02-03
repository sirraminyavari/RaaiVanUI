import styled from 'styled-components';
import { BO_RADIUS_HALF } from 'constant/constants';
import { BO_DISTANT } from 'constant/Colors';
import { TCV_DEFAULT } from 'constant/CssVariables';
import {
  CSS_CLASS_REV_DIRECTION,
  CSS_CLASS_REV_TEXT_ALIGN,
} from 'constant/CssClasses';

export const Container = styled.div.attrs({
  className: `${BO_RADIUS_HALF} ${BO_DISTANT}`,
})`
  display: flex;
  flex-flow: row;

  width: calc(100% - 1rem);
  margin: 0.6rem 0;
  padding: 0.3rem 0;
  gap: 1rem;

  :hover {
    border-color: ${TCV_DEFAULT};
  }
`;

export const TypeWrapper = styled.div.attrs({
  className: `${BO_DISTANT}`,
})`
  flex: 0 0 auto;

  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;

  width: 5rem;
  border-top: none;
  border-bottom: none;
  border-inline-start: none;
  gap: 0.5rem;
`;

export const ContentWrapper = styled.div`
  flex: 1 1 auto;
  display: flex;
  flex-flow: column;
  justify-content: center;
  gap: 0.5rem;
  padding-inline-end: 0.8rem;
`;

export const InfoWrapper = styled.div`
  flex: 0 0 auto;
  display: flex;
  flex-flow: row;
  gap: 1rem;
`;

export const InfoMain = styled.div`
  flex: 1 1 auto;
  display: flex;
  flex-flow: column;
  justify-content: center;
  gap: 0.2rem;
  width: 0;
`;

export const InfoDetails = styled.div.attrs({
  _className: `${CSS_CLASS_REV_DIRECTION} ${CSS_CLASS_REV_TEXT_ALIGN}`,
})`
  flex: 0 0 auto;
  display: flex;
  flex-flow: column;
  width: 30%;
  padding-top: 0.3rem;
`;

export const InfoDetailRow = styled.div`
  display: flex;
  flex-flow: row;
  justify-content: end;
`;
