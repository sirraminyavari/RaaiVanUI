/**
 * Renders a linear progress bar.
 */
import CheckIcon from 'components/Icons/CheckIcons/Check';
// import CancelIcon from 'components/Icons/CancelCircle';
import * as Styled from './ProgressBar.styles';
import PropTypes from 'prop-types';
// import { C_RED } from 'constant/Colors';

/**
 * @typedef PropType
 * @property {string} label - The label of progress bar.
 * @property {(number | string)} [progress] -The percentage of progress that has been completed.
 * @property {string} [barColor] -The color of progress bar.
 * @property {function} onCancelProgress -A callback function that fires on progress abortion.
 */

/**
 *  @description Renders a linear progress bar.
 * @component
 * @param {PropType} props
 */
const ProgressBar = (props) => {
  const {
    label,
    progress,
    barColor,
    // onCancelProgress
  } = props;
  return (
    <Styled.ProgressBarContainer>
      {label}
      <Styled.ProgressBarWrapper>
        {+progress === 100 && <CheckIcon size={20} />}
        {/* {![0, 100].includes(+progress) && (
          <CancelIcon
            className={C_RED}
            style={{ cursor: 'pointer' }}
            size={22}
            onClick={onCancelProgress}
          />
        )} */}
        <Styled.ProgressBar>
          <Styled.Bar
            progress={progress}
            color={barColor}>{` % ${progress}`}</Styled.Bar>
        </Styled.ProgressBar>
      </Styled.ProgressBarWrapper>
    </Styled.ProgressBarContainer>
  );
};

ProgressBar.propTypes = {
  label: PropTypes.string,
  progress: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onCancelProgress: PropTypes.func,
  barColor: PropTypes.string,
};

ProgressBar.defaultProps = {
  progress: 50,
  barColor: 'blue',
  label: 'label',
};

ProgressBar.displayName = 'ProgressBarComponent';

export default ProgressBar;
