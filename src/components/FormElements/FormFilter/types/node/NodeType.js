/**
 * Renders a node filter.
 */
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as Styled from '../types.styles';
import { decodeBase64, encodeBase64 } from 'helpers/helpers';
import ItemProducer from 'components/ItemProducer/ItemProducer';
import AtSignIcon from 'components/Icons/AtSignIcon/AtSign';
import APIHandler from 'apiHelper/APIHandler';

/**
 * @typedef PropType
 * @type {Object}
 * @property {Object} value - Value of component.
 * @property {Object} data - Meta data needed for component.
 * @property {function} onChange - A callback function that fires when value changes.
 */

/**
 *  @description Renders a node type component.
 * @component
 * @param {PropType} props -Props that are passed to component.
 */
const NodeType = (props) => {
  const { onChange, data, value } = props;
  const { ElementID, Title, Info } = data; //! Meta data to feed component.

  const { MultiSelect, NodeTypes } = JSON.parse(decodeBase64(Info));
  const getNodesAPI = new APIHandler('CNAPI', 'GetNodes');
  const [items, setItems] = useState([]);

  //! Fetch nodes based on nodeTypes passed to component.
  const fetchNodes = (searchText) => {
    const nodeTypeIds = NodeTypes.map((node) => node.NodeTypeID).join('|');
    return new Promise((resolve, reject) => {
      getNodesAPI.fetch(
        {
          NodeTypeID: nodeTypeIds,
          UseNodeTypeHierarchy: true,
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
    const id = ElementID;
    const nodeIds = items.map((node) => node.id);
    const JSONValue = { GuidItems: nodeIds };

    //! Send back value to parent on select.
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
        <Styled.NodeTitle>{decodeBase64(Title)}</Styled.NodeTitle>
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

NodeType.propTypes = {
  onChange: PropTypes.func,
  data: PropTypes.object,
  value: PropTypes.object,
};

NodeType.displayName = 'FilterNodeComponent';

export default NodeType;
