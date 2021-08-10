import AdvanceSearch from 'components/AdvancedSearch/AdvancedSearch';
import NodeList from 'components/NodeList/NodeList';
import React, { useState } from 'react';

const RelatedMeItems = (props) => {
  const { route } = props;
  const [nodeType, setNodeType] = useState(null);

  const onNodeTypeChange = (data, item) => {
    console.log(data, 'node type changed', item, 'item', nodeType?.nodeTypeID);
    setNodeType(item);
  };

  return (
    <AdvanceSearch
      nodeType={nodeType ? nodeType : null}
      hierarchy={route?.Hierarchy || []}
      bookmarked={route?.Bookmarked}
      onApplyNodeType={onNodeTypeChange}
      isProfile={true}>
      <NodeList
        nodeTypeId={nodeType?.NodeTypeID ? nodeType?.NodeTypeID : null}
        bookmarked={route?.Bookmarked}
      />
    </AdvanceSearch>
  );
};

export default RelatedMeItems;
