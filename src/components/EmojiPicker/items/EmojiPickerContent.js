import EmojiCategoryList from './EmojiCategoryList';
import { useEmojiContext } from '../EmojiContext';
import styled from 'styled-components';
import { FLEX_CCC, FLEX_RCS } from 'constant/StyledCommonCss';

import {
  BsEmojiSmile,
  BsLightbulb,
  FaRegFlag,
  IoFastFoodOutline,
  IoFootballOutline,
  IoMdTime,
  MdOutlineEmojiSymbols,
  MdOutlineEmojiTransportation,
  SiFoodpanda,
} from 'react-icons/all';
import { CV_DISTANT, TCV_DEFAULT } from 'constant/CssVariables';

export const EmojiPickerContent = () => {
  const { handleCategorySelect, selectedCategoryIndex } = useEmojiContext();
  const buttons = [
    {
      id: 0,
      icon: <IoMdTime size={16} />,
    },
    {
      id: 1,
      icon: <BsEmojiSmile size={16} />,
    },
    {
      id: 2,
      icon: <SiFoodpanda size={16} />,
    },
    {
      id: 3,
      icon: <IoFastFoodOutline size={16} />,
    },
    {
      id: 4,
      icon: <IoFootballOutline size={16} />,
    },
    {
      id: 5,
      icon: <MdOutlineEmojiTransportation size={16} />,
    },
    {
      id: 6,
      icon: <BsLightbulb size={16} />,
    },
    {
      id: 7,
      icon: <MdOutlineEmojiSymbols size={16} />,
    },
    {
      id: 8,
      icon: <FaRegFlag size={16} />,
    },
  ].map((x) => (
    <Button
      key={x?.id}
      onClick={() => handleCategorySelect(x?.id)}
      selected={x?.id === selectedCategoryIndex}
    >
      {x?.icon}
    </Button>
  ));
  return (
    <>
      <CategoryListContainer>{buttons}</CategoryListContainer>
      <EmojiCategoryList />
    </>
  );
};
const CategoryListContainer = styled.div`
  ${FLEX_RCS};
  height: 3rem;
  width: 100%;
`;
const Button = styled.button`
  ${FLEX_CCC};
  border-radius: 100%;
  height: 2rem;
  width: 2rem;
  border: none;
  outline: none;
  background-color: ${({ selected }) => (selected ? '#eef1f5' : 'transparent')};
  color: ${({ selected }) => (selected ? TCV_DEFAULT : CV_DISTANT)};
`;
export default EmojiPickerContent;
