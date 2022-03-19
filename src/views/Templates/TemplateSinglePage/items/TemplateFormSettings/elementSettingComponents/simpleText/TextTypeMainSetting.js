import { CV_DISTANT, CV_GRAY } from 'constant/CssVariables';
import AnimatedInput from 'components/Inputs/AnimatedInput';
import CopyIcon from 'components/Icons/CopyIcon/CopyIcon';
import TrashIcon from 'components/Icons/TrashIcon';
import * as Styles from './TextTypeMainSettingStyles';

const TextTypeMainSetting = (props) => {
  return (
    <>
      <Styles.FieldsContainer>
        <Styles.FieldWrapper>
          <Styles.LargeSimpleInput placeholder={'عنوان فیلد'} />
        </Styles.FieldWrapper>

        <Styles.SmallFieldWrapper>
          <Styles.SmallTitle color={CV_GRAY}>{'شناسه: '}</Styles.SmallTitle>
          <Styles.SmallSimpleInput width={'7rem'} />
        </Styles.SmallFieldWrapper>
      </Styles.FieldsContainer>

      <Styles.FieldsContainer>
        <Styles.FieldWrapper>
          <AnimatedInput placeholder={'عبارت پیش‌فرض کادر پاسخ'} />
        </Styles.FieldWrapper>
      </Styles.FieldsContainer>

      <Styles.FieldsContainer>
        <Styles.SmallFieldWrapper>
          <Styles.SmallTitle color={CV_DISTANT}>{'راهنما: '}</Styles.SmallTitle>
          <Styles.SmallSimpleInput width={'100%'} />
        </Styles.SmallFieldWrapper>
        <Styles.FormActionContainer>
          <Styles.DuplicateActionButton>
            <CopyIcon square={true} size={17} />
            {'تکرار'}
          </Styles.DuplicateActionButton>
          <Styles.Separator />
          <Styles.DeleteActionButton>
            <TrashIcon size={17} />
            {'حذف'}
          </Styles.DeleteActionButton>
        </Styles.FormActionContainer>
      </Styles.FieldsContainer>
    </>
  );
};
export default TextTypeMainSetting;
