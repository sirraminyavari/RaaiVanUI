import APIHandler from 'apiHelper/APIHandler';
import { EditorState } from 'draft-js';
import 'draft-js/dist/Draft.css';
import styled from 'styled-components';
import RelatedMeItems from 'views/Profile/items/main/RelatedMeItems';

const TestView = () => {
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
