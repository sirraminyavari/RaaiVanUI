import styled from 'styled-components';
import { FLEX_RSS } from 'constant/StyledCommonCss';
import { useEmojiContext } from '../EmojiContext';
import EmojiCategoryItem from './EmojiCategoryItem';
import { getEmojiType } from './emojis';
import EmojiRecent from './EmojiRecent';
import { useMemo } from 'react';

const EmojiCategoryList = () => {
  const { selectedCategoryIndex } = useEmojiContext();
  const list = useMemo(
    () =>
      getEmojiType()?.map((x) => <EmojiCategoryItem key={x?.key} type={x} />),
    []
  );
  return (
    <Container shift={selectedCategoryIndex}>
      <EmojiRecent />
      {list}
    </Container>
  );
};
const Container = styled.div`
  height: 11rem;
  ${FLEX_RSS};
  transform: translateX(${({ shift }) => shift * 20}rem);
  transition: all 0.2s ease-out;
`;
export default EmojiCategoryList;
