import AdvanceSearch from 'components/AdvancedSearch/AdvancedSearch';
import NodeList from 'components/NodeList/NodeList';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const { RVDic, RVGlobal } = window || {};

const RelatedMeItems = (props) => {
  const { route } = props;

  const params = useParams();
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

  const userId = params?.uid || RVGlobal?.CurrentUser?.UserID;

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
            bookmarked={route?.Bookmarked}
            relatedToNodeId={userId}
          />
        )}
      </AdvanceSearch>
      {console.log(route, 'route')}
    </>
  );
};

export default RelatedMeItems;
