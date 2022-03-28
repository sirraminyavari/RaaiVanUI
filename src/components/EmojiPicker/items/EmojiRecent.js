import styled from 'styled-components';
import { FLEX_CCC } from '../../../constant/StyledCommonCss';
import { useEffect, useState } from 'react';

const EmojiRecent = () => {
  const [list, setList] = useState([]);

  return (
    <GridWrapper>
      <Grid>
        {list?.map((x) => (
          <EmojiContainer key={x?.id}>{x?.src}</EmojiContainer>
        ))}
      </Grid>
    </GridWrapper>
  );
};
const GridWrapper = styled.div`
  height: 8rem;
  overflow: scroll;
  width: 20rem;
  padding: 0.25rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-column-gap: 0.5rem;
  grid-row-gap: 0.5rem;
`;

const EmojiContainer = styled.div`
  width: 2rem;
  height: 2rem;
  ${FLEX_CCC};
`;
export default EmojiRecent;
