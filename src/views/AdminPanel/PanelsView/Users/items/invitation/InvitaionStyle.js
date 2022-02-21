import styled from 'styled-components';
import {
  CV_DISTANT,
  CV_GRAY,
  CV_GRAY_DARK,
  CV_WHITE,
  TCV_DEFAULT,
  TCV_LIGHTWARM,
} from 'constant/CssVariables';
import AnimatedInput from 'components/Inputs/AnimatedInput';

export const Title = styled.div`
  color: ${CV_GRAY_DARK};
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.625rem;
`;
export const SubtitleContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 1.9rem;
  gap: 0.35rem;
  color: ${CV_DISTANT};
`;
export const SubTitle = styled.div`
  font-size: 0.81rem;
  font-weight: 400;
`;

export const LinkContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
`;
export const LinkInput = styled.input`
  height: 3rem;
  outline: none;
  background-color: #eef1f5;
  border: 1px solid ${CV_DISTANT};
  color: ${CV_GRAY};
  border-radius: 0.32rem;
  padding: 0 1rem;
  width: 22rem;
  text-align: left;
  font-size: 1rem;
`;

export const CopyLinkButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 3rem;
  width: 7.5rem;
  background-color: ${TCV_DEFAULT};
  border-radius: 0.8rem;
  color: ${CV_WHITE};
  cursor: pointer;
  font-size: 1rem;
  gap: 0.7rem;

  &:hover {
    background-color: ${TCV_LIGHTWARM};
  }
`;

export const FormContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  max-width: 57rem;
  width: 100%;
  margin-bottom: 1rem;
`;

export const EmailContainer = styled.div`
  width: 56%;
`;

export const FieldContainer = styled.div`
  width: 46%;
`;

export const StyledAnimatedInput = styled(AnimatedInput)`
  height: 3rem;
`;
