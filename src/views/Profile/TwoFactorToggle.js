/**
 * Renders a toggle button for two factor authentication.
 */
import { useContext } from 'react';
import * as Styled from './Profile.styles';
import ToggleButton from 'components/Buttons/Toggle/Toggle';
import { WindowContext } from 'context/WindowProvider';

/**
 * @typedef PropType
 * @type {Object}
 * @property {function} onToggle - The callback function that fires on toggle.
 * @property {boolean} isChecked - The initial toggle value.
 */

/**
 *  @description Renders an 'TwoFactorToggle'  component.
 * @component
 * @param {PropType} props -Props that pass to Toggle.
 */
const TwoFactorToggle = (props) => {
  const { onToggle, isChecked } = props;
  const { RVDic } = useContext(WindowContext);

  return (
    <Styled.TwoFactorToggleContainer>
      <Styled.TwoFactorToggleTitle>
        استفاده از ورود دو مرحله ای
      </Styled.TwoFactorToggleTitle>
      <ToggleButton onToggle={onToggle} initialCheck={!!isChecked} />
    </Styled.TwoFactorToggleContainer>
  );
};

export default TwoFactorToggle;
