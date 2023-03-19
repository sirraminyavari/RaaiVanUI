import styled from 'styled-components';
import {
  FLEX_RCC,
  FLEX_RCE,
  FLEX_RCS,
  FLEX_RSS,
} from '../../../../../../constant/StyledCommonCss';
import {
  CV_DISTANT,
  CV_GRAY,
  CV_GRAY_LIGHT,
  CV_RED,
  CV_WHITE,
  TCV_DEFAULT,
} from '../../../../../../constant/CssVariables';
import Button from '../../../../../../components/Buttons/Button';

export const CodingPatternContainer = styled.div`
  ${FLEX_RSS};
  gap: 1rem;
`;

export const EditButton = styled.button`
  height: 3rem;
  background-color: ${CV_WHITE};
  color: ${TCV_DEFAULT};
  font-weight: 500;
  padding: 0 1rem;
  border-radius: 0.5rem;
  min-width: 8rem;
  border: 0.0625rem solid transparent;
  transition: border 0.15s ease-out;

  &:hover {
    border: 0.0625rem solid ${TCV_DEFAULT};
  }
`;
export const InputData = styled.div`
  min-height: 3rem;
  flex: 1;
  ${({ modal }) => !modal && ' max-width: 38rem'};
  width: 100%;
  border: 0.0625rem solid ${CV_DISTANT};
  border-radius: 0.5rem;
  padding: 0.5rem;
  ${FLEX_RCS};
  ${({ modal }) => (!modal ? FLEX_RCS : FLEX_RCC)};
  gap: 0.5rem;
  flex-flow: wrap;
  background-color: ${CV_WHITE};
`;

export const Item = styled.div`
  background-color: #eef1f5;
  color: ${CV_GRAY};
  font-size: 0.8rem;
  ${FLEX_RCS};
  gap: 0.5rem;
  height: 2rem;
  padding: 0 0.5rem;
  border-radius: 0.5rem;
`;

export const RemoveIconButton = styled.button`
  height: 1.5rem;
  width: 1.5rem;
  border: none;
  background-color: transparent;
  color: ${CV_RED};
`;

export const ModalContentContainer = styled.div`
  padding: 2rem 1rem 1rem 1rem;
`;

export const ExampleContainer = styled.div`
  ${FLEX_RCC};
  gap: 1rem;
`;

export const ExampleTitle = styled.div`
  color: ${CV_DISTANT};
`;

export const ExamplePreviewContainer = styled.div`
  ${FLEX_RCS};
  gap: 1rem;
`;

export const PreviewItem = styled.div`
  font-size: 1.5rem;
  color: ${TCV_DEFAULT};
  font-weight: 500;
`;

export const ItemSelectionBlock = styled.div`
  ${FLEX_RSS};
  margin-top: 2rem;
  padding: 0 1rem;
`;

export const ItemSelectionBlockTitle = styled.div`
  width: 3rem;
  line-height: 2rem;
  text-align: start;
  color: ${CV_DISTANT};
`;
export const ItemSelectionBlockPatternsContainer = styled.div`
  flex: 1;
  display: block;
`;

export const ListContainer = styled.div`
  ${FLEX_RSS};
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
`;

export const Input = styled.input.attrs(() => ({
  type: 'checkbox',
}))`
  display: none;
`;

export const CheckboxContainer = styled.label.attrs({
  role: 'checkbox',
})`
  background-color: #eef1f5;
  color: ${({ active }) => (!active ? CV_GRAY : TCV_DEFAULT)};
  line-height: 2rem;
  cursor: pointer;
  height: 2rem;
  padding: 0 0.5rem;
  border-radius: 0.5rem;
  border: 0.0625rem solid ${({ active }) => (!active ? '#EEF1F5' : TCV_DEFAULT)};
  font-size: 0.8rem;
  width: fit-content;
`;

export const ActionBar = styled.div`
  ${FLEX_RCE};
  margin-top: 2rem;
  padding: 0 1rem;
`;

export const ActionButton = styled(Button).attrs({
  type: 'primary',
})`
  min-width: 16rem;
  height: 3rem;
  border-radius: 0.8rem;
`;
