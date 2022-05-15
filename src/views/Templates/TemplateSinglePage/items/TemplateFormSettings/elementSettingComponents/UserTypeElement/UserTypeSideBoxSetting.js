import * as Styles from '../sharedItems/SharedStyles';
import ToggleNecessaryState from '../sharedItems/ToggleNecessaryState';
import ToggleUniqueValueState from '../sharedItems/ToggleUniqueValueState';
import ToggleButton from 'components/Buttons/Toggle/Toggle';
import produce from 'immer';

const UserTypeSideBoxSetting = ({ current, setFormObjects }) => {
  const { GroupSelect, MultiSelect } = current?.data?.Info || {};

  const handleMultiSelectStateChange = (state) => {
    setFormObjects(
      produce((d) => {
        const _current = d.find((x) => x.id === current.id);
        _current.data.Info.MultiSelect = state;
      })
    );
  };

  const handleGroupSelectStateChange = (state) => {
    setFormObjects(
      produce((d) => {
        const _current = d.find((x) => x.id === current.id);
        _current.data.Info.GroupSelect = state;
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
        <Styles.ToggleRow>
          <Styles.ToggleRowTitle>{'انتخاب چندگانه'}</Styles.ToggleRowTitle>
          <ToggleButton
            value={MultiSelect}
            onToggle={handleMultiSelectStateChange}
          />
        </Styles.ToggleRow>
      </Styles.Row>

      <Styles.Row>
        <Styles.ToggleRow>
          <Styles.ToggleRowTitle>{'امکان انتخاب گروه'}</Styles.ToggleRowTitle>
          <ToggleButton
            value={GroupSelect}
            onToggle={handleGroupSelectStateChange}
          />
        </Styles.ToggleRow>
      </Styles.Row>
    </>
  );
};
export default UserTypeSideBoxSetting;
