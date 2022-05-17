import produce from 'immer';
import { getUUID } from 'helpers/helpers';
import * as Styles from './DraggableSharedSettingStyles';
import { CV_DISTANT, CV_GRAY } from 'constant/CssVariables';
import CopyIcon from 'components/Icons/CopyIcon/CopyIcon';
import TrashIcon from 'components/Icons/TrashIcon';
import CustomSelect from 'components/Inputs/CustomSelect/CustomSelect';

const DraggableSharedSetting = ({
  current,
  setFormObjects,
  removeItem,
  children,
}) => {
  const { Title, Name, Help, Type } = current?.data || {};

  // only for separator type element where things get change!
  const { SeparatorType } = current?.data?.Info || {};

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
          let _currentIndex = d.findIndex((x) => x?.id === current?.id);
          d.splice(++_currentIndex, 0, { ..._current, id: getUUID() });
        })
      );
    }
  };

  const handleDeleteEvent = () => {
    if (removeItem) {
      removeItem(current?.id);
    }
  };

  const separatorOptions = [
    {
      value: 'text',
      label: 'عنوان / متن',
    },
    {
      value: 'line',
      label: 'خط',
    },
  ];

  const handleSeparatorTypeSelection = ({ value }) => {
    setFormObjects(
      produce((d) => {
        const _current = d.find((x) => x?.id === current.id);
        _current.data.Info.SeparatorType = value;
      })
    );
  };

  return (
    <>
      <Styles.FieldsContainer>
        {Type === 'Separator' && (
          <Styles.FieldWrapper>
            <Styles.SelectBoxContainer>
              <Styles.SelectBoxTitle>
                {'انتخاب نوع جداکننده'}
              </Styles.SelectBoxTitle>
              <CustomSelect
                placeholder=""
                options={separatorOptions}
                defaultValue={{
                  value: SeparatorType,
                  label: separatorOptions?.find(
                    (x) => x?.value === SeparatorType
                  )?.label,
                }}
                onChange={handleSeparatorTypeSelection}
              />
            </Styles.SelectBoxContainer>
          </Styles.FieldWrapper>
        )}
        {Type !== 'Separator' && (
          <Styles.FieldWrapper>
            <Styles.LargeSimpleInput
              placeholder={`عنوان فیلد ${current?.title || ''} `}
              value={Title}
              onChange={handleTitleChangeState}
            />
          </Styles.FieldWrapper>
        )}

        <Styles.SmallFieldWrapper>
          <Styles.SmallTitle color={CV_GRAY}>{'شناسه: '}</Styles.SmallTitle>
          <Styles.SmallSimpleInput
            value={Name}
            onChange={handleNameChangeState}
            width={'7rem'}
          />
        </Styles.SmallFieldWrapper>
      </Styles.FieldsContainer>

      <Styles.FieldsContainer>{children}</Styles.FieldsContainer>

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
export default DraggableSharedSetting;
