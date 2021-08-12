import AdvanceSearch from 'components/AdvancedSearch/AdvancedSearch';
import NodeList from 'components/NodeList/NodeList';
import React, { useState } from 'react';

const RelatedMeItems = (props) => {
  const { route } = props;
  const [nodeType, setNodeType] = useState(null);
  const [nodeTypeIds, setNodeTypeIds] = useState(null);

  const onNodeTypeChange = (data, item) => {
    if (item) {
      setNodeType(item);
      setNodeTypeIds(null);
    } else {
      setNodeType(null);

      setNodeTypeIds(data);
    }
  };

  return (
    <>
      <AdvanceSearch
        nodeType={nodeType ? nodeType : null}
        hierarchy={route?.Hierarchy || []}
        bookmarked={route?.Bookmarked}
        onApplyNodeType={onNodeTypeChange}
        isProfile={true}>
        {(nodeTypeIds || nodeType) && (
          <NodeList
            nodeTypeId={nodeType?.NodeTypeID ? nodeType?.NodeTypeID : null}
            nodeTypeIds={nodeTypeIds}
            bookmarked={route?.Bookmarked}
          />
        )}
      </AdvanceSearch>
      {console.log(nodeTypeIds, '****** nodeTypeIds', nodeType, 'nodeType')}
    </>
  );
};

export default RelatedMeItems;
