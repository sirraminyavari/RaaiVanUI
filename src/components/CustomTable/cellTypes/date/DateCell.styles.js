import { BO_DISTANT } from 'constant/Colors';
import { BO_RADIUS_QUARTER } from 'constant/constants';
import { CV_GRAY } from 'constant/CssVariables';
import { FLEX_RCB } from 'constant/StyledCommonCss';
import styled from 'styled-components';

export const DateCellContainer = styled.div.attrs({
  className: `${BO_RADIUS_QUARTER} ${BO_DISTANT}`,
})`
  cursor: pointer;
  ${FLEX_RCB}
  gap: 0.5rem;
  padding: 0.5rem;

  .table-date-edit-title {
    color: ${CV_GRAY};
  }
`;

export const DateCellEmpty = styled.div`
  cursor: pointer;
  ${FLEX_RCB}
  gap: 0.5rem;
  padding: 0.5rem;

  .table-date-edit-title {
    color: ${CV_GRAY};
  }
`;
