/**
 * A Badge component
 */
import PropTypes from 'prop-types';
import * as Styled from './Badge.styles';

/**
 * @typedef PropType
 * @type {Object}
 * @property {number} value - The value of the badge.
 * @property {number} limit - The maximum number to show, If exceeds the limitation will show '+'.
 * @property {string} showText - The data that must show to user, Ignore value and limitation.
 */

/**
 *  @description Renders a badge component.
 * @component
 * @param {PropType} props -Props that pass to badge.
 */
const Badge = (props) => {
  const { value, limit, showText, ...rest } = props;
  const getBadgeValue = () => {
    if (value < limit) {
      return value;
    } else {
      return `+${limit - 1}`;
    }
  };

  return (
    <Styled.BadgeWrapper length={(value + '').length} {...rest}>
      {!!showText ? showText : getBadgeValue()}
    </Styled.BadgeWrapper>
  );
};

Badge.propTypes = {
  value: PropTypes.number,
  limit: PropTypes.number,
  showText: PropTypes.string,
};

Badge.defaultProps = {
  limit: 100,
  showText: '',
};

Badge.displayName = 'BadgeComponent';

export default Badge;
