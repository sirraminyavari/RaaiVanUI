import produce from 'immer';
import ToggleButton from 'components/Buttons/Toggle/Toggle';
import * as Styles from './SharedStyles';
import styled from 'styled-components';
import { FLEX_RCB } from '../../../../../../../constant/StyledCommonCss';

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
      <ToggleRow>
        <Styles.ToggleRowTitle>{'پاسخ منحصربه‌فرد'}</Styles.ToggleRowTitle>
        <div>
          <ToggleButton
            value={UniqueValue}
            onToggle={handleUniqueValueStateChange}
          />
        </div>
      </ToggleRow>
      <Styles.ToggleRowHint>
        {'با فعال کردن این گزینه تنها ورودی غیرتکراری از کاربر پذیرفته می‌شود'}
      </Styles.ToggleRowHint>
    </>
  );
};
const ToggleRow = styled.div`
  ${FLEX_RCB};
  width: 100%;
`;
ToggleRow.displayName = 'ToggleRow';
export default ToggleUniqueValueState;
