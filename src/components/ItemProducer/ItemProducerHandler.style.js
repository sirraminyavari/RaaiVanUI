/**
 * styles of 'ItemProducerHandler' can be found here
 */
import styled, { keyframes } from 'styled-components';

const appear = keyframes`
  from {
    opacity: 0;
    }
  to {
   opacity:1;
   }
`;
const disappear = keyframes`
   from {
    opacity: 0;
    height:2rem;
    padding: 5px;
  }

  to {
   opacity:0;
   height:0rem;
   padding: 0px;
  } 
`;
const reset = keyframes`
   from {
    opacity: 1;
    height:2rem;
    padding: 5px;
  }

  to {
   opacity:0;
   height:1rem;
   padding: 0px;

  } 
`;

export const Maintainer = styled.div`
  background-color: ${({ isDragging }) => (isDragging ? '#D5D5FF' : '#F4F4F4')};
  margin-top: 0.3rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  opacity: 1;
  padding: 5px;
  width: 100%;
  transition: opacity 1s;

  &.removeMe {
    animation: ${disappear};
    animation-duration: 0.5s;
  }
  &.addMe {
    animation: ${appear};
    animation-duration: 0.8s;
  }
  &.resetMe {
    animation: ${reset};
    animation-duration: 0.6s;
  }
`;
export const Container = styled.div`
  display: flex;
  border-radius: 7px;
  border: 1px solid grey;
  align-items: center;
  margin: 3px;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
`;
export const Parent = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
`;
export const AutoSuggest = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  padding: 7px 7px 7px 7px;
`;
export const View = styled.div`
  align-self: center;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  width: 100%;
`;
