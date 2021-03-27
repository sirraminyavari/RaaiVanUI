import AutoSuggestInput from 'components/Inputs/AutoSuggestInput/AutoSuggestInput';
import APIHandler from 'apiHelper/APIHandler';
// import { decode } from 'js-base64';

const TestView = () => {
  // const apiHandler = new APIHandler('CNAPI', 'GetNodeTypes');

  const fetchItems = (search) => {
    return new Promise((resolve, reject) => {
      // try {
      //   apiHandler.fetch(
      //     {
      //       Count: 1000,
      //       CheckAccess: true,
      //       ParseResults: true,
      //       SearchText: search,
      //     },
      //     (response) =>
      //       resolve(
      //         response.NodeTypes.map((node) => ({
      //           value: decode(node.TypeName),
      //         }))
      //       ),
      //     (error) => reject(error)
      //   );
      // } catch (err) {
      //   reject(err);
      // }

      try {
        fetch(`http://localhost:3004/names?q=${search}`)
          .then((response) => response.json())
          .then((data) => {
            resolve(
              data.map((node) => ({
                id: node.id,
                value: node.name,
              }))
            );
          })
          .catch((err) => {
            reject(err);
          });
      } catch (error) {
        reject(error);
      }
    });
  };

  return (
    <div style={{ padding: '2rem 1rem', width: '500px' }}>
      <AutoSuggestInput
        fetchItems={fetchItems}
        onItemSelect={(item) => console.log(item)}
      />
    </div>
  );
};

export default TestView;
