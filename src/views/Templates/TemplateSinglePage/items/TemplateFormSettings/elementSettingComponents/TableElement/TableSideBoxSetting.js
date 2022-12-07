import ToggleNecessaryState from '../sharedItems/ToggleNecessaryState';
import * as Styles from '../sharedItems/SharedStyles';
import produce from 'immer';
import SelectInputField from 'components/FormElements/ElementTypes/Select/SelectInputField';
import { decodeBase64 } from 'helpers/helpers';

const TableSideBoxSetting = ({ current, setFormObjects, loadTableForms }) => {
  const { data, tableForms } = current || {};

  const TableForms = async () => {
    const { Forms } = await loadTableForms();
    setFormObjects(
      produce((d) => {
        const _current = d?.find((x) => x?.id === current?.id);
        _current.tableForms = Forms.map((item) => ({
          label: decodeBase64(item.Title),
          value: item.FormID,
        }));
      })
    );
  };

  const setTableForms = ({ value, label }) => {
    setFormObjects(
      produce((d) => {
        const _current = d?.find((x) => x?.id === current?.id);
        _current.data.Info = { FormName: label, FormID: value };
      })
    );
  };

  return (
    <Styles.Row
      onFocusCapture={() => {
        TableForms();
      }}
    >
      <ToggleNecessaryState {...{ current, setFormObjects }} />
      <Styles.ToggleRow>
        <Styles.ToggleRowTitle>{'کلاس'}</Styles.ToggleRowTitle>
        <SelectInputField
          isFocused
          isEditable
          options={tableForms}
          selectedValue={
            data.Info.FormName && data.Info.FormID
              ? {
                  label: decodeBase64(data.Info.FormName),
                  value: data.Info.FormID,
                }
              : undefined
          }
          onChange={(selectedItem) => {
            setTableForms(selectedItem);
          }}
        />
      </Styles.ToggleRow>
    </Styles.Row>
  );
};
export default TableSideBoxSetting;
