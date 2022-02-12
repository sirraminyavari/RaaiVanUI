import {
  CV_DISTANT,
  CV_WHITE,
  TCV_DEFAULT,
  TCV_VERY_TRANSPARENT,
  TCV_VERY_TRANSPARENT_WARM,
} from 'constant/CssVariables';
import styled from 'styled-components';

export const TableContainer = styled.div`
  width: 100%;
  padding-top: 4rem;
  overflow-x: auto;
  scroll-behavior: smooth;
  scrollbar-width: thin;
  table {
    min-width: 100%;
    thead {
      tr {
        border-bottom: 1px solid ${CV_DISTANT};
      }
      th {
        padding-inline: 2rem;
        padding-block-end: 0.6rem;
        font-size: 0.8rem;
        white-space: nowrap;
        color: ${CV_DISTANT};
        :nth-last-of-type(2) {
          display: block;
          width: 23rem;
        }
      }
    }
    tbody {
      tr {
        border-bottom: 1px solid ${CV_DISTANT};
        :last-of-type {
          border-bottom-color: transparent;
        }
      }
      td {
        padding-block: 1rem;
        padding-inline: 2rem;
        :first-of-type {
          font-weight: bold;
          padding-inline-start: 1rem;
        }
        > div {
          display: flex;
          flex-wrap: nowrap;
          white-space: nowrap;
          justify-content: start;
          align-items: center;
          > * {
            flex-shrink: 0;
          }
        }
      }
    }
  }
  .userAvatar {
    margin-inline-end: 0.5rem;
  }
  .teamAvatar {
    width: 3rem;
    height: 3rem;
  }
  .extraTeamsIndicator {
    width: 3rem;
    height: 3rem;
    background-color: ${TCV_VERY_TRANSPARENT};
    font-size: 0.9rem;
    color: ${TCV_DEFAULT};
  }
  .extraTeamsPanel {
    overflow-y: auto;
    height: 8rem;
    width: 12rem;
    margin-inline-end: -15rem;
    margin-block-end: -4rem;
    background: ${CV_WHITE} 0% 0% no-repeat padding-box;
    box-shadow: 1px 3px 20px ${TCV_VERY_TRANSPARENT_WARM};
    border-radius: 0.6rem;
  }
`;
