import { Link } from 'react-router-dom';
import { decode } from 'js-base64';
import * as Styled from '../Sidebar.styles';

const SearchResultsList = ({ results }) => {
  return (
    <Styled.SearchList>
      {results?.NodeTypes?.map((res) => {
        return (
          <Styled.SearchListItem
            as={Link}
            to={`/classes/${res.NodeTypeID}`}
            key={res.NodeTypeID}>
            {decode(res.TypeName)}
          </Styled.SearchListItem>
        );
      })}
    </Styled.SearchList>
  );
};

export default SearchResultsList;
