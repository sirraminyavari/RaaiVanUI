import { TCV_DEFAULT } from 'constant/CssVariables';
import styled from 'styled-components';

export const DateCellContainer = styled.div`
  .table-date-input {
    cursor: pointer;
    border-color: transparent;

    :hover {
      border-color: ${TCV_DEFAULT};
    }
  }
`;
