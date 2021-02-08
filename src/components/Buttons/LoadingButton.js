/**
 * A Button that has a loading state.
 */
import Loader from 'components/Loader/Loader';
import { MAIN_BLUE, MAIN_BLUE_HOVER } from 'const/Colors';
import React from 'react';
import styled from 'styled-components';

const LoadingButton = ({
  label,
  isFetching = false,
  disable = false,
  onClick,
  ...props
}) => {
  return (
    <Container isFetching={isFetching} disable={disable} {...props}>
      {isFetching ? <Loader /> : <Button onClick={onClick}>{label}</Button>}
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
  border-radius: 7px;
  padding: 0px 0px 0px 0px;
  transition: background-color 0.5s;
  background-color: ${({ disable, isFetching, background = MAIN_BLUE }) =>
    isFetching ? 'white' : `${background}`};
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
