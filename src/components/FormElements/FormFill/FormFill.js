// import CustomDatePicker from 'components/CustomDatePicker/CustomDatePicker';
import { decodeBase64 } from 'helpers/helpers';
import _ from 'lodash';
import React, { useCallback, useContext, useEffect, useState } from 'react';
// import MultiLeveltype from './types/multiLevel/MultiLevelType';
import MultiSelectField from './types/multiSelect/MultiSelectField';
import SingleSelectField from './types/singleSelect/SingleSelectField';
import TextField from './types/textField/TextField';
import ParagraphField from './types/ParagraphField/ParagraphField';
import styled from 'styled-components';
import MultiLevelField from './types/multiLevel/MultiLevelField';
import BinaryField from './types/binary/BinaryField';
import UserSelect from './types/userSelect/UserSelect';
import SubjectField from './types/subjectSelect/SubjectField';
import DateField from './types/date/DateField';
import FileField from './types/file/FileField';
import FormField from './types/form/FormField';
import prepareForm from './types/prepareForm';
import SeparatorField from './types/separator/separator';
import saveForm from './types/saveForm';
import { PropsContext } from 'views/Node/nodeDetails/NodeDetails';

export const EditableContext = React.createContext();
const FormFill = ({ data, editable, ...props }) => {
  const propsContext = useContext(PropsContext);

  const [tempForm, setTempForm] = useState(data);
  const [whichElementChanged, setWhichElementChanged] = useState(null);
  const [syncTempFormWithBackEnd, setSyncTempFormWithBackEnd] = useState(data);
  useEffect(() => {
    setTempForm({
      ...data,
      Elements: data?.Elements?.map((x) => {
        return {
          ...x,
          TextValue: decodeBase64(x?.TextValue),
        };
      }),
    });
  }, [data]);

  const onAnyFieldChanged = async (
    elementId,
    event,
    type,
    saveOnChange = false
  ) => {
    const readyToUpdate = prepareForm(tempForm, elementId, event, type);
    setTempForm(readyToUpdate);

    console.log({ readyToUpdate });
    setWhichElementChanged(elementId);

    switch (type) {
      case 'Date':
        await saveFieldChanges(readyToUpdate, elementId);
        break;
      case 'Binary':
        await saveFieldChanges(readyToUpdate, elementId);
        break;
      case 'Text':
        // await saveFieldChanges(readyToUpdate, elementId);
        break;
      case 'File':
        const result = await saveFieldChanges(readyToUpdate, elementId);
        return result;
      default:
        break;
    }
    if (saveOnChange) await saveFieldChanges(readyToUpdate, elementId);
  };
  const saveFieldChanges = useCallback(
    async (readyToUpdate, elementId) => {
      console.log('saveFieldChanges', {
        readyToUpdate,
        whichElementChanged,
        elementId,
      });
      // if (whichElementChanged === elementId) {
      if (true) {
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
          // console.log({ freshForm });
          setSyncTempFormWithBackEnd(freshForm);
          setTempForm(freshForm);
          setWhichElementChanged(null);
          return true;

          // alert('saved', {
          //   Timeout: 1000,
          // });
        } catch (err) {
          setTempForm(syncTempFormWithBackEnd);
          console.log('failed');
          return false;
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [whichElementChanged]
  );

  const formProducer = (FormObject) => {
    const { Elements } = FormObject || {};
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
          DateValue,
          FloatValue,
          BitValue,
          Files,
          TableColumns,
          TableContent,
          GuidItems,
          InstanceID,
          RefElementID,
          SequenceNumber,
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
                value={TextValue}
              />
            );

          case 'Text': {
            const { UseSimpleEditor } = JSON.parse(decodeInfo || '{}');
            if (UseSimpleEditor)
              return (
                <TextField
                  decodeInfo={decodeInfo}
                  decodeTitle={decodeTitle}
                  elementId={ElementID}
                  type={Type}
                  onAnyFieldChanged={onAnyFieldChanged}
                  value={TextValue}
                  save={() => {
                    saveFieldChanges(FormObject, ElementID);
                  }}
                />
              );
            else
              return (
                <ParagraphField
                  decodeInfo={decodeInfo}
                  decodeTitle={decodeTitle}
                  elementId={ElementID}
                  type={Type}
                  onAnyFieldChanged={onAnyFieldChanged}
                  value={TextValue}
                  save={() => {
                    saveFieldChanges(FormObject, ElementID);
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
                save={(id) => saveFieldChanges(FormObject, id)}
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
                save={(id) => saveFieldChanges(FormObject, id)}
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
                  saveFieldChanges(FormObject, id);
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
                save={(id) => saveFieldChanges(FormObject, id)}
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
                  saveFieldChanges(FormObject, id);
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
                  saveFieldChanges(FormObject, id);
                }}
              />
            );
          case 'Separator':
            return <SeparatorField decodeTitle={decodeTitle} />;

          case 'File':
            return (
              <FileField
                key={ElementID}
                decodeInfo={decodeInfo}
                decodeTitle={decodeTitle}
                type={Type}
                onAnyFieldChanged={onAnyFieldChanged}
                elementId={ElementID}
                Files={Files}
              />
            );

          case 'Form':
            return (
              <FormField
                key={ElementID}
                decodeInfo={decodeInfo}
                decodeTitle={decodeTitle}
                type={Type}
                ElementID={ElementID}
                tableColumns={TableColumns}
                tableData={TableContent}
                InstanceID={InstanceID}
                RefElementID={RefElementID}
                SequenceNumber={SequenceNumber}
              />
            );

          default:
            return null;
        }
      });
    return element;
  };

  return (
    <EditableContext.Provider value={editable}>
      <Maintainer>{formProducer(tempForm)}</Maintainer>
    </EditableContext.Provider>
  );
};

FormFill.displayName = 'FormFill';

export default FormFill;

const Maintainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;
