import styled from 'styled-components';
import { FLEX_RSS } from 'constant/StyledCommonCss';
import { useEmojiContext } from '../EmojiContext';
import EmojiCategoryItem from './EmojiCategoryItem';
import { getEmojiType } from './emojis';
import EmojiRecent from './EmojiRecent';

const EmojiCategoryList = () => {
  const { selectedCategoryIndex } = useEmojiContext();
  return (
    <Container shift={selectedCategoryIndex}>
      <EmojiRecent />
      {getEmojiType()?.map((x) => (
        <EmojiCategoryItem key={x?.key} type={x} />
      ))}
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
