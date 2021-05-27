import { useState, lazy } from 'react';
import AutoSuggestInput from 'components/Inputs/AutoSuggestInput/AutoSuggestInput';
import APIHandler from 'apiHelper/APIHandler';
import { decode } from 'js-base64';
import ItemProducer from 'components/ItemProducer/ItemProducer';
import SubjectItem from 'components/SubjectItem/screen/SubjectItem';
import styled from 'styled-components';
import EditorJS from '@editorjs/editorjs';
import ReactDOM from 'react-dom';
import { Editor, EditorState } from 'draft-js';
import 'draft-js/dist/Draft.css';
import MainEditor from 'components/Editor/MainEditor';
import NodeList from 'components/NodeList/NodeList';
import AdvanceSearch from 'components/AdvanceSearch/AdvanceSearch';

const Modal = lazy(() =>
  import(/* webpackChunkName: "autosuggest-modal" */ 'components/Modal/Modal')
);
const NodeId = '0033c52b-9871-4197-9b7d-ab45203cb4ee';

const itemInput = {
  NodeID: '3d7c7551-3a1f-4e9d-8d83-72bd41cd6972',
  Name: '2KfYt9mE2KfYudin2Kog2LTYqNqp2YfigIzZh9in24wg2KfYrNiq2YXYp9i524w=',
  NodeTypeID: 'a790cf42-e2ba-40c8-a6ff-646d7f15be92',
  NodeType: '2LXZgdit2Yc=',
  AdditionalID: 'MTQwMDAzMDAy',
  Description: '',
  IconURL: '../../images/Preview.png',
  Archived: false,
  ChildsCount: 0,
  CreationDate: '1400/01/23',
  Creator: {
    UserID: '33485344-0a27-45f4-bd81-0313004faf5a',
    UserName: 'a2hqYWhhbmlhbg==',
    FirstName: '2K7YtNin24zYp9ix',
    LastName: '2KzZh9in2YbbjNin2YY=',
    ProfileImageURL: '../../Images/unknown.jpg',
  },
  RelatedNodesCount: 0,
  ExpertsCount: 0,
  Extensions: [],
  HasChild: false,
  HideCreators: false,
  LikeStatus: false,
  LikesCount: 0,
  MembersCount: 0,
  Status: '',
  UserStatus: {
    Editable: false,
    IsAdminMember: false,
    IsAreaAdmin: false,
    IsContributor: false,
    IsCreator: false,
    IsExpert: false,
    IsMember: false,
    IsServiceAdmin: false,
    VisitsCount: 0,
    WFState: '',
  },
};

const TestView = () => {
  new EditorJS({
    /**
     * Id of Element that should contain Editor instance
     */
    holder: 'editorjs',
  });
  //! If true, Shows a modal to user for more advanced options to choose from.
  const apiHandler = new APIHandler('CNAPI', 'GetNodeInfo');

  const [selectMode, setSelectMode] = useState(false);
  const [editorState, setEditorState] = useState({
    editorState: EditorState.createEmpty(),
  });

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
    <Container>
      <ItemProducer
        fetchItems={fetchItems}
        type={'autosuggest'}
        style={{ backgroundColor: 'white' }}
        onItems={(data) => console.log(data, 'items')}
        savedData={[
          { id: '1', value: '2' },
          { id: '2', value: '2v' },
          { id: '3', value: 'x2' },
          { id: '4', value: '2s' },
          { id: '5', value: '2c' },
          { id: '6', value: '2a' },
        ]}
      />
      {/* 
      <button onClick={() => setSelectMode(!selectMode)}>
        {'select mode'}
      </button>
      <SubjectItem
        onChecked={(value, item) => console.log(value, item, 'onChecked')}
        selectMode={selectMode}
        item={itemInput}
        isSaas={true}
      />
      <NodeList />
      <MainEditor /> */}
      <AdvanceSearch NodeId={NodeId}>
        <NodeList />
      </AdvanceSearch>
    </Container>
  );
};

export default TestView;

const Container = styled.div`
  background-color: #fcfcfd;
  height: 100vh;
`;
