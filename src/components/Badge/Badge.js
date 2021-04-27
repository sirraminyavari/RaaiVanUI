/**
 * A Badge component
 */
import PropTypes from 'prop-types';
import * as Styled from './Badge.styles';

/**
 * @typedef PropType
 * @type {Object}
 * @property {nubmer} value - The value of the badge.
 * @property {boolean} withBorder - The border indicator.
 */

/**
 *  @description Renders a badge component.
 * @component
 * @param {PropType} props -Props that pass to badge.
 */
const Badge = (props) => {
  const { value, color, ...rest } = props;
  const srtValue = value + '';
  const valLength = srtValue.length;
  return (
    <Styled.BadgeWrapper length={valLength} {...rest}>
      {valLength < 3 ? srtValue : '+99'}
    </Styled.BadgeWrapper>
  );
};

Badge.propTypes = {
  value: PropTypes.number,
  withBorder: PropTypes.bool,
};

export default Badge;
