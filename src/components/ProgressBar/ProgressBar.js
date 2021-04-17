/**
 * Renders a linear progress bar.
 */
import ApprovalIcon from 'components/Icons/ApprovalIcon/ApprovalIcon';
import * as Styled from './ProgressBar.styles';
import PropTypes from 'prop-types';

/**
 * @typedef PropType
 * @property {string} label - The label of progress bar.
 * @property {number} [progress] -The percentage of progress that has been completed.
 * @property {string} [barColor] -The color of progress bar.
 */

/**
 *  @description Renders a linear progress bar.
 * @component
 * @param {PropType} props
 */
const ProgressBar = (props) => {
  const { label, progress, barColor } = props;
  return (
    <Styled.ProgressBarContainer>
      {label}
      <Styled.ProgressBarWrapper>
        {progress === 100 && <ApprovalIcon size={20} />}
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
  progress: PropTypes.number,
};

ProgressBar.defaultProps = {
  progress: 50,
  barColor: 'blue',
};

ProgressBar.displayName = 'ProgressBarComponent';

export default ProgressBar;
