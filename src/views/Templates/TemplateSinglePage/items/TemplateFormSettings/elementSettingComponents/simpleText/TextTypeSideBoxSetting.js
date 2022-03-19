import * as Styles from './TextTypeSideBoxSettingStyles';
import ToggleButton from 'components/Buttons/Toggle/Toggle';
import produce from 'immer';

const TextTypeSideBoxSetting = ({ current, setFormObjects }) => {
  const { Necessary, UniqueValue } = current?.data || {};

  const handleNecessaryStateChange = (state) => {
    if (setFormObjects) {
      setFormObjects(
        produce((d) => {
          let _current = d?.find((x) => x?.id === current?.id);
          _current.data.Necessary = state;
        })
      );
    }
  };

  const handleUniqueValueStateChange = (state) => {
    if (setFormObjects) {
      setFormObjects(
        produce((d) => {
          let _current = d?.find((x) => x?.id === current?.id);
          _current.data.UniqueValue = state;
        })
      );
    }
  };

  return (
    <Styles.Container>
      <Styles.ToggleRow>
        <div>{'فیلد ضروری'}</div>
        <div>
          <ToggleButton
            value={Necessary}
            onToggle={handleNecessaryStateChange}
          />
        </div>
      </Styles.ToggleRow>

      <Styles.ToggleRow>
        <div>{'پاسخ منحصربه‌فرد'}</div>
        <div>
          <ToggleButton
            value={UniqueValue}
            onToggle={handleUniqueValueStateChange}
          />
        </div>
      </Styles.ToggleRow>
    </Styles.Container>
  );
};
export default TextTypeSideBoxSetting;
