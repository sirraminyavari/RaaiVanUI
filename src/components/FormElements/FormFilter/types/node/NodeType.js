import { useState, useEffect } from 'react';
import * as Styled from '../types.styles';
import { decodeBase64, encodeBase64 } from 'helpers/helpers';
import ItemProducer from 'components/ItemProducer/ItemProducer';
import AtSignIcon from 'components/Icons/AtSignIcon/AtSign';
import APIHandler from 'apiHelper/APIHandler';

const NodeType = (props) => {
  const { onChange, data } = props;
  const { MultiSelect, NodeTypes } = JSON.parse(decodeBase64(data.Info));
  const getNodesAPI = new APIHandler('CNAPI', 'GetNodes');
  const [items, setItems] = useState([]);

  const fetchNodes = (searchText) => {
    const nodeTypeIds = NodeTypes.map((node) => node.NodeTypeID).join('|');
    return new Promise((resolve, reject) => {
      getNodesAPI.fetch(
        {
          NodeTypeID: nodeTypeIds,
          UseNodeTypeHierarchy: true, //set this value to true
          SearchText: encodeBase64(searchText),
          // Count: 5,
          // LowerBoundary: 'number',
          // CreationDateFrom: 'date',
          // CreationDateTo: 'date',
          // FormFilters: '',
        },
        (response) => {
          const nodes = response.Nodes.map((node) => ({
            id: node.NodeID,
            value: decodeBase64(node.Name),
          }));
          resolve(nodes);
        },
        (error) => reject(error)
      );
    });
  };

  const handleSelectNodes = (nodes) => {
    setItems(nodes);
  };

  useEffect(() => {
    const id = data.ElementID;
    const nodeIds = items.map((node) => node.id);
    const JSONValue = { GuidItems: nodeIds };
    onChange({
      id,
      value: {
        GuidItems: !items.length ? null : nodeIds.join('|'),
        Data: items,
        JSONValue: !items.length ? null : JSONValue,
      },
    });
  }, [items]);

  return (
    <Styled.NodeContainer>
      <Styled.NodeTitleWrapper>
        <AtSignIcon />
        <Styled.NodeTitle>{data.Title}</Styled.NodeTitle>
      </Styled.NodeTitleWrapper>
      <ItemProducer
        type="autosuggest"
        fetchItems={fetchNodes}
        isDragDisabled={true}
        onItems={handleSelectNodes}
        style={{ width: '100%' }}
      />
    </Styled.NodeContainer>
  );
};

export default NodeType;
