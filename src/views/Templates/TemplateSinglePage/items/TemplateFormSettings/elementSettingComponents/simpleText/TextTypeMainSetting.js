import { CV_DISTANT, CV_GRAY } from 'constant/CssVariables';
import AnimatedInput from 'components/Inputs/AnimatedInput';
import CopyIcon from 'components/Icons/CopyIcon/CopyIcon';
import TrashIcon from 'components/Icons/TrashIcon';
import * as Styles from './TextTypeMainSettingStyles';
import produce from 'immer';
import { getUUID } from '../../../../../../../helpers/helpers';

const TextTypeMainSetting = ({
  current,
  setFormObjects,
  duplicateItem,
  removeItem,
}) => {
  const { Title, Name, Help } = current?.data || {};

  const handleTitleChangeState = (e) => {
    if (setFormObjects) {
      setFormObjects(
        produce((d) => {
          const _current = d.find((x) => x?.id === current?.id);
          _current.data.Title = e?.target?.value;
        })
      );
    }
  };

  const handleNameChangeState = (e) => {
    if (setFormObjects) {
      setFormObjects(
        produce((d) => {
          const _current = d.find((x) => x?.id === current?.id);
          _current.data.Name = e?.target?.value;
        })
      );
    }
  };

  const handleHelpChangeState = (e) => {
    if (setFormObjects) {
      setFormObjects(
        produce((d) => {
          const _current = d.find((x) => x?.id === current?.id);
          _current.data.Help = e?.target?.value;
        })
      );
    }
  };

  const handleDuplicationEvent = () => {
    if (setFormObjects) {
      setFormObjects(
        produce((d) => {
          const _current = d.find((x) => x?.id === current?.id);
          const _c = Object.assign(_current);
          _c.id = getUUID();
          console.log(_c.id, current?.id);
          // const _currentIndex = d.findIndex((x) => x?.id === current?.id);
          // d.splice(_currentIndex, 0, _c);
        })
      );
    }
  };

  const handleDeleteEvent = () => {
    if (removeItem) {
      removeItem(current?.id);
    }
  };

  return (
    <>
      <Styles.FieldsContainer>
        <Styles.FieldWrapper>
          <Styles.LargeSimpleInput
            placeholder={`عنوان فیلد ${current?.title || ''} `}
            value={Title}
            onChange={handleTitleChangeState}
          />
        </Styles.FieldWrapper>

        <Styles.SmallFieldWrapper>
          <Styles.SmallTitle color={CV_GRAY}>{'شناسه: '}</Styles.SmallTitle>
          <Styles.SmallSimpleInput
            value={Name}
            onChange={handleNameChangeState}
            width={'7rem'}
          />
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
          <Styles.SmallSimpleInput
            value={Help}
            onChange={handleHelpChangeState}
            width={'100%'}
          />
        </Styles.SmallFieldWrapper>

        <Styles.FormActionContainer>
          <Styles.DuplicateActionButton onClick={handleDuplicationEvent}>
            <CopyIcon square={true} size={17} />
            {'تکرار'}
          </Styles.DuplicateActionButton>

          <Styles.Separator />

          <Styles.DeleteActionButton onClick={handleDeleteEvent}>
            <TrashIcon size={17} />
            {'حذف'}
          </Styles.DeleteActionButton>
        </Styles.FormActionContainer>
      </Styles.FieldsContainer>
    </>
  );
};
export default TextTypeMainSetting;
