import { useState } from 'react';
import AutoSuggestInput from 'components/Inputs/AutoSuggestInput/AutoSuggestInput';
import APIHandler from 'apiHelper/APIHandler';
import { decode } from 'js-base64';
import Modal from 'components/Modal/Modal';

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
  const [selected, setSelected] = useState(null);
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
          (response) =>
            resolve(
              response.NodeTypes.map((node) => ({
                value: decode(node.TypeName),
              }))
            ),
          (error) => reject(error)
        );
      } catch (err) {
        reject(err);
      }

      // try {
      //   fetch(`http://localhost:3004/names?q=${search}`)
      //     .then((response) => response.json())
      //     .then((data) => {
      //       resolve(
      //         data.map((node) => ({
      //           id: node.id,
      //           value: node.name,
      //         }))
      //       );
      //     })
      //     .catch((err) => {
      //       reject(err);
      //     });
      // } catch (error) {
      //   reject(error);
      // }
    });
  };

  return (
    <div style={{ padding: '2rem 1rem', width: '500px' }}>
      <AutoSuggestInput
        fetchItems={fetchItems}
        onItemSelect={(item) => setSelected(item)}
        // defaultItems={defaultValues}
      >
        <Modal>hello modal</Modal>
      </AutoSuggestInput>
      <h3>{selected?.value}</h3>
    </div>
  );
};

export default TestView;
