import styled, { css } from 'styled-components';

const FlexBetween = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const InputContainer = styled.div`
  position: relative;
  margin: 0 15px;
  border-bottom: ${({ hasChildren }) => (hasChildren ? '0px' : '1px')} solid
    #fff;
`;

export const ComponentWrapper = styled.div.attrs((props) => ({
  ref: props.componentRef,
}))`
  ${FlexBetween}
  position: relative;
`;

export const LoaderWrapper = styled.div`
  position: absolute;
  left: 27px;
`;

export const InputElementWrapper = styled.div.attrs((props) => ({
  ref: props.inputwrapperRef,
}))`
  ${FlexBetween}
  width: 250px;
`;

export const Input = styled.input`
  border: none;
  outline: none;
  flex-grow: 1;
  background-color: inherit;
  color: #fff;
  padding: 5px;
  width: 90%;
`;

export const List = styled.ul.attrs((props) => ({ ref: props.ulRef }))`
  min-height: ${({ items }) => (items.length === 0 ? '0' : '50px')};
  height: ${({ items }) =>
    items.length === 0 ? '0' : `${items.length * 35}px`};
  padding: ${({ items }) => (items.length === 0 ? '0' : '10px')};
  position: absolute;
  width: 100%;
  margin: 5px 0px;
  border-radius: 5px;
  overflow: hidden;
  z-index: 1000;
  background-color: #fff;
  box-shadow: 0px 1px 15px #333;
  transition: all 0.6s ease;
`;

export const ListItems = styled.li`
  cursor: ${({ hasError }) => (hasError ? 'revert' : 'pointer')};
  background-color: ${({ hasError, highlightedIndex, index }) =>
    hasError ? '#fff' : highlightedIndex === index ? 'lightgray' : '#fff'};
  padding: 5px 10px;
  border-radius: 5px;
  list-style: none;
  display: flex;
  justify-content: end;
  align-items: center;
`;

export const Error = styled.div`
  border-radius: 50%;
  border: 2px solid red;
  width: 25px;
  height: 25px;
  text-align: center;
  color: red;
  font-size: 1.2rem;
  margin: 0 5px;
`;
