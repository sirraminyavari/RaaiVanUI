import ToggleNecessaryState from '../sharedItems/ToggleNecessaryState';
import * as Styles from '../sharedItems/SharedStyles';

const TableSideBoxSetting = ({ current, setFormObjects, loadTableNodes }) => {
  return (
    <Styles.Row>
      <ToggleNecessaryState {...{ current, setFormObjects }} />
    </Styles.Row>
  );
};
export default TableSideBoxSetting;
