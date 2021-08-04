import AdvanceSearch from 'components/AdvancedSearch/AdvancedSearch';
import NodeList from 'components/NodeList/NodeList';
import React from 'react';

const RelatedMeItems = (props) => {
  const { route } = props;

  return (
    <AdvanceSearch
      nodeType={(route?.NodeTypes || []).length ? route.NodeTypes[0] : null}
      hierarchy={route?.Hierarchy || []}
      bookmarked={route?.Bookmarked}
      isProfile={true}>
      <NodeList
        nodeTypeId={
          (route?.NodeTypes || []).length
            ? route.NodeTypes[0]?.NodeTypeID
            : null
        }
        bookmarked={route?.Bookmarked}
      />
    </AdvanceSearch>
  );
};

export default RelatedMeItems;
