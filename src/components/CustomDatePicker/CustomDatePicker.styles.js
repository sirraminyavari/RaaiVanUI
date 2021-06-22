import { BG_GRAY_LIGHT, BG_WHITE, C_RED, TC_VERYWARM } from 'constant/Colors';
import {
  BO_RADIUS_CIRCLE,
  BO_RADIUS_HALF,
  IGNORE_RADIUS_BOTTOM,
} from 'constant/constants';
import styled, { css } from 'styled-components';

export const CalendarConatiner = styled.div`
  position: relative;
  // display: flex;
  // flex-direction: column;
  // align-items: center;

  .date-picker {
    position: relative;
    display: inline-block;
    width: 100%;
    z-index: 100;
  }

  .Calendar__header {
    padding-top: 2.5rem;
  }

  .today-date {
    color: #fff !important;
  }

  .today-date::after {
    visibility: hidden; /* hide small border under the text */
  }

  .start {
    background-color: #2b7be4 !important;
  }
  .end {
    background-color: #2b7be4 !important;
  }
  .between {
    background-color: #2b7be433 !important;
    color: #000 !important;
  }

  .small-calendar {
    font-size: 0.45rem !important;
    position: absolute !important;
    left: 50% !important;
    margin-left: -7.5rem !important;
  }

  .medium-calendar {
    font-size: 0.55rem !important;
    position: absolute !important;
    left: 50% !important;
    margin-left: -9rem !important;
  }

  .large-calendar {
    font-size: 0.65rem !important;
    position: absolute !important;
    left: 50% !important;
    margin-left: -10.5rem !important;
  }
`;

const getTopCss = ({ size }) => {
  switch (size) {
    case 'medium':
      return css`
        top: -21.2rem;
      `;
    case 'large':
      return css`
        top: -24.6rem;
      `;
    default:
      return css`
        top: -17.7rem;
      `;
  }
};

export const CalendarHeaderContainer = styled.div.attrs({
  className: `${BG_GRAY_LIGHT} ${BO_RADIUS_HALF} ${IGNORE_RADIUS_BOTTOM}`,
})`
  width: 100%;
  height: 4.5em;
  padding: 0 2.5em !important;
  position: absolute;
  ${getTopCss}
`;

export const RefreshIconWrapper = styled.div.attrs({
  className: `${C_RED} ${BO_RADIUS_CIRCLE} ${BG_WHITE}`,
})`
  transform: scaleX(-1);
  position: absolute;
  left: 0;
  padding: 0.4rem !important;
  cursor: pointer;
`;

export const HeaderWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const CalendarTitle = styled.span.attrs({
  className: `${TC_VERYWARM}`,
})`
  font-size: 2em;
  text-transform: capitalize;
`;

export const FooterButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-tems: center;
  padding: 0.7rem !important;
`;
