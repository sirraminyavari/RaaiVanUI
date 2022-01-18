import { useEffect, useState } from 'react';
import { getNodeTypes } from 'apiHelper/ApiHandlers/CNApi';
import { decodeBase64 } from 'helpers/helpers';
import SaaSTemplateItem from './SaaSTemplateItem';

const SaaSTemplates = ({ nodes, handleAddNodeType, ...rest }) => {
  const [nodeList, setNodeList] = useState([]);

  useEffect(() => {
    loadNodeTypes();
  }, []);

  const loadNodeTypes = () => {
    getNodeTypes().then((res) => {
      const nodes = res?.NodeTypes.map((x) => ({
        ...x,
        TypeName: decodeBase64(x?.TypeName),
      }));

      const list = [
        ...nodes
          .filter((x) => x?.IsCategory)
          .map((x) => ({ ...x, isExpanded: true })),
        {
          TypeName: 'not categorized',
          isExpanded: true,
          Sub: [...nodes.filter((x) => !x?.IsCategory)],
        },
      ];
      setNodeList(list);
      console.log(list);
    });
  };

  return (
    <>
      {nodeList.map((x) => (
        <SaaSTemplateItem
          key={x?.NodeTypeID}
          {...x}
          handleAddNodeType={handleAddNodeType}
        />
      ))}
    </>
  );
};
export default SaaSTemplates;
