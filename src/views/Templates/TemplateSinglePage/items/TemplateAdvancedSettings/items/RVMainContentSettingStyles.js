import styled from 'styled-components';
import {
  CV_DISTANT,
  CV_GRAY_DARK,
  TCV_DEFAULT,
} from '../../../../../../constant/CssVariables';
import {
  FLEX_CCC,
  FLEX_CSA,
  FLEX_RCC,
  FLEX_RCS,
  FLEX_RSS,
} from '../../../../../../constant/StyledCommonCss';
import AnimatedInput from '../../../../../../components/Inputs/AnimatedInput';
import RxInput from 'components/Inputs/RxInput';

export const UploaderContainer = styled.div`
  padding: 1rem;
`;
export const UploaderContainerTitle = styled.div`
  font-weight: 500;
  color: ${CV_GRAY_DARK};
  margin-bottom: 1rem;
`;
export const UploaderWrapper = styled.div`
  max-width: 52rem;
  width: 100%;
`;

export const Block = styled.div`
  margin: 2rem 0 4rem 0;
`;

export const BlockTitle = styled.div`
  color: ${CV_DISTANT};
  font-size: 0.8rem;
  font-weight: 300;
  margin-bottom: 1.7rem;
`;

export const BlockSection = styled.div`
  ${FLEX_RSS};
  margin-bottom: 1.5rem;
`;

export const BlockSectionTitle = styled.div`
  width: 9rem;
  line-height: 3rem;
  height: 3rem;
  color: ${CV_GRAY_DARK};
  font-weight: 500;
`;

export const BlockSectionInputContainer = styled.div`
  flex: 1;
`;

export const TemplateIdInput = styled(RxInput).attrs({
  delayTime: 1000,
  type: 'text',
})`
  height: 3rem;
  border-radius: 0.5rem;
  border: 0.0625rem solid ${CV_DISTANT};
  padding: 0.5rem;
  max-width: 28rem;
  width: 100%;
  outline: none;

  &:focus {
    border: 0.0625rem solid ${TCV_DEFAULT};
  }
`;

export const SuccessMessageInput = styled(TemplateIdInput).attrs({
  type: 'text',
})`
  height: 3rem;
  max-width: 38rem;
  width: 100%;
`;

export const ProcessInput = styled(RxInput).attrs({
  delayTime: 1000,
  type: 'text',
})`
  height: 3rem;
  border-radius: 0.5rem;
  border: 0.0625rem solid ${CV_DISTANT};
  padding: 0.5rem;
  max-width: 28rem;
  width: 100%;
  outline: none;

  &:focus {
    border: 0.0625rem solid ${TCV_DEFAULT};
  }
`;

export const AdminInputContainer = styled.div`
  max-width: 28rem;
  width: 100%;
  ${FLEX_CSA};
  gap: 1rem;
`;
