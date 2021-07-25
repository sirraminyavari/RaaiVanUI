import AdvanceSearch from 'components/AdvancedSearch/AdvancedSearch';
import NodeList from 'components/NodeList/NodeList';
import { useEffect } from 'react';

const AdvancedSearchView = (props) => {
  const { route } = props;

  useEffect(() => {}, [props.route]);

  return (
    <>
      {console.log(route, 'route***')}

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
        />
      </AdvanceSearch>
    </>
  );
};

export default AdvancedSearchView;
