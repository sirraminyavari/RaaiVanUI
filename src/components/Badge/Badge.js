/**
 * A Badge component
 */
import PropTypes from 'prop-types';
import * as Styled from './Badge.styles';

/**
 * @typedef PropType
 * @type {Object}
 * @property {string} value - The value of the badge.
 * @property {string} color - The background color of the badge.
 * @property {boolean} withBorder - The border indicator.
 */

/**
 *  @description Renders a badge component.
 * @component
 * @param {PropType} props -Props that pass to badge.
 */
const Badge = (props) => {
  const { value, color, ...rest } = props;
  return (
    <Styled.BadgeWrapper color={color} {...rest}>
      {value}
    </Styled.BadgeWrapper>
  );
};

Badge.propTypes = {
  value: PropTypes.string,
  color: PropTypes.string,
  withBorder: PropTypes.bool,
};

export default Badge;
