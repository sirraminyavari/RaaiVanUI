import styled from 'styled-components';
import * as Styles from '../sharedItems/SharedStyles';
import produce from 'immer';
import SelectInputField from 'components/FormElements/ElementTypes/Select/SelectInputField';
import { decodeBase64 } from 'helpers/helpers';

const TableMainSetting = ({ current, setFormObjects, loadTableForms }) => {
  const { data, tableForms } = current || {};

  const getTableForms = async () => {
    const { Forms } = await loadTableForms();
    console.log({ Forms });
    setFormObjects(
      produce((d) => {
        const _current = d?.find((x) => x?.id === current?.id);
        _current.tableForms = Forms.map((item) => ({
          value: item.FormID,
          label: decodeBase64(item.Title),
        }));
      })
    );
  };

  const setTableForm = ({ value, label }) => {
    setFormObjects(
      produce((d) => {
        const _current = d?.find((x) => x?.id === current?.id);
        _current.data.Info = { FormName: label, FormID: value };
      })
    );
  };

  return (
    <>
      <Container
        onFocusCapture={() => {
          getTableForms();
          // if (data.Info.NodeType?.ID) setMultiLevelDepth(data.Info.NodeType?.ID);
        }}
      >
        <TextFieldContainer>
          {`انتخاب فرم`}

          <SelectInputField
            isFocused
            isEditable
            options={tableForms}
            selectedValue={
              data.Info.FormID
                ? {
                    label: decodeBase64(data.Info.FormName),
                    value: data.Info.FormID,
                  }
                : undefined
            }
            onChange={setTableForm}
          />
        </TextFieldContainer>
      </Container>
    </>
  );
};
export default TableMainSetting;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const TextFieldContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  column-gap: 1rem;
`;
