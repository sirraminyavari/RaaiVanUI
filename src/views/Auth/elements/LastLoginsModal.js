/**
 * A modal for showing the user last logins
 */
import Modal from 'components/Modal/Modal';
import { decode } from 'js-base64';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { useAuthSlice } from 'store/slice/auth';
import { selectAuth } from 'store/slice/auth/selectors';
import styled from 'styled-components';

const { RVDic } = window;

/**
 * By signing in the user, this modal will be shown
 */
const LastLoginsModal = ({ isVisible }) => {
  const dispatch = useDispatch();

  const { actions: authActions } = useAuthSlice();

  const { lastLogins, loginMessage } = useSelector(selectAuth);

  /**
   * By clicking close button, will fire.
   */
  const onClose = () => {
    dispatch(authActions.setIsAthunticated(true));
  };
  const isMediumScreen = useMediaQuery({ query: '(min-width: 1224px)' });

  return (
    <Modal
      onClose={onClose}
      contentWidth={isMediumScreen ? '50%' : '80%'}
      show={isVisible}
    >
      <Container>
        <Message>{loginMessage && decode(loginMessage)} </Message>
        <Message>{RVDic.LastLogins} </Message>

        <Row style={{ marginBottom: '3px' }}>
          <RowItem flex={1}>{RVDic.Action}</RowItem>
          <RowItem flex={2}>{RVDic.OnDate}</RowItem>
          <RowItem flex={2}>{RVDic.FromAddress}</RowItem>
        </Row>
        {lastLogins?.length > 0 &&
          lastLogins.map((x, index) => (
            <Row key={index}>
              <div>{index + 1}.</div>
              <RowItem flex={1}>
                {x?.Action === 'Login' ? RVDic.Login : RVDic.FailedLogin}
              </RowItem>
              <RowItem flex={2}>{x?.Date}</RowItem>
              <RowItem flex={2}>{x?.HostAddress}</RowItem>
            </Row>
          ))}
      </Container>
    </Modal>
  );
};

export default LastLoginsModal;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;
const RowItem = styled.div`
  display: flex;
  flex: ${({ flex }) => flex};
  text-align: center;
  width: 100%;
  align-self: center;
  margin: 3px;
  align-items: center;
  justify-content: center;
`;
const Message = styled.div`
  width: 100%;
  text-align: center;
  margin-bottom: 1rem;
`;
const Container = styled.div`
  width: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
`;
