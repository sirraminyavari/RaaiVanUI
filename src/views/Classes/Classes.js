import styled from 'styled-components';
import NodeList from 'components/NodeList/NodeList';
import AdvanceSearch from 'components/AdvanceSearch/AdvanceSearch';

const AdvancedSearchView = (props) => {
  const { match } = props;
  const NodeId = match.params.id;

  return (
    <Container>
      <AdvanceSearch NodeId={NodeId}>
        <NodeList />
      </AdvanceSearch>
    </Container>
  );
};

export default AdvancedSearchView;

const Container = styled.div`
  background-color: #fcfcfd;
  height: 100vh;
`;
