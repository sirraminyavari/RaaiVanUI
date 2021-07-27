import AdvanceSearch from 'components/AdvancedSearch/AdvancedSearch';
import NodeList from 'components/NodeList/NodeList';
import { useEffect } from 'react';

const AdvancedSearchView = (props) => {
  const { route } = props;

  useEffect(() => {}, [props.route]);
  console.log('classes render');
  return (
    <AdvanceSearch
      nodeType={(route?.NodeTypes || []).length ? route.NodeTypes[0] : null}
      hierarchy={route?.Hierarchy || []}
      bookmarked={route?.Bookmarked}>
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

export default AdvancedSearchView;
