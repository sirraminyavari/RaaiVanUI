import * as Styles from '../sharedItems/SharedStyles';
import ToggleNecessaryState from '../sharedItems/ToggleNecessaryState';
import ToggleUniqueValueState from '../sharedItems/ToggleUniqueValueState';

const NumericalTypeSideBoxSetting = ({ current, setFormObjects }) => {
  const patternOptions = [
    {
      id: 1,
      value: 'NONE',
      title: '',
    },
  ];
  return (
    <>
      <Styles.Row>
        <ToggleNecessaryState {...{ current, setFormObjects }} />
      </Styles.Row>

      <Styles.Row>
        <ToggleUniqueValueState {...{ current, setFormObjects }} />
      </Styles.Row>
    </>
  );
};
export default NumericalTypeSideBoxSetting;
