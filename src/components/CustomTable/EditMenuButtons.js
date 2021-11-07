import * as Styled from 'components/CustomTable/CustomTable.styles';
import CheckIcon from 'components/Icons/CheckIcons/Check';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';
import { CV_RED, TCV_WARM } from 'constant/CssVariables';

/**
 * @typedef PropType
 * @type {Object}
 * @property {Function} onAccept - A callback function that fires on accept icon click.
 * @property {Function} onCancel - A callback function that fires on cancel icon click.
 * @property {String} containerClass - The classes for container.
 * @property {Number} iconSize - The size of the icons.
 */

/**
 *  @description Renders an edit menu component.
 * @component
 * @param {PropType} props -Props that pass to edit menu.
 */
const EditMenuButtons = (props) => {
  const { onAccept, onCancel, containerClass, iconSize, ...rest } = props;

  return (
    <Styled.EditActionContainer className={containerClass} {...rest}>
      <div>
        <CheckIcon
          className="table-edit-check-icon"
          size={iconSize}
          color={TCV_WARM}
          onClick={onAccept}
        />
        <CloseIcon
          className="table-edit-cancel-icon"
          size={iconSize}
          color={CV_RED}
          onClick={onCancel}
        />
      </div>
    </Styled.EditActionContainer>
  );
};

EditMenuButtons.defaultProps = {
  iconSize: 30,
};

export default EditMenuButtons;
