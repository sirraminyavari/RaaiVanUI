import * as Styles from '../sharedItems/SharedStyles';
import ToggleButton from 'components/Buttons/Toggle/Toggle';
import ToggleNecessaryState from '../sharedItems/ToggleNecessaryState';
import produce from 'immer';

const ItemTypeSideBoxSetting = ({ current, setFormObjects }) => {
  const { MultiSelect } = current?.data?.Info || {};

  const handleMultiSelectStateChange = (state) => {
    setFormObjects(
      produce((d) => {
        const _current = d.find((x) => x.id === current.id);
        _current.data.Info.MultiSelect = state;
      })
    );
  };

  return (
    <>
      <Styles.Row>
        <ToggleNecessaryState {...{ current, setFormObjects }} />
      </Styles.Row>
      <Styles.Row>
        <Styles.ToggleRow>
          <Styles.ToggleRowTitle>{'انتخاب چندگانه'}</Styles.ToggleRowTitle>
          <ToggleButton
            value={MultiSelect}
            onToggle={handleMultiSelectStateChange}
          />
        </Styles.ToggleRow>
      </Styles.Row>
    </>
  );
};
export default ItemTypeSideBoxSetting;
