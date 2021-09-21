import CustomDatePicker from 'components/CustomDatePicker/CustomDatePicker';
import { decodeBase64 } from 'helpers/helpers';
import { toBase64 } from 'js-base64';
import _ from 'lodash';
import { useEffect, useState } from 'react';
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
import prepareForm from './types/prepareForm';
import SeperatorField from './types/seperator/SeperatorField';
import saveForm from './types/saveForm';

const { RVDic, GlobalUtilities } = window;
const FormFill = ({ data }) => {
  const [tempForm, setTempForm] = useState(data);
  const [syncTempFormWithBackEnd, setSyncTempFormWithBackEnd] = useState(data);
  useEffect(() => {
    console.log(data, 'data ****');
    setTempForm(tempForm);
  }, []);
  const onAnyFieldChanged = async (elementId, event, type) => {
    const readyToUpdate = prepareForm(tempForm, elementId, event, type);
    setTempForm(readyToUpdate);
    console.log(readyToUpdate, 'readyToUpdate jish');

    switch (type) {
      case 'Date':
      case 'Binary':
        saveFieldChanges(readyToUpdate, elementId);
        break;
      default:
        break;
    }
  };
  const saveFieldChanges = async (readyToUpdate, elementId) => {
    try {
      const changedElement = readyToUpdate?.Elements?.find(
        (x) => x?.ElementID === elementId
      );
      console.log(changedElement, 'changedElement');

      const saveResult = await saveForm([changedElement]);
      const freshForm = {
        ...readyToUpdate,
        Elements: [...readyToUpdate?.Elements, ...saveResult],
      };
      console.log('freshForm', freshForm);

      setSyncTempFormWithBackEnd(freshForm);
      setTempForm(freshForm);
    } catch (err) {
      setTempForm(syncTempFormWithBackEnd);
      console.log('failed');
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
            console.log(decodeBase64(TextValue), 'TextValue');
            return (
              <TextField
                decodeInfo={decodeInfo}
                decodeTitle={decodeTitle}
                elementId={ElementID}
                type={Type}
                onAnyFieldChanged={onAnyFieldChanged}
                value={decodeBase64(TextValue)}
              />
            );
          }
          case 'Select':
            console.log(TextValue, 'Select TextValue');
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
                value={'ttttt'}
                type={Type}
                decodeInfo={decodeInfo}
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
              />
            );

          case 'Node':
            return (
              <SubjectField
                decodeTitle={decodeTitle}
                onAnyFieldChanged={onAnyFieldChanged}
                elementId={ElementID}
                value={[]}
                type={Type}
                decodeInfo={decodeInfo}
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
            return null;

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
