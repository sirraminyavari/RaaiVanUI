/**
 * styled-components related to @link AnimatedDropDownList.
 */
import ArrowDown from 'components/Icons/ArrowDown';
import styled, { css, keyframes } from 'styled-components';

const { RV_Float } = window;

// opacity goes from 1 to 0 when component is disappearing
const disappear = keyframes`
  from {
    opacity: 1;
  }

  to {
   opacity:0;
  }
`;
// opacity goes from 0 to 1 when component is appearing
const appear = keyframes`
  from {
    opacity: 0;
  }

  to {
   opacity:1;

  }
`;

/**
 * Shakes the children components in Horizontal axis by changing the distance to right
 */
const right = keyframes`

  0%   {right: -1%}
  25%  {right: 1%}
  50%  {right: -1%}
  75%  {right: 1%}
  100% {right: -1%}
`;
export const Container = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
`;
export const DomainsList = styled.div`
  max-height: ${({ dropedDown }) => (dropedDown ? 'auto' : 'auto')};
  transition: max-height 0.5s, display 0.5s;
  flex-direction: column;
  position: absolute;
  top: 4rem;
  width: 100%;
  display: flex;
  z-index: 1;
  border: ${({ dropedDown }) => (dropedDown ? '0.5px' : '0px')} solid #bac9dc;
  border-bottom-left-radius: 0.3rem;
  border-bottom-right-radius: 0.3rem;
  border-top-width: 0px;
  background-color: white;
`;

export const ListItem = styled.div`
  padding: 0.75rem;
  text-align: ${RV_Float};
  width: 100%;
  display: ${({ dropedDown }) => (dropedDown ? 'block' : `none`)};
  transition: display 0.5s, max-height 0.5s, opacity 0.5s;
  animation: ${({ dropedDown }) =>
    dropedDown
      ? css`
          ${appear} 1s
        `
      : css`
          ${disappear} 1s
        `};
`;
export const DropDownButton = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0.75rem;
  border: ${({ error }) => (error ? '0.5px solid red' : '0.5px solid #bac9dc')};
  background: #ffffff 0% 0% no-repeat padding-box;
  border-radius: 0.3rem;
  margin-top: 1.5rem;
  width: 100%;
  align-items: center;
`;
export const Title = styled.div`
  color: #707070;
`;
export const ArrowIcon = styled(ArrowDown)``;
export const Rotater = styled.div`
  transform: ${({ dropedDown }) =>
    dropedDown ? 'rotate(180deg)' : `rotate(0deg)`};
  transition: transform 0.5s;
  align-items: center;
  justify-content: center;
  display: flex;
`;
export const Error = styled.span`
  color: red;
  font-size: 0.75rem;
  margin-left: 13px;
  position: relative;
  text-align: ${RV_Float};
  margin-top: 3px;
  opacity: ${({ error }) => (error ? 1 : 0)};
  max-height: ${({ error }) => (error ? '5rem' : 0)};
  min-height: ${({ error }) => (error ? '0rem' : '0rem')};
  transition: max-height 1s, opacity 1s, min-height 1s;
`;
export const ShakeAnimate = styled.div`
  position: relative;

  animation: ${({ isVisible }) =>
    isVisible &&
    css`
      ${right} 0.2s
    `};
  width: 100%;
  display: flex;
  flex-direction: row;
`;
