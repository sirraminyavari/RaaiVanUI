import { decodeBase64 } from 'helpers/helpers';
import ItemProducer from 'components/ItemProducer/ItemProducer';

const NodeType = (props) => {
  const { onChange, data } = props;
  const { MultiSelect, NodeTypes } = JSON.parse(decodeBase64(data.Info));

  const fetchNodes = () => {
    return new Promise((resolve, reject) => {
      resolve(
        NodeTypes.map((node) => ({ id: node.NodeTypeID, value: node.NodeType }))
      );
    });
  };

  const handleSelectNodes = (nodes) => {
    const value = { GuidItems: nodes.map((node) => node.id) };
    onChange({
      type: 'Node',
      value: nodes.length ? value : null,
    });
  };

  return (
    <div style={{ width: '100%' }}>
      <div>{data.Title}</div>
      <ItemProducer
        type="autosuggest"
        fetchItems={fetchNodes}
        isDragDisabled={true}
        onItems={handleSelectNodes}
        style={{ width: '100%' }}
      />
    </div>
  );
};

export default NodeType;
