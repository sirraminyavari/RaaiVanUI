import styled from 'styled-components';
import {
  CV_DISTANT,
  CV_GRAY_DARK,
  CV_RED,
  CV_WHITE,
} from 'constant/CssVariables';
import RxInput from 'components/Inputs/RxInput';

export const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 8rem;
  height: 8rem;
  background-color: ${CV_WHITE};
  color: ${CV_DISTANT};
  border-radius: 100%;
  margin: 2rem auto;
`;
IconContainer.displayName = 'IconContainer';

export const FormContainer = styled.div`
  background-color: ${CV_WHITE};
  border-radius: 0.8rem;
  border: 1px solid ${CV_DISTANT};
  padding: 2.4rem;
  width: 100%;
  margin: 1.5rem auto 6rem auto;
  max-width: 30rem;
`;
FormContainer.displayName = 'FormContainer';

export const Title = styled.div`
  color: ${CV_GRAY_DARK};
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.625rem;
`;
Title.displayName = 'Title';

export const SubtitleContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 1.9rem;
  gap: 0.35rem;
  color: ${CV_DISTANT};
`;
SubtitleContainer.displayName = 'SubtitleContainer';

export const SubTitle = styled.div`
  font-size: 0.81rem;
  font-weight: 400;
`;
SubTitle.displayName = 'SubTitle';

export const NormalInput = styled.input`
  height: 3rem;
  border-radius: 0.3rem;
  padding: 0.3rem;
  width: 100%;
  margin-bottom: 1rem;
  border: 1px solid ${CV_DISTANT};
  outline: none;
`;
NormalInput.displayName = 'NormalInput';

export const UsernameInput = styled.div`
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: ${({ error }) =>
    error ? `1px solid ${CV_RED}` : `1px solid ${CV_DISTANT}`};
  border-radius: 0.3rem;
  padding: 0.3rem;
  margin-bottom: 1rem;
`;
UsernameInput.displayName = 'UsernameInput';

export const UsernameInputField = styled(RxInput)`
  width: 100%;
  border: none;
  outline: none;
`;
UsernameInputField.displayName = 'UsernameInputField';

export const ActionBar = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 3rem;
`;
ActionBar.displayName = 'ActionBar';
