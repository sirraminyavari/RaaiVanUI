import styled, { css } from 'styled-components';
const { GlobalUtilities } = window;
const ITEM_HEIGHT = 2.1;

const FlexBetween = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const AutoSuggestContainer = styled.div`
  position: relative;
  &:focus-within ul {
    display: revert;
  }
`;

export const ComponentWrapper = styled.div.attrs((props) => ({
  ref: props.componentRef,
}))`
  ${FlexBetween}
  position: relative;
`;

export const LoaderWrapper = styled.div`
  margin: 20px 0;
`;

export const InputElementWrapper = styled.div.attrs((props) => ({
  ref: props.inputwrapperRef,
}))`
  ${FlexBetween}
  width: 100%;

  input {
    width: 100%;
  }

  .show-results {
    border-color: #dfe9f5;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom-color: #fff;
    box-shadow: 1px 3px 5px #2b7be44d;
  }
`;

const getMenuHeigth = ({ items, hasButton }) => {
  if (items.length === 0) {
    return `height: ${hasButton ? '4.3rem' : '0'};`;
  } else {
    return `height: ${items.length * ITEM_HEIGHT + (hasButton ? 6.5 : 2)}rem;`;
  }
};

export const SuggestMenu = styled.ul.attrs((props) => ({ ref: props.ulRef }))`
  width: 100%;
  ${getMenuHeigth}
  max-height: ${({ hasButton }) => (hasButton ? '19.5rem' : '15rem')};
  padding: ${({ items }) => (items.length === 0 ? '0' : '0 0.6rem')};
  position: absolute;
  top: 1.2rem;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-width: 1px;
  border-style: solid;
  border-color: #dfe9f5;
  border-top-color: #fff;
  ${({ items }) => !items.length && 'border: none;'}
  ${({ items }) => items.length && 'box-shadow: 1px 3px 5px #2b7be44d;'}
  display: none;
  text-align: center;
  overflow: hidden;
  z-index: ${GlobalUtilities.zindex.dialog()};
  transition: all 0.7s ease;
  }
`;

const getScrollDisplay = ({ items }) => {
  return items.length * ITEM_HEIGHT < 13 ? 'display: none;' : null;
};

export const ListItemsContainer = styled.div`
  position: absolute;
  max-height: 13.5rem;
  width: 95%;
  margin-top: 0.7rem;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    background: #fff;
    width: 5px;
    ${getScrollDisplay}
  }
  // &:hover {
  //   &::-webkit-scrollbar-thumb{
  //     background: red;
  //   }
  // }
  // transition: all 0.7s ease;
`;

export const ListItems = styled.li`
  width: 95%;
  cursor: ${({ hasError }) => (hasError ? 'revert' : 'pointer')};
  padding: 0.3rem 0.7rem;
  margin: 0.3rem 0 0.3rem 0.5rem;
  list-style: none;
  display: flex;
  justify-content: start;
  align-items: center;
  color: #707070;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Error = styled.div`
  border: 0.15rem solid red;
  width: 1.7rem;
  height: 1.7rem;
  text-align: center;
  color: red;
  font-size: 1.2rem;
  margin: 0 0.3rem;
`;

export const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 1rem 0.5rem;
  margin: 0 -1.25rem;
  position: -webkit-sticky; /* Safari */
  position: sticky;
  top: 0;
`;

const getHighlightCss = ({ isMatch }) => {
  return isMatch
    ? `
    font-weight: bold;
    background-color: yellow;
    padding: 0 0.2rem;
    border-radius: 0.5rem;
    `
    : null;
};

export const HighlightedText = styled.span`
  ${getHighlightCss}
`;
