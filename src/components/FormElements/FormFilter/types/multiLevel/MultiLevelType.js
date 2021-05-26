import { useContext, useEffect, useState } from 'react';
import { decodeBase64 } from 'helpers/helpers';
import APIHandler from 'apiHelper/APIHandler';
import * as Styled from '../types.styles';
import Button from 'components/Buttons/Button';
import Modal from 'components/Modal/Modal';
import { WindowContext } from 'context/WindowProvider';
import FormFill from 'components/FormElements/FormFill/FormFill';
import FormView from 'components/FormElements/FormView/FormView';
import ExactFilter from '../../items/ExactToggle';
import OrFilter from '../../items/OrAndSelect';

const MultiLevelType = (props) => {
  const { onChange, data, value } = props;
  const { NodeType, Levels } = JSON.parse(decodeBase64(data.Info));
  const levels = Levels.map((level) => decodeBase64(level));
  const nodeType = { id: NodeType.ID, name: decodeBase64(NodeType.Name) };
  const getChildNodesAPI = new APIHandler('CNAPI', 'GetChildNodes');
  const { RVDic } = useContext(WindowContext);

  const [nodes, setNodes] = useState([]);
  const [isModalShown, setIsModalShown] = useState(false);
  const [viewItems, setViewItems] = useState([]);
  const [exact, setExact] = useState(false);
  const [or, setOr] = useState(true);

  const orOptions = [
    { value: 'or', title: RVDic.Or },
    { value: 'and', title: RVDic.And },
  ];

  const handleExactFilter = (exactValue) => {
    setExact(exactValue);
  };

  const handleOrFilter = (orValue) => {
    if (orValue === 'or') {
      setOr(true);
    } else {
      setOr(false);
    }
  };

  useEffect(() => {
    getChildNodesAPI.fetch(
      { NodeTypeID: nodeType.id },
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

  useEffect(() => {
    const id = data.ElementID;
    const lastLevel = levels.pop();
    const encodedItems = viewItems.map((item) => item[lastLevel].value.Name);
    const decodedItems = encodedItems.map((item) => decodeBase64(item));

    const JSONValue = {
      TextItems: encodedItems,
      Exact: exact,
      Or: or,
    };

    onChange({
      id,
      value: {
        TextItems: decodedItems,
        Exact: exact,
        Or: or,
        JSONValue: !viewItems.length ? null : JSONValue,
      },
    });
  }, [viewItems]);

  return (
    <Styled.UserContainer>
      <Styled.UserTitle>{decodeBase64(data.Title)}</Styled.UserTitle>
      <FormView.MultiLevel items={viewItems} levels={levels} />
      <Button onClick={handleOnAdd}>{RVDic.Add}</Button>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <OrFilter
          options={orOptions}
          selectedOption={!!or ? 0 : 1}
          name="checkbox-or-filter"
          onSelect={handleOrFilter}
        />
        <ExactFilter onToggle={handleExactFilter} isChecked={exact} />
      </div>
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
