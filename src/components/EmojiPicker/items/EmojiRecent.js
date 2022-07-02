import styled from 'styled-components';
import { FLEX_CCC } from '../../../constant/StyledCommonCss';
import { useEffect, useMemo, useState } from 'react';
import useLocalStorge from 'hooks/useLocalStorage';
import { Emoji } from './EmojiPickerStyles';
import { getUUID } from 'helpers/helpers';

const EmojiRecent = () => {
  const [storedValue, setValue] = useLocalStorge('RESENT_USED_EMOJIS', []);
  const [recentEmojis, setRecentEmojis] = useState([]);

  const handleEmojiClick = (emoji) => {
    const filteredList = storedValue.filter((x) => x !== emoji);
    filteredList.unshift(emoji);
    if (setValue) {
      setValue(filteredList);
    }
  };

  const list = useMemo(() => {
    return recentEmojis?.map((x) => (
      <EmojiContainer key={x?.id} onClick={() => handleEmojiClick(x?.title)}>
        {x?.src}
      </EmojiContainer>
    ));
  }, [recentEmojis]);

  useEffect(() => {
    (async () => {
      const array = [];

      for (const item of storedValue) {
        const { default: src } = await import(`assets/images/emojis/${item}`);
        array.push({
          id: getUUID(),
          title: item,
          src: <Emoji src={src} width="16px" height="16px" />,
        });
      }
      setRecentEmojis(array);
    })();
  }, [storedValue]);

  return (
    <GridWrapper>
      <Grid>{list}</Grid>
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
