import { useState, lazy } from 'react';
import AutoSuggestInput from 'components/Inputs/AutoSuggestInput/AutoSuggestInput';
import APIHandler from 'apiHelper/APIHandler';
import { decode } from 'js-base64';
import ItemProducer from 'components/ItemProducer/ItemProducer';

const Modal = lazy(() =>
  import(/* webpackChunkName: "autosuggest-modal" */ 'components/Modal/Modal')
);

const defaultValues = [
  { id: 1, value: 'پیشفرض اول' },
  { id: 2, value: 'پیشفرض دوم' },
  { id: 3, value: 'پیشفرض سوم' },
  { id: 4, value: 'پیشفرض چهارم' },
  { id: 5, value: 'پیشفرض پنجم' },
  { id: 6, value: 'پیشفرض ششم' },
  { id: 7, value: 'پیشفرض هفتم' },
  { id: 8, value: 'پیشفرض هشتم' },
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
