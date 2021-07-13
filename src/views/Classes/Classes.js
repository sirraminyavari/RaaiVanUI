import AdvanceSearch from 'components/AdvancedSearch/AdvancedSearch';
import NodeList from 'components/NodeList/NodeList';
import { useEffect } from 'react';

const AdvancedSearchView = (props) => {
  const { route } = props;

  useEffect(() => {}, [props.route]);

  return (
    <AdvanceSearch
      nodeType={(route?.NodeTypes || []).length ? route.NodeTypes[0] : null}
      hierarchy={route?.Hierarchy || []}>
      <NodeList
        nodeTypeId={
          (route?.NodeTypes || []).length
            ? route.NodeTypes[0]?.NodeTypeID
            : null
        }
      />
    </AdvanceSearch>
  );
};

export default AdvancedSearchView;
