import * as Styles from '../sharedItems/SharedStyles';
import ToggleNecessaryState from '../sharedItems/ToggleNecessaryState';
import ToggleUniqueValueState from '../sharedItems/ToggleUniqueValueState';
import CustomSelect from 'components/Inputs/CustomSelect/CustomSelect';
import ToggleButton from 'components/Buttons/Toggle/Toggle';
import produce from 'immer';

const NumericalTypeSideBoxSetting = ({ current, setFormObjects }) => {
  const { RVDic } = window;
  const { PatternName, min, max, currency, separator, percentage } =
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

  const currencyOptions = [
    {
      id: 1,
      value: 'NONE',
      label: 'هیچ‌کدام',
    },
    {
      id: 2,
      value: 'TOMAN',
      label: 'تومان',
    },
    {
      id: 3,
      value: 'RIAL',
      label: 'ریال',
    },
    {
      id: 4,
      value: 'DOLLAR',
      label: 'دلار ($)',
    },
    {
      id: 6,
      value: 'EURO',
      label: 'یورو (€) ',
    },
  ];

  const handlePatternNameSelection = (e) => {
    const { value } = e;
    setFormObjects(
      produce((d) => {
        let _current = d?.find((x) => x?.id === current?.id);
        _current.data.Info.PatternName = value;
      })
    );
  };

  const handleCurrencyTypeSelection = (e) => {
    const { value } = e;
    setFormObjects(
      produce((d) => {
        let _current = d?.find((x) => x?.id === current?.id);
        _current.data.Info.currency = value;
      })
    );
  };

  const handleSeparatorStateChange = (e) => {
    setFormObjects(
      produce((d) => {
        let _current = d?.find((x) => x?.id === current?.id);
        _current.data.Info.separator = e;
      })
    );
  };

  const handlePercentageStateChange = (e) => {
    setFormObjects(
      produce((d) => {
        let _current = d?.find((x) => x?.id === current?.id);
        _current.data.Info.percentage = e;
      })
    );
  };

  const handleMinStateChange = (e) => {
    setFormObjects(
      produce((d) => {
        let _current = d?.find((x) => x?.id === current?.id);
        _current.data.Info.min = e?.target?.value;
      })
    );
  };

  const handleMaxStateChange = (e) => {
    setFormObjects(
      produce((d) => {
        let _current = d?.find((x) => x?.id === current?.id);
        _current.data.Info.max = e?.target?.value;
      })
    );
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

      {(PatternName === 'PRICE' || PatternName === 'NUMBER') && (
        <Styles.Row>
          <Styles.ToggleRow>
            <Styles.ToggleRowTitle>
              {'جداکردن با کاما (,)'}
            </Styles.ToggleRowTitle>
            <ToggleButton
              value={separator}
              onToggle={handleSeparatorStateChange}
            />
          </Styles.ToggleRow>
        </Styles.Row>
      )}

      {PatternName === 'NUMBER' && (
        <Styles.Row>
          <Styles.ToggleRow>
            <Styles.ToggleRowTitle>
              {'نمایش به صورت درصدی'}
            </Styles.ToggleRowTitle>
            <ToggleButton
              value={percentage}
              onToggle={handlePercentageStateChange}
            />
          </Styles.ToggleRow>
        </Styles.Row>
      )}

      {PatternName === 'PRICE' && (
        <Styles.Row>
          <Styles.SelectBoxTitle>{'نمایش نماد ارزی'}</Styles.SelectBoxTitle>
          <CustomSelect
            placeholder=""
            options={currencyOptions}
            defaultValue={{
              value: currency,
              label: currencyOptions?.find((x) => x?.value === currency)?.label,
            }}
            onChange={handleCurrencyTypeSelection}
          />
        </Styles.Row>
      )}

      {(PatternName === 'PRICE' || PatternName === 'NUMBER') && (
        <>
          <Styles.Row>
            <Styles.InputRowContainer>
              <Styles.ToggleRowTitle>
                {PatternName === 'PRICE' ? 'حداقل مبلغ' : 'حداقل مقدار'}
              </Styles.ToggleRowTitle>
              <Styles.Input value={min} onChange={handleMinStateChange} />
            </Styles.InputRowContainer>
          </Styles.Row>

          <Styles.Row>
            <Styles.InputRowContainer>
              <Styles.ToggleRowTitle>
                {PatternName === 'PRICE' ? 'حداکثر مبلغ' : 'حداکثر مقدار'}
              </Styles.ToggleRowTitle>
              <Styles.Input value={max} onChange={handleMaxStateChange} />
            </Styles.InputRowContainer>
          </Styles.Row>
        </>
      )}
    </>
  );
};
export default NumericalTypeSideBoxSetting;
