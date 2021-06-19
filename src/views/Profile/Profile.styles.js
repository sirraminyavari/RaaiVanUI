import {
  BG_GRAY_LIGHT,
  TC_WARM,
  C_GRAY_DARK,
  BO_DISTANT,
  C_DISTANT,
  BG_RED,
} from 'constant/Colors';
import { BO_RADIUS_CIRCLE, BO_RADIUS_UNIT } from 'constant/constants';
import styled from 'styled-components';

export const ProfileViewContainer = styled.div.attrs({
  className: `${BG_GRAY_LIGHT} ${BO_RADIUS_UNIT}`,
})`
  min-height: calc(100vh - 5.5rem);
  box-shadow: 1px 5px 15px #0000001f;
  margin: 1.5rem;
  padding: 1.5rem;
  position: relative;
  user-select: none;
`;

export const ProfileTitleWrapper = styled.div`
  position: relative;
  top: 2rem;
  right: 0.5rem;
`;

export const ProfileTitle = styled.span.attrs({
  className: TC_WARM,
})`
  font-size: 1.2rem;
  font-weight: bold;
`;

export const ProfileContentWrapper = styled.div`
  min-height: calc(100vh - 5.5rem);
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
  position: relative;
  margin-top: 5rem;
`;

export const FieldTitleWrapper = styled.div`
  dispaly: flex;
  justify-content: flex-start;
  align-items: center;
`;

export const ChangePassTitle = styled.span.attrs({
  className: C_GRAY_DARK,
})`
  font-size: 1rem;
  font-weight: bold;
  margin: 0.5rem;
`;

export const TwoFactorToggleContainer = styled.div`
  width: 70%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2rem 0;
`;

export const TwoFactorToggleTitle = styled.span.attrs({
  className: C_GRAY_DARK,
})`
  font-size: 0.9rem;
  margin: 0 0.5rem;
  text-transform: capitalize;
`;

export const TwoFactorOptionsWrapper = styled.div.attrs({
  className: `${BO_DISTANT} ${BO_RADIUS_UNIT} ${C_GRAY_DARK}`,
})`
  width: 70%;
  padding: 1rem;
  ${({ enabled }) => !enabled && 'opacity: 0.5;'}
`;

export const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const ErrorIconWrapper = styled.div.attrs({
  className: `${BG_RED} ${BO_RADIUS_CIRCLE}`,
})`
  padding: 0.2rem;
  height: 1rem;
  width: 1rem;
  display: flex;
  align-items: center;
`;

export const ErrorMessage = styled.span.attrs({
  className: C_DISTANT,
})`
  margin: 0.3rem 0.5rem;
`;
