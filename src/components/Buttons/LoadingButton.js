/**
 * A Button with a loading state.
 */
import Loader from 'components/Loader/Loader';
import { MAIN_BLUE, MAIN_BLUE_HOVER } from 'const/Colors';
import React from 'react';
import styled from 'styled-components';

/**
 * Renders a button, can switch to loading mode when it's fetching.
 * @param {Boolean} isFetching - True in loading state,False in normal state
 * @param {Boolean} disabled - If True, onClick will not fire
 * @callback onClick - Fires, if user clicks the button.
 * @param {ReactNode|ReactNodeArray} children - The computed children for this slot.
 * @param {object} props - Other params that don't include above.
 */
const LoadingButton = ({
  isFetching = false,
  disabled = false,
  onClick,
  children,
  ...props
}) => {
  return (
    <Container isFetching={isFetching} {...props}>
      {isFetching ? (
        <Loader />
      ) : (
        <Button onClick={onClick} disabled={disabled}>
          {children}
        </Button>
      )}
    </Container>
  );
};

export default LoadingButton;

const Container = styled.div`
  display: flex;
  align-self: center;
  width: 100%;
  border: ${({ isFetching }) =>
    isFetching ? `solid 0.5px ${MAIN_BLUE}` : '#ffffff'};
  align-items: center;
  justify-content: center;
  border-radius: 13px;
  padding: 0px 0px 0px 0px;
  transition: background-color 0.5s;
  height: 47px;
  :hover {
    background-color: ${({ isFetching, backgroundHover = MAIN_BLUE_HOVER }) =>
      isFetching ? 'white' : backgroundHover};
  }
`;

const Button = styled.button`
  border-radius: 7px;
  width: 100%;
  height: 100%;
  color: #ffffff;
  font-size: 16px;
`;
