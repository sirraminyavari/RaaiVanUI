/**
 * A Button that has a loading state.
 */
import Loader from 'components/Loader/Loader';
import React from 'react';
import styled from 'styled-components';

const LoadingButton = ({ label, isFetching = true, disable, onClick }) => {
  return (
    <Container isFetching={isFetching} disable={disable}>
      {isFetching ? <Loader /> : <Button onClick={onClick}>{label}</Button>}
    </Container>
  );
};

export default LoadingButton;

const Container = styled.div`
  display: flex;
  align-self: center;
  margin: 13px;
  width: 90%;
  border: ${({ isFetching }) =>
    isFetching ? 'solid 0.5px #2b7be4' : '#ffffff'};
  align-items: center;
  justify-content: center;
  border-radius: 7px;
  padding: 13px 0px 13px 0px;
  background-color: ${({ disable, isFetching }) =>
    disable ? 'grey' : isFetching ? 'white' : '#2b7be4'};
  height: 47px;
`;

const Button = styled.button`
  border-radius: 7px;
  width: 100%;
  color: #ffffff;
  font-size: 16px;
`;
