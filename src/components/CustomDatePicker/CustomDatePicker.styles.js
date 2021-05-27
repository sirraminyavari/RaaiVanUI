import styled from 'styled-components';

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

  .today-date {
    border: 0.15rem solid #e27312 !important;
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
