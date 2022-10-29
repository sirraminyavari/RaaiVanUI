import styled from 'styled-components';
import { ViewContentCard } from 'constant/StyledCommonCss';
import Button from 'components/Buttons/Button';
import {
  CV_GRAY_DARK,
  CV_RED,
  CV_WHITE,
} from '../../../../../constant/CssVariables';
import AnimatedInput from '../../../../../components/Inputs/AnimatedInput';

export const Container = styled.div`
  ${ViewContentCard};
  padding-block-start: 0.5rem;
`;

export const CMContentContainer = styled.div`
  width: 100%;
  max-width: 56rem;
  margin: 7rem auto;
  margin-block-start: 1rem;
`;

export const IdInput = styled(AnimatedInput)`
  max-width: 38rem;
  height: 3rem;
  width: 100%;
`;

export const ReturnButton = styled(Button).attrs({
  type: 'negative-o',
})`
  position: absolute;
  top: 1rem;
  ${({ $rtl }) => ($rtl ? 'left: 1rem' : 'right: 1rem')};
  height: 2rem;
  width: 10rem;
  border: 0.0625rem solid ${CV_WHITE};

  &:hover {
    border: 0.0625rem solid ${CV_RED};
    background-color: ${CV_WHITE};
  }
`;

export const InputContainer = styled.div`
  width: 100%;
  margin-bottom: 2rem;
`;

export const InputLabel = styled.div`
  font-weight: 500;
  color: ${CV_GRAY_DARK};
  margin-bottom: 0.5rem;
`;
export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  padding-block-end: 1rem;

  & > div:first-of-type {
    position: unset;
  }
`;
