import styled, { css } from 'styled-components';
const { GlobalUtilities } = window;

const FlexBetween = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const InputContainer = styled.div`
  position: relative;
`;

export const ComponentWrapper = styled.div.attrs((props) => ({
  ref: props.componentRef,
}))`
  ${FlexBetween}
  position: relative;
`;

export const LoaderWrapper = styled.div`
  position: absolute;
  left: 1.6rem;
`;

export const InputElementWrapper = styled.div.attrs((props) => ({
  ref: props.inputwrapperRef,
}))`
  ${FlexBetween}
  width: 15.5rem;
`;

export const Input = styled.input`
  border: 0 solid #fff;
  outline: none;
  flex-grow: 1;
  padding: 0.4rem;
  width: 90%;
`;

export const List = styled.ul.attrs((props) => ({ ref: props.ulRef }))`
  width: ${({ hasChildren }) => (hasChildren ? '85%' : '100%')};
  min-height: ${({ items, hasError }) =>
    items.length === 0
      ? '0'
      : hasError
      ? '3.5rem'
      : `${items.length * 2.2 + 4.7}rem`};
  height: ${({ items }) =>
    items.length === 0 ? '0' : `${items.length * 2.2}rem`};
  padding: ${({ items }) => (items.length === 0 ? '0' : '0 0.6rem')};
  position: absolute;
  left: ${({ hasChildren }) => (hasChildren ? '1.6rem' : '0')};
  overflow: hidden;
  z-index: ${GlobalUtilities.zindex.dialog()};
  transition: all 0.7s ease;
`;

export const ListItems = styled.li`
  cursor: ${({ hasError }) => (hasError ? 'revert' : 'pointer')};
  padding: 0.3rem 0.7rem;
  margin-left: 1.9rem;
  list-style: none;
  display: flex;
  justify-content: end;
  align-items: center;
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
  padding: 1rem 0;
  margin: 0 -1.25rem;
  position: -webkit-sticky; /* Safari */
  position: sticky;
  top: 0;
`;

export const ListItemsContainer = styled.div`
  position: absolute;
  left: -1.25rem;
  max-height: 16rem;
  width: 100%;
  margin-top: 0.7rem;
  margin-left: 0.3rem;
  overflow-y: auto;
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
