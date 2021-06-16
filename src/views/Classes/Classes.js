import AdvanceSearch from 'components/AdvancedSearch/AdvancedSearch';
import NodeList from 'components/NodeList/NodeList';
import styled from 'styled-components';
const AdvancedSearchView = (props) => {
  const { route } = props;

  return (
    <Container>
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
    </Container>
  );
};

export default AdvancedSearchView;

const Container = styled.div`
  background-color: #fcfcfd;
  height: 100vh;
`;
