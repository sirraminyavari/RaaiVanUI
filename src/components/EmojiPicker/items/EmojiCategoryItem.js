import styled from 'styled-components';
import { FLEX_CCC } from '../../../constant/StyledCommonCss';
import { useEffect, useState } from 'react';
import { getEmojis } from './emojis';
import LoadingIconFlat from '../../Icons/LoadingIcons/LoadingIconFlat';
import useLocalStorage from 'hooks/useLocalStorage';
import { getUUID } from 'helpers/helpers';
import { useEmojiContext } from '../EmojiContext';

const EmojiCategoryItem = ({ type }) => {
  const [storedValue, setValue] = useLocalStorage('RESENT_USED_EMOJIS', []);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const { handleEmojiSelect } = useEmojiContext();
  useEffect(() => {
    const loadActivities = async () => {
      const el = await getEmojis(type);
      setList(el);
      setLoading(false);
    };
    loadActivities();
  }, []);

  const handleEmojiClick = (emoji) => {
    const filteredList = storedValue.filter((x) => x !== emoji);
    filteredList.unshift(emoji);
    if (setValue) {
      setValue(filteredList);
    }
    handleEmojiSelect && handleEmojiSelect(emoji);
  };

  return (
    <GridWrapper>
      {!loading ? (
        <Grid>
          {list.map((x) => (
            <EmojiContainer
              onClick={() => handleEmojiClick(x?.title)}
              key={x?.id}
            >
              {x?.src}
            </EmojiContainer>
          ))}
        </Grid>
      ) : (
        <LoadingWrapper>
          <LoadingIconFlat />
        </LoadingWrapper>
      )}
    </GridWrapper>
  );
};

const GridWrapper = styled.div`
  height: 9rem;
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
const LoadingWrapper = styled.div`
  height: 100%;
  width: 100%;
  ${FLEX_CCC};
`;
export default EmojiCategoryItem;
