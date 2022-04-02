import * as Styles from '../sharedItems/SharedStyles';
import ToggleNecessaryState from '../sharedItems/ToggleNecessaryState';
import CustomSelect from 'components/Inputs/CustomSelect/CustomSelect';
import { GREGORIAN_CALENDAR, JALALI_CALENDAR } from 'constant/constants';

export const DateTypeSideBoxSetting = ({ current, setFormObjects }) => {
  const { RVDic } = window;
  const { Calendar } = current?.Info || {};

  const calOption = [
    { value: JALALI_CALENDAR, label: RVDic?.X?.Calendar?.Jalali },
    // { value: LUNAR_CALENDAR, label: RVDic?.X?.Calendar?.LunarHijri },
    { value: GREGORIAN_CALENDAR, label: RVDic?.X?.Calendar?.Gregorian },
    // { value: KURDISH_CALENDAR, label: RVDic?.X?.Calendar?.Kurdish },
  ];

  return (
    <>
      <Styles.Row>
        <ToggleNecessaryState {...{ current, setFormObjects }} />
      </Styles.Row>

      <Styles.Row>
        <Styles.SelectBoxTitle>{'انتخاب تقویم'}</Styles.SelectBoxTitle>
        <CustomSelect
          placeholder=""
          options={calOption}
          defaultValue={{
            value: Calendar,
            label: calOption?.find((x) => x?.value === Calendar)?.label,
          }}
          onChange={(e) => {}}
        />
      </Styles.Row>
    </>
  );
};
export default DateTypeSideBoxSetting;
