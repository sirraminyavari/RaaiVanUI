/**
 * The main content of NodeDetails will produce here.
 */

import APIHandler from 'apiHelper/APIHandler';
import FormFill from 'components/FormElements/FormFill/FormFill';
import Heading from 'components/Heading/Heading';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import MultiSelectField from '../../../../components/FormElements/FormFill/types/multiSelect/MultiSelectField';
import SingleSelectField from '../../../../components/FormElements/FormFill/types/singleSelect/SingleSelectField';
import TextField from '../../../../components/FormElements/FormFill/types/textField/TextField';

const fromServerFields = {
  reduced: { value: 'aaaaaaaa' },
  mailType: [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
  ],
  relatedToMail: [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
  ],
  reviewDate: { value: '20,8,2021' },
  mailNumber: { value: '1234' },
  reveivergender: [{ value: 'male' }, { value: 'female' }],
  province: { province: 'tehran', city: 'tehran', village: 'lavasanat' },
  mailSubject: [{ value: 'abcd' }],
  copyForPeople: [
    { value: 'a' },
    { value: 'b' },
    { value: 'c' },
    { value: 'v' },
  ],
  mailFile: {},
  sendingMailTimeSheet: [{ value: '1', value: '2', value: '3' }],
};

const getNode = new APIHandler('CNAPI', 'GetNode');
const getFormInstance = new APIHandler('FGAPI', 'GetFormInstance');
const getInstanceId = new APIHandler('FGAPI', 'InitializeOwnerFormInstance');
const MainNode = ({ nodeDetails, nodeId }) => {
  const [fields, setFields] = useState(null);

  useEffect(() => {
    getInstanceId.fetch(
      {
        OwnerID: nodeId,
      },
      (result) => {
        getFormInstance.fetch(
          {
            InstanceID: result?.InstanceID,
            LimitOwnerID: null,
            ShowAllIfNoLimit: true,
          },
          (response) => {
            setFields(response);
          }
        );
      }
    );
  }, []);

  return (
    <Main>
      <Heading type={'h1'}>
        {
          'نامه مفاصا حساب قرارداد شماره «۹۸۴۳۱/۴/۶۱» با موضوع «پشتیبانی و بهینه سازی نرم افزار مدیریت دانش سازمانی رای ون» - اقتصاد نوین'
        }
      </Heading>
      {/* {formProducer()} */}
      {fields && <FormFill data={fields} />}
    </Main>
  );
};
export default MainNode;

const Main = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100rem;
`;
