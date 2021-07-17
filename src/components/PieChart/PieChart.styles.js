import styled from 'styled-components';
import { BO_RADIUS_CIRCLE } from 'constant/constants';
import { CV_WHITE } from 'constant/CssVariables';

export const PieChartContainer = styled.div.attrs({
  className: `${BO_RADIUS_CIRCLE}`,
})`
  min-width: ${({ size }) => size}rem;
  min-height: ${({ size }) => size}rem;
  background: ${({ percentage, color }) =>
    `conic-gradient(${color} 0% ${percentage}%, ${CV_WHITE} ${percentage}% 100%)`};
  border: 0.15rem solid ${({ color }) => color};
`;
