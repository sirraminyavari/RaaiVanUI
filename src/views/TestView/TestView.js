import { useState, lazy } from 'react';
import AutoSuggestInput from 'components/Inputs/AutoSuggestInput/AutoSuggestInput';
import APIHandler from 'apiHelper/APIHandler';
import { decode } from 'js-base64';
import ItemProducer from 'components/ItemProducer/ItemProducer';

const headers = [
  { firstName: 'نام', dataType: 'string' },
  { lastName: 'نام خانوادگی', dataType: 'string' },
  { country: 'کشور', dataType: 'string' },
  { city: 'شهر', dataType: 'string' },
  { age: 'سن', dataType: 'integer' },
  { dateOfBirth: 'تاریخ تولد', dataType: 'date' },
  { progress: 'پیشرفت پروفایل', dataType: 'integer' },
];

const TestView = () => {
  //! If true, Shows a modal to user for more advanced options to choose from.
  const apiHandler = new APIHandler('CNAPI', 'GetNodeTypes');

  const fetchItems = (search) => {
    return new Promise((resolve, reject) => {
      try {
        apiHandler.fetch(
          {
            Count: 1000,
            CheckAccess: true,
            ParseResults: true,
            SearchText: search,
          },
          (response) => {
            // console.log(response, 'rs res res');
            resolve(
              response.NodeTypes.map((node, index) => ({
                id: node.NodeTypeID,
                value: decode(node.TypeName),
                index: index,
                AdditionalID: node.AdditionalID,
              }))
            );
          },

          (error) => reject(error)
        );
      } catch (err) {
        reject(err);
      }
    });
  };

  return (
    <ItemProducer
      fetchItems={fetchItems}
      type={'text'}
      style={{ backgroundColor: 'white' }}
      onItems={(data) => console.log(data, 'items')}
    />
  );
};

export default TestView;
