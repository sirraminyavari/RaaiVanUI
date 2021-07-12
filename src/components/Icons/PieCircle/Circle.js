import PropTypes from 'prop-types';
import { TCV_DEFAULT } from 'constant/CssVariables';

const PieCirlceIcon = (props) => {
  const { percentage, color } = props;
  return (
    <svg height="20" width="20" viewBox="0 0 20 20">
      <circle r="10" cx="10" cy="10" fill={color} />
      <circle r="8.5" cx="10" cy="10" fill="white" />
      <circle
        r="5"
        cx="10"
        cy="10"
        fill="transparent"
        stroke={color}
        stroke-width="10"
        stroke-dasharray={`calc(${percentage} * 31.4 / 100) 31.4`}
        transform="rotate(-90) translate(-20)"
      />
    </svg>
  );
};

PieCirlceIcon.propTypes = {
  percentage: PropTypes.number,
  color: PropTypes.string,
};

PieCirlceIcon.defaultProps = {
  percentage: 50,
  color: TCV_DEFAULT,
};

export default PieCirlceIcon;
