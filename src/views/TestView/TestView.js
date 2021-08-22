import APIHandler from 'apiHelper/APIHandler';
import ItemProducer from 'components/ItemProducer/ItemProducer';
import { EditorState } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { decode } from 'js-base64';
import { lazy, useState } from 'react';
import styled from 'styled-components';
import Modal from 'components/Modal/Modal';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';
import ItemSelection from 'components/ItemSelection/ItemSelection';
import RelatedMeItems from 'views/Profile/items/main/RelatedMeItems';

const TestView = () => {
  // new EditorJS({
  //   /**
  //    * Id of Element that should contain Editor instance
  //    */
  //   holder: 'editorjs',
  // });
  //! If true, Shows a modal to user for more advanced options to choose from.
  const apiHandler = new APIHandler('CNAPI', 'GetNodeInfo');

  const [savedData, setSavedData] = useState([
    { id: '1', value: '2' },
    { id: '2', value: '2v' },
    { id: '3', value: 'x2' },
    { id: '4', value: '2s' },
    { id: '5', value: '2c' },
    { id: '6', value: '2a' },
  ]);
  const [isVisible, setIsVisible] = useState(false);
  const [editorState, setEditorState] = useState({
    editorState: EditorState.createEmpty(),
  });

  const onClose = () => {
    setIsVisible(false);
  };

  return (
    <>
      <RelatedMeItems />
      {/* <Container>
        <button onClick={() => setIsVisible(true)}>{'open modal'}</button>
        <Modal
          onClose={onClose}
          contentWidth={DimensionHelper().isTabletOrMobile ? '98%' : '90%'}
          style={{ padding: '0', height: '50%' }}
          stick
          show={isVisible}>
          <ItemSelection onClose={() => setIsVisible(false)} />
        </Modal>
      </Container> */}
      {/* <MainEditor />  */}
    </>
  );
};

export default TestView;

const Container = styled.div`
  background-color: #fcfcfd;
  overflow: hidden;
  height: 30vh;
`;
