import { useState, useEffect } from 'react';
import BalloonBlockEditor from 'components/CKEditor-custom/BallonBlock/BalloonBlockEditor';

const TestView = () => {
  const [data, setData] = useState('<p>Hello from CKEditor 5!</p>');

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <>
      <div style={{ padding: '50px' }}>
        <h2>Using CKEditor 5 build in React</h2>
        <BalloonBlockEditor data={data} handleDataChange={setData} />
      </div>
      <div dangerouslySetInnerHTML={{ __html: data }}></div>
    </>
  );
};

export default TestView;
