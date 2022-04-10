import * as Styles from './TextTypeSideBoxSettingStyles';
import produce from 'immer';
import ToggleNecessaryState from '../sharedItems/ToggleNecessaryState';
import ToggleUniqueValueState from '../sharedItems/ToggleUniqueValueState';
import * as SharedStyle from '../sharedItems/SharedStyles';
import CustomSelect from '../../../../../../../components/Inputs/CustomSelect/CustomSelect';

const TextTypeSideBoxSetting = ({ current, setFormObjects }) => {
  const { type, data } = current || {};
  const { PatternName } = data?.Info || {};

  const patternOptions = [
    {
      id: 1,
      value: 'mobile',
      label: 'تلفن همراه',
    },
    {
      id: 2,
      value: 'phone',
      label: 'تلفن ثابت',
    },
    {
      id: 3,
      value: 'phoneByNationalCode',
      label: 'تلفن با کد کشور',
    },
  ];

  const handleMinCharStateChange = (e) => {
    setFormObjects(
      produce((d) => {
        const _current = d.find((x) => x?.id === current?.id);
        _current.data.Info.min = e?.target?.value;
      })
    );
  };

  const handleMaxCharStateChange = (e) => {
    setFormObjects(
      produce((d) => {
        const _current = d.find((x) => x?.id === current?.id);
        _current.data.Info.max = e?.target?.value;
      })
    );
  };

  const handlePhonePatternStateChange = (e) => {
    const { value } = e;
    setFormObjects(
      produce((d) => {
        let _current = d?.find((x) => x?.id === current?.id);
        _current.data.Info.PatternName = value;
      })
    );
  };

  return (
    <Styles.Container>
      <Styles.Row>
        <ToggleNecessaryState {...{ current, setFormObjects }} />
      </Styles.Row>

      {(type !== 'paragraph' || 'phone') && (
        <Styles.Row>
          <ToggleUniqueValueState {...{ current, setFormObjects }} />
        </Styles.Row>
      )}

      {type !== 'email' && type !== 'url' && type !== 'phone' && (
        <>
          <Styles.InputRowContainer>
            <Styles.ToggleRowTitle>
              {'حداقل تعداد کاراکتر'}
            </Styles.ToggleRowTitle>
            <Styles.Input
              value={data?.Info?.min}
              onChange={handleMinCharStateChange}
            />
          </Styles.InputRowContainer>

          <Styles.InputRowContainer>
            <Styles.ToggleRowTitle>
              {'حداکثر تعداد کاراکتر'}
            </Styles.ToggleRowTitle>
            <Styles.Input
              value={data?.Info?.max}
              onChange={handleMaxCharStateChange}
            />
          </Styles.InputRowContainer>
        </>
      )}

      {type === 'phone' && (
        <Styles.Row>
          <SharedStyle.SelectBoxTitle>
            {'الگوهای ورودی'}
          </SharedStyle.SelectBoxTitle>
          <CustomSelect
            placeholder=""
            options={patternOptions}
            defaultValue={{
              value: PatternName,
              label: patternOptions?.find((x) => x?.value === PatternName)
                ?.label,
            }}
            onChange={handlePhonePatternStateChange}
          />
        </Styles.Row>
      )}
    </Styles.Container>
  );
};
export default TextTypeSideBoxSetting;
