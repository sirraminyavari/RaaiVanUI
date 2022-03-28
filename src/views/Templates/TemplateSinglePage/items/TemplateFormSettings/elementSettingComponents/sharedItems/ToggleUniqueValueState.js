import produce from 'immer';
import ToggleButton from 'components/Buttons/Toggle/Toggle';
import * as Styles from './SharedStyles';

const ToggleUniqueValueState = ({ current, setFormObjects }) => {
  const { UniqueValue } = current?.data || {};
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
    <>
      <Styles.ToggleRow>
        <Styles.ToggleRowTitle>{'پاسخ منحصربه‌فرد'}</Styles.ToggleRowTitle>
        <div>
          <ToggleButton
            value={UniqueValue}
            onToggle={handleUniqueValueStateChange}
          />
        </div>
      </Styles.ToggleRow>
      <Styles.ToggleRowHint>
        {'با فعال کردن این گزینه تنها ورودی غیرتکراری از کاربر پذیرفته می‌شود'}
      </Styles.ToggleRowHint>
    </>
  );
};
export default ToggleUniqueValueState;
