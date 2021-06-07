import styled from 'styled-components';
import NodeList from 'components/NodeList/NodeList';
import AdvanceSearch from 'components/AdvancedSearch/AdvancedSearch';

const AdvancedSearchView = (props) => {
  const { match } = props;
  const NodeTypeID = match.params.id;

  return (
    <Container>
      <AdvanceSearch nodeTypeId={NodeTypeID}>
        <NodeList nodeTypeId={NodeTypeID} />
      </AdvanceSearch>
    </Container>
  );
};

export default AdvancedSearchView;

const Container = styled.div`
  background-color: #fcfcfd;
  height: 100vh;
`;
