import styled from 'styled-components';
import { FLEX_CCC } from '../../../constant/StyledCommonCss';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Emoji } from './EmojiPickerStyles';
import { getUUID } from 'helpers/helpers';
import { useEmojiContext } from '../EmojiContext';

const EmojiRecent = () => {
  const { recentEmojis, setRecentEmojis, handleEmojiSelect } =
    useEmojiContext();
  const handleEmojiClick = useCallback(
    (emoji) => {
      const filteredList = recentEmojis.filter((x) => x.title !== emoji.title);
      filteredList.unshift(emoji);
      if (setRecentEmojis) {
        setRecentEmojis(filteredList);
      }
      handleEmojiSelect && handleEmojiSelect(emoji);
    },
    [recentEmojis, setRecentEmojis]
  );

  const list = useMemo(() => {
    return recentEmojis?.map((x) => (
      <EmojiContainer key={x?.id} onClick={() => handleEmojiClick(x)}>
        <Emoji
          src={`/images/twemoji.svg#${x.title.match(/(?<=_).*(?=\.)/)}`}
          width="16px"
          height="16px"
        />
      </EmojiContainer>
    ));
  }, [recentEmojis]);

  // useEffect(() => {
  //   (async () => {
  //     const array = [];

  //     for (const item of recentEmojis) {
  //       // const { default: src } = await import(`assets/images/emojis/${item.match}`);
  //       array.push({
  //         id: getUUID(),
  //         title: item,
  //         src: (
  //           <Emoji
  //             src={`/images/twemoji.svg#${item.match(/(?<=_).*(?=\.)/)}`}
  //             width="16px"
  //             height="16px"
  //           />
  //         ),
  //       });
  //     }
  //     setRecentEmojis(array);
  //   })();
  // }, []);
  useEffect(() => {
    console.log(list);
  }, [list]);
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
