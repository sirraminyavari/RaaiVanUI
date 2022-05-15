import ToggleNecessaryState from '../sharedItems/ToggleNecessaryState';
import * as Styles from '../sharedItems/SharedStyles';

const BinaryTypeSideBoxSetting = ({ current, setFormObjects }) => {
  return (
    <Styles.Row>
      <ToggleNecessaryState {...{ current, setFormObjects }} />
    </Styles.Row>
  );
};
export default BinaryTypeSideBoxSetting;
