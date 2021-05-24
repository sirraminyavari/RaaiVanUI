import { useContext, useEffect, useState } from 'react';
import { decodeBase64, encodeBase64 } from 'helpers/helpers';
import APIHandler from 'apiHelper/APIHandler';
import * as Styled from '../types.styles';
import Button from 'components/Buttons/Button';
import Modal from 'components/Modal/Modal';
import { WindowContext } from 'context/WindowProvider';
import FormFill from 'components/FormElements/FormFill/FormFill';
import FormView from 'components/FormElements/FormView/FormView';

const MultiLevelType = (props) => {
  const { onChange, data, value } = props;
  const { NodeType, Levels } = JSON.parse(decodeBase64(data.Info));
  const levels = Levels.map((level) => decodeBase64(level));
  const nodeType = { id: NodeType.ID, name: decodeBase64(NodeType.Name) };
  const getNodesAPI = new APIHandler('CNAPI', 'GetNodes');
  const { RVDic } = useContext(WindowContext);

  const [nodes, setNodes] = useState([]);
  const [isModalShown, setIsModalShown] = useState(false);
  const [viewItems, setViewItems] = useState([]);

  useEffect(() => {
    getNodesAPI.fetch(
      {
        NodeTypeID: nodeType.id,
        UseNodeTypeHierarchy: true, //set this value to true
        SearchText: '',
      },
      (response) => {
        setNodes(response.Nodes);
      },
      (error) => console.log(error)
    );
  }, []);

  const handleOnAdd = () => {
    setIsModalShown(true);
  };

  const handleModalClose = () => {
    setIsModalShown(false);
  };

  const handleOnSelect = (values) => {
    handleModalClose();
    setViewItems((items) => [...items, values]);
  };

  return (
    <Styled.UserContainer>
      <Styled.UserTitle>{decodeBase64(data.Title)}</Styled.UserTitle>
      <FormView.MultiLevel items={viewItems} levels={levels} />
      <Button onClick={handleOnAdd}>{RVDic.Add}</Button>
      <Modal
        onClose={handleModalClose}
        title={decodeBase64(data.Title)}
        show={isModalShown}
        contentWidth="50%">
        <FormFill.MultiLevel
          onSelect={handleOnSelect}
          levels={levels}
          nodes={nodes}
        />
      </Modal>
    </Styled.UserContainer>
  );
};

export default MultiLevelType;
