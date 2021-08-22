import * as Styled from './PieChart.styles';

const PieChart = ({ size, percentage, color }) => {
  return (
    <Styled.PieChartContainer
      size={size}
      percentage={percentage}
      color={color}
    />
  );
};

export default PieChart;
