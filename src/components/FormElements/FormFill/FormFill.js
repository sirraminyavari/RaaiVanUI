import CustomDatePicker from 'components/CustomDatePicker/CustomDatePicker';
import { decodeBase64 } from 'helpers/helpers';
import { toBase64 } from 'js-base64';
import _ from 'lodash';
import { useContext, useEffect, useState } from 'react';
import MultiLeveltype from './types/multiLevel/MultiLevelType';
import MultiSelectField from './types/multiSelect/MultiSelectField';
import SingleSelectField from './types/singleSelect/SingleSelectField';
import TextField from './types/textField/TextField';
import styled from 'styled-components';
import FormCell from './FormCell';
import MultiLevelField from './types/multiLevel/MultiLevelField';
import BinaryField from './types/binary/BinaryField';
import UserSelect from './types/userSelect/UserSelect';
import SubjectField from './types/subjectSelect/SubjectField';
import DateField from './types/date/DateField';
import FileField from './types/file/FileField';
import FormField from './types/form/FormField';
import prepareForm from './types/prepareForm';
import SeperatorField from './types/seperator/SeperatorField';
import saveForm from './types/saveForm';
import { PropsContext } from 'views/Node/nodeDetails/NodeDetails';

const { RVDic, GlobalUtilities } = window;
const FormFill = ({ data, ...props }) => {
  const propsContext = useContext(PropsContext);

  const [tempForm, setTempForm] = useState(data);
  const [whichElementChanged, setWhichElementChanged] = useState(null);
  const [syncTempFormWithBackEnd, setSyncTempFormWithBackEnd] = useState(data);
  useEffect(() => {
    console.log(data, 'data ****');

    setTempForm({
      ...data,
      Elements: data?.Elements?.map((x) => {
        return {
          ...x,
          TextValue: decodeBase64(x?.TextValue),
        };
      }),
    });
  }, []);

  const onAnyFieldChanged = async (elementId, event, type) => {
    const readyToUpdate = prepareForm(tempForm, elementId, event, type);
    setTempForm(readyToUpdate);
    setWhichElementChanged(elementId);

    switch (type) {
      case 'Date':
      case 'Binary':
        await saveFieldChanges(readyToUpdate, elementId);
        break;
      case 'Text':
        await saveFieldChanges(readyToUpdate, elementId);
        break;
      default:
        break;
    }
  };
  const saveFieldChanges = async (readyToUpdate, elementId) => {
    if (whichElementChanged === elementId) {
      try {
        const changedElement = readyToUpdate?.Elements?.find(
          (x) => x?.ElementID === elementId
        );

        const saveResult = await saveForm([changedElement]);

        const freshForm = {
          ...readyToUpdate,
          Elements: readyToUpdate?.Elements?.map((x) =>
            x?.ElementID === elementId ? saveResult[0] : x
          ),
        };

        setSyncTempFormWithBackEnd(freshForm);
        setTempForm(freshForm);
        setWhichElementChanged(null);

        alert('saved', {
          Timeout: 1000,
        });
      } catch (err) {
        setTempForm(syncTempFormWithBackEnd);
        console.log('failed');
        alert('failed', {
          Timeout: 500,
        });
      }
    }
  };

  const formProducer = () => {
    const { Elements } = tempForm || {};
    const element =
      _.isArray(Elements) &&
      !_.isEmpty(Elements) &&
      Elements?.map((item, index) => {
        const {
          Type,
          ElementID,
          Info,
          Title,
          SelectedItems,
          TextValue,
          DateValue_Jalali,
          FloatValue,
          BitValue,
          Files,
          TableColumns,
          TableContent,
          GuidItems,
        } = item || {};
        const decodeInfo = decodeBase64(Info);
        const decodeTitle = decodeBase64(Title);
        switch (Type) {
          case 'Date':
            return (
              <DateField
                decodeInfo={decodeInfo}
                decodeTitle={decodeTitle}
                type={Type}
                onAnyFieldChanged={onAnyFieldChanged}
                elementId={ElementID}
                value={DateValue_Jalali}
              />
            );

          case 'Text': {
            return (
              <TextField
                decodeInfo={decodeInfo}
                decodeTitle={decodeTitle}
                elementId={ElementID}
                type={Type}
                onAnyFieldChanged={onAnyFieldChanged}
                value={TextValue}
                save={(id) => {
                  saveFieldChanges(tempForm, id);
                }}
              />
            );
          }
          case 'Select':
            return (
              <SingleSelectField
                decodeInfo={decodeInfo}
                decodeTitle={decodeTitle}
                type={Type}
                onAnyFieldChanged={onAnyFieldChanged}
                elementId={ElementID}
                value={TextValue}
                save={(id) => saveFieldChanges(tempForm, id)}
              />
            );

          case 'Checkbox':
            return (
              <MultiSelectField
                decodeInfo={decodeInfo}
                decodeTitle={decodeTitle}
                onAnyFieldChanged={onAnyFieldChanged}
                elementId={ElementID}
                type={Type}
                value={TextValue}
                save={(id) => saveFieldChanges(tempForm, id)}
              />
            );

          case 'MultiLevel':
            return (
              <MultiLevelField
                decodeTitle={decodeTitle}
                onAnyFieldChanged={onAnyFieldChanged}
                elementId={ElementID}
                value={GuidItems}
                type={Type}
                decodeInfo={decodeInfo}
                save={(id) => {
                  saveFieldChanges(tempForm, id);
                }}
              />
            );

          case 'Binary':
            return (
              <BinaryField
                decodeTitle={decodeTitle}
                onAnyFieldChanged={onAnyFieldChanged}
                elementId={ElementID}
                value={BitValue}
                type={Type}
                decodeInfo={decodeInfo}
              />
            );

          case 'Numeric':
            return (
              <TextField
                decodeInfo={decodeInfo}
                decodeTitle={decodeTitle}
                elementId={ElementID}
                type={Type}
                onAnyFieldChanged={onAnyFieldChanged}
                value={FloatValue}
                number={true}
                save={(id) => saveFieldChanges(tempForm, id)}
              />
            );

          case 'Node':
            return (
              <SubjectField
                decodeTitle={decodeTitle}
                onAnyFieldChanged={onAnyFieldChanged}
                elementId={ElementID}
                value={GuidItems}
                type={Type}
                decodeInfo={decodeInfo}
                propsContext={propsContext}
                save={(id) => {
                  saveFieldChanges(tempForm, id);
                }}
              />
            );

          case 'User':
            return (
              <UserSelect
                decodeTitle={decodeTitle}
                onAnyFieldChanged={onAnyFieldChanged}
                elementId={ElementID}
                value={SelectedItems}
                text={TextValue}
                type={Type}
                decodeInfo={decodeInfo}
                save={(id) => {
                  saveFieldChanges(tempForm, id);
                }}
              />
            );
          case 'Separator':
            return <SeperatorField decodeTitle={decodeTitle} />;

          case 'File':
            return (
              <FileField
                key={ElementID}
                decodeInfo={decodeInfo}
                decodeTitle={decodeTitle}
                type={Type}
                onAnyFieldChanged={onAnyFieldChanged}
                elementId={ElementID}
                value={Files}
              />
            );

          case 'Form':
            return (
              <FormField
                key={ElementID}
                decodeInfo={decodeInfo}
                decodeTitle={decodeTitle}
                type={Type}
                elementId={ElementID}
                tableColumns={TableColumns}
                tableData={TableContent}
              />
            );

          default:
            return null;
        }
      });
    return element;
  };

  return <Maintainer>{formProducer()}</Maintainer>;
};

export default FormFill;

const Maintainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;
