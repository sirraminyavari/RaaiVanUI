import * as Styles from '../sharedItems/SharedStyles';
import ToggleNecessaryState from '../sharedItems/ToggleNecessaryState';
import ToggleUniqueValueState from '../sharedItems/ToggleUniqueValueState';
import CustomSelect from 'components/Inputs/CustomSelect/CustomSelect';

const NumericalTypeSideBoxSetting = ({ current, setFormObjects }) => {
  const { RVDic } = window;
  const { PatternName, min, max, currency, separator } =
    current?.data?.Info || {};

  const patternOptions = [
    {
      id: 1,
      value: 'NONE',
      label: 'هیچ‌کدام',
    },
    {
      id: 2,
      value: 'NUMBER',
      label: 'عدد',
    },
    {
      id: 3,
      value: 'PRICE',
      label: 'مبلغ',
    },
    {
      id: 4,
      value: 'NATIONAL_CODE',
      label: 'کد ملی',
    },
    {
      id: 5,
      value: 'POSTAL_CODE',
      label: 'کد پستی',
    },
  ];

  const handlePatternNameSelection = (e) => {
    console.log(e);
  };
  return (
    <>
      <Styles.Row>
        <ToggleNecessaryState {...{ current, setFormObjects }} />
      </Styles.Row>

      <Styles.Row>
        <ToggleUniqueValueState {...{ current, setFormObjects }} />
      </Styles.Row>

      <Styles.Row>
        <Styles.SelectBoxTitle>{'الگوهای ورودی'}</Styles.SelectBoxTitle>
        <CustomSelect
          placeholder=""
          options={patternOptions}
          defaultValue={{
            value: PatternName,
            label: patternOptions?.find((x) => x?.value === PatternName)?.label,
          }}
          onChange={handlePatternNameSelection}
        />
      </Styles.Row>
    </>
  );
};
export default NumericalTypeSideBoxSetting;
