/**
 * styled-components related to @link AnimatedDropDownList.
 */
import ArrowDown from 'components/Icons/ArrowDown';
import { CV_WHITE, TCV_VERY_SOFT } from 'constant/CssVariables';
import styled, { css, keyframes } from 'styled-components';

const { RV_Float, RV_RTL } = window;

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
// const right = keyframes`

//   0%   {right: -1%}
//   25%  {right: 1%}
//   50%  {right: -1%}
//   75%  {right: 1%}
//   100% {right: -1%}
// `;
export const Container = styled.div`
  position: relative;
  /* width: 100%; */
  display: flex;
  flex-direction: row;
  min-width: 5rem;
  /* box-shadow: 1px 3px 20px #ababab; */
  background-color: rgba(255, 255, 255, 0);
  border-radius: 100rem;
`;
export const ItemList = styled.div`
  max-height: auto;
  transition: max-height 0.5s, display 0.5s, opacity 0.5s;
  flex-direction: column;
  position: absolute;
  top: 3rem;
  opacity: ${({ $dropedDown }) => ($dropedDown ? '1' : '0')};
  width: 100%;
  display: flex;
  z-index: ${({ $dropedDown }) => ($dropedDown ? 1 : -1)};
  border: ${({ $dropedDown }) => ($dropedDown ? '0.5px' : '0px')} solid #bac9dc;
  border-radius: 0.3rem;
  border-bottom-right-radius: 0.3rem;
  border-top-width: 0px;
  background-color: ${CV_WHITE};
  align-items: ${() => (RV_Float ? 'flex-start' : 'flex-end')};

  box-shadow: 0 4px 7px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
`;

export const ListItem = styled.div`
  padding: 0.75rem;
  text-align: ${RV_Float};
  width: 100%;
  display: ${({ $dropedDown }) => ($dropedDown ? 'block' : `none`)};
  transition: display 0.5s, max-height 0.5s, opacity 0.5s;
  animation: ${({ $dropedDown }) =>
    $dropedDown
      ? css`
          ${appear} 1s
        `
      : css`
          ${disappear} 1s
        `};
`;
export const DropDownButton = styled.div`
  display: flex;
  ${RV_RTL ? 'flex-direction:row-reverse' : 'flex-direction:row-reverse'};
  justify-content: space-between;
  background: #f3f7fd 0% 0% no-repeat padding-box;
  /* border-radius: 0.5rem; */

  width: 100%;
  align-items: center;
`;
export const Divider = styled.div`
  width: 2px;
  height: 100%;
`;
export const Title = styled.div`
  color: #707070;
`;
export const ArrowIcon = styled(ArrowDown)`
  transform: ${({ $dropedDown }) =>
    $dropedDown ? 'rotate(180deg)' : `rotate(0deg)`};
  transition: transform 0.5s;
`;
export const Rotater = styled.div`
  align-items: center;
  justify-content: center;
  display: flex;
  height: 100%;
  padding: 0.75rem;
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
// export const ShakeAnimate = styled.div`
//   position: relative;

//   animation: ${({ isVisible }) =>
//     isVisible &&
//     css`
//       ${right} 0.2s
//     `};
//   width: 100%;
//   display: flex;
//   flex-direction: row;
// `;
export const Maintainer = styled.button`
  display: flex;
  flex-direction: ${() => (RV_RTL ? 'row' : 'row-reverse')};
  padding: 0.5rem;
  align-items: center;
  min-height: 2.5rem;
  justify-content: space-between;
  width: 100%;
  :hover {
    background-color: ${({ $dropedDown }) => $dropedDown && TCV_VERY_SOFT};
  }
`;
export const Label = styled.div`
  color: ${({ color }) => color};
  width: 100%;
  padding: ${() => (RV_RTL ? '0 0.7rem 0 0.7rem' : '0 0.7rem 0 0.7rem')};
  text-align: ${RV_RTL ? 'right' : 'left'};
`;
