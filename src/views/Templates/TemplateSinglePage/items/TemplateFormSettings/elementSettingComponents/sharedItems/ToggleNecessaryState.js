import produce from 'immer';
import ToggleButton from 'components/Buttons/Toggle/Toggle';
import * as Styles from './SharedStyles';

const ToggleNecessaryState = ({ current, setFormObjects }) => {
  const { Necessary } = current?.data || {};

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

  return (
    <>
      <Styles.ToggleRow>
        <Styles.ToggleRowTitle>{'فیلد ضروری'}</Styles.ToggleRowTitle>
        <div>
          <ToggleButton
            value={Necessary}
            onToggle={handleNecessaryStateChange}
          />
        </div>
      </Styles.ToggleRow>
    </>
  );
};

export default ToggleNecessaryState;
