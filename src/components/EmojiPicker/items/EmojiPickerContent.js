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
import { lazy, Suspense, useMemo } from 'react';

export const EmojiPickerContent = () => {
  const ButtonIconSize = 16;
  const { handleCategorySelect, selectedCategoryIndex } = useEmojiContext();
  const buttons = [
    {
      id: 0,
      icon: <IoMdTime size={ButtonIconSize} />,
    },
    {
      id: 1,
      icon: <BsEmojiSmile size={ButtonIconSize} />,
    },
    {
      id: 2,
      icon: <SiFoodpanda size={ButtonIconSize} />,
    },
    {
      id: 3,
      icon: <IoFastFoodOutline size={ButtonIconSize} />,
    },
    {
      id: 4,
      icon: <IoFootballOutline size={ButtonIconSize} />,
    },
    {
      id: 5,
      icon: <MdOutlineEmojiTransportation size={ButtonIconSize} />,
    },
    {
      id: 6,
      icon: <BsLightbulb size={ButtonIconSize} />,
    },
    {
      id: 7,
      icon: <MdOutlineEmojiSymbols size={ButtonIconSize} />,
    },
    {
      id: 8,
      icon: <FaRegFlag size={ButtonIconSize} />,
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

  const EmojiCategoryList = useMemo(
    () => lazy(() => import('./EmojiCategoryList')),
    []
  );
  return (
    <>
      <CategoryListContainer>{buttons}</CategoryListContainer>
      <Suspense fallback={<div></div>}>
        <EmojiCategoryList />
      </Suspense>
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
