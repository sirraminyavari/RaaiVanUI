import { useEffect, useState } from 'react';
import { decodeBase64 } from 'helpers/helpers';
import SaaSTemplateItem from './SaaSTemplateItem';

const SaaSTemplates = ({ nodes, handleAddNodeType, handleDeleteNode }) => {
  const [nodeList, setNodeList] = useState([]);

  useEffect(() => {
    loadNodeTypes();
  }, [nodes]);

  const loadNodeTypes = () => {
    const _nodes = nodes?.NodeTypes.map((x) => ({
      ...x,
      TypeName: decodeBase64(x?.TypeName),
    }))?.filter((x) => x?.IsCategory || x?.ParentID);

    console.log(_nodes);

    let list = [
      ..._nodes
        .filter((x) => x?.IsCategory)
        .map((x) => ({
          ...x,
          isExpanded: true,
          Sub: _nodes.filter((l) => l?.ParentID === x?.NodeTypeID),
        })),
    ];
    setNodeList(list);
  };

  return (
    <>
      {nodeList.map((x) => (
        <SaaSTemplateItem
          key={x?.NodeTypeID}
          {...x}
          handleAddNodeType={handleAddNodeType}
          handleDeleteNode={handleDeleteNode}
        />
      ))}
    </>
  );
};
export default SaaSTemplates;
