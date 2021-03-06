/**
 * A @link LoadingButton, with Text UI
 */
 import LoadingIconFlat from '../Icons/LoadingIcons/LoadingIconFlat';
import { MAIN_BLUE, MAIN_BLUE_HOVER } from 'const/Colors';
import React from 'react';
import styled from 'styled-components';

/**
 * Renders Button with Text UI and loading state.
 * @param {Boolean} isFetching - True in loading state, False in normal state.
 * @param {Boolean} disabled - If True, button is disabled.
 * @param {ReactNode|ReactNodeArray} children - The computed children for this slot.
 * @param {object} props - Other params that don't include above.
 * @callback onClick - Fires when user clicks the button.
 */
const TextButton = ({
  isFetching = false,
  disable = false,
  onClick,
  children,
  ...props
}) => {
  return (
    <>
      {isFetching ? (
        <>
          <span style={{ color: 'transparent' }}>1</span>
          <LoadingIconFlat />
          <span style={{ color: 'transparent' }}>1</span>
        </>
      ) : (
        <Button onClick={onClick} {...props}>
          {children}
        </Button>
      )}
    </>
  );
};

export default TextButton;

const Button = styled.button`
  display: flex;
  border-radius: 7px;
  width: 100%;
  color: ${MAIN_BLUE};
  font-size: 16px;
  align-items: center;
  justify-content: center;
`;
