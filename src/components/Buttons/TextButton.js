/**
 * A Button that has a loading state.
 */
import Loader from 'components/Loader/Loader';
import { MAIN_BLUE, MAIN_BLUE_HOVER } from 'const/Colors';
import React from 'react';
import styled from 'styled-components';

const TextButton = ({
  label,
  isFetching = false,
  disable = false,
  onClick,
  ...props
}) => {
  return (
    <>
      {isFetching ? (
        <Loader />
      ) : (
        <Button onClick={onClick} {...props}>
          {label}
        </Button>
      )}
    </>
  );
};

export default TextButton;

const Button = styled.button`
  border-radius: 7px;
  width: 100%;
  color: ${MAIN_BLUE};
  font-size: 16px;
`;
