import { useEffect, useState } from 'react';
import { decodeBase64 } from 'helpers/helpers';
import SaaSTemplateItem from './SaaSTemplateItem';

const SaaSTemplates = ({ nodes, handleAddNodeType, handleDeleteNode }) => {
  const [nodeList, setNodeList] = useState([]);

  useEffect(() => {
    loadNodeTypes();
  }, [nodes]);

  const loadNodeTypes = () => {
    console.log(nodes);
    const _nodes = nodes?.NodeTypes.map((x) => ({
      ...x,
      TypeName: decodeBase64(x?.TypeName),
    }))?.filter((x) => x?.IsCategory || x?.ParentID);

    const unCategorized = nodes?.NodeTypes.map((x) => {
      return {
        ...x,
        TypeName: decodeBase64(x?.TypeName),
      };
    })?.filter((x) => !x?.IsCategory && !x?.ParentID);

    let list = [
      ..._nodes
        .filter((x) => x?.IsCategory)
        .map((x) => ({
          ...x,
          isExpanded: true,
          unCategorized: false,
          Sub: _nodes.filter((l) => l?.ParentID === x?.NodeTypeID),
        })),
    ];
    list.push({
      NodeTypeID: 'unCategorized',
      TypeName: 'غیر دسته‌بندی‌شده',
      isExpanded: false,
      unCategorized: true,
      Sub: unCategorized,
    });
    setNodeList(list);
  };

  useEffect(() => {
    console.log(nodeList);
  }, [nodeList]);
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
