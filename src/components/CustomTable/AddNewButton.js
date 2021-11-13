import { cloneElement } from 'react';
import * as Styled from './CustomTable.styles';
import Button from 'components/Buttons/Button';
import { TCV_DEFAULT } from 'constant/CssVariables';

/**
 * @typedef PropType
 * @type {Object}
 * @property {Number} icon - The button icon.
 * @property {String} title - The button title.
 * @property {Function} onClick - A callback function that fires when button is clicked.
 */

/**
 *  @description Renders an add new button component.
 * @component
 * @param {PropType} props
 */
const AddNewToCellButton = (props) => {
  const { onClick, icon, title, ...rest } = props;

  return (
    <Styled.AddNewButtonWrapper {...rest}>
      <Button classes="table-add-new-in-cell-button" onClick={onClick}>
        {cloneElement(icon, {
          size: icon?.props?.size || 18,
          color: TCV_DEFAULT,
        })}
        <Styled.AddNewHeading type="h4">{title}</Styled.AddNewHeading>
      </Button>
    </Styled.AddNewButtonWrapper>
  );
};

export default AddNewToCellButton;
