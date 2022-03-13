import styled from 'styled-components';
import { FLEX_RCB } from 'constant/StyledCommonCss';
import {
  CV_DISTANT,
  CV_GRAY,
  CV_RED,
  TCV_DEFAULT,
} from 'constant/CssVariables';
import AnimatedInput from 'components/Inputs/AnimatedInput';
import TrashIcon from 'components/Icons/TrashIcon';
import CopyIcon from 'components/Icons/CopyIcon/CopyIcon';

const FormFieldProps = (props) => {
  return (
    <>
      <FieldsContainer>
        <FieldWrapper>
          <LargeSimpleInput placeholder={'عنوان فیلد'} />
        </FieldWrapper>

        <SmallFieldWrapper>
          <SmallTitle color={CV_GRAY}>{'شناسه: '}</SmallTitle>
          <SmallSimpleInput width={'7rem'} />
        </SmallFieldWrapper>
      </FieldsContainer>

      <FieldsContainer>
        <FieldWrapper>
          <AnimatedInput placeholder={'عبارت پیش‌فرض کادر پاسخ'} />
        </FieldWrapper>
      </FieldsContainer>

      <FieldsContainer>
        <SmallFieldWrapper>
          <SmallTitle color={CV_DISTANT}>{'راهنما: '}</SmallTitle>
          <SmallSimpleInput width={'100%'} />
        </SmallFieldWrapper>
        <FormActionContainer>
          <DuplicateActionButton>
            <CopyIcon square={true} size={17} />
            {'تکرار'}
          </DuplicateActionButton>
          <Separator />
          <DeleteActionButton>
            <TrashIcon size={17} />
            {'حذف'}
          </DeleteActionButton>
        </FormActionContainer>
      </FieldsContainer>
    </>
  );
};
const FieldsContainer = styled.div`
  ${FLEX_RCB};
  margin-top: 1rem;
`;

const FieldWrapper = styled.div`
  max-width: 36rem;
  width: 100%;
`;

const SimpleInput = styled.input`
  outline: none;
  border: none;
  border-bottom: 0.0625rem solid ${CV_DISTANT};
  color: ${CV_GRAY};
  width: 100%;
`;

const LargeSimpleInput = styled(SimpleInput)`
  height: 1.8rem;
  font-size: 1.12rem;
`;

const SmallSimpleInput = styled(SimpleInput)`
  height: 1.3rem;
  font-size: 0.8rem;
  width: ${({ width }) => width || '100%'};
`;

const SmallFieldWrapper = styled.div`
  ${FLEX_RCB};
`;

const SmallTitle = styled.div`
  color: ${({ color }) => color};
  font-size: 0.85rem;
`;

const FormActionContainer = styled.div`
  ${FLEX_RCB};
  gap: 1rem;
`;

const ActionButton = styled.button`
  ${FLEX_RCB};
  outline: none;
  border: none;
  height: 2.5rem;
  line-height: 2.5rem;
  gap: 0.5rem;
  font-size: 0.85rem;
  cursor: pointer;
  font-weight: 500;
`;

const DeleteActionButton = styled(ActionButton)`
  color: ${CV_RED};
`;

const DuplicateActionButton = styled(ActionButton)`
  color: ${TCV_DEFAULT};
`;

const Separator = styled.div`
  &::before {
    content: '';
    border-right: 0.0625rem solid ${CV_DISTANT};
  }
`;

export default FormFieldProps;
