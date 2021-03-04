/**
 * A modal for showing the user last logins
 */
import Button from 'components/Buttons/Button';
import Modal from 'components/Modal/Modal';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import setIsAthunticatedAction from 'store/actions/auth/setIsAthunticatedAction';
import { decode } from 'js-base64';
import { useMediaQuery } from 'react-responsive';

/**
 * By signing in the user, this modal will be shown
 */
const LastLoginsModal = () => {
  const dispatch = useDispatch();

  const { lastLoginModal, lastLogins, loginMessage } = useSelector((state) => ({
    lastLoginModal: state.auth.lastLoginModal,
    lastLogins: state.auth.lastLogins,
    loginMessage: state.auth.auth?.LoginMessage,
  }));
  /**
   * By clicking close button, will fire.
   */
  const onClose = () => {
    dispatch(setIsAthunticatedAction(window?.IsAuthenticated));
  };
  const isMediumScreen = useMediaQuery({ query: '(min-width: 1224px)' });

  return (
    <Modal
      onClose={onClose}
      contentWidth={isMediumScreen ? '50%' : '80%'}
      show={lastLoginModal}>
      {console.log(loginMessage, 'loginMessage')}
      <Container>
        <Message>{loginMessage && decode(loginMessage)} </Message>

        <Row style={{ marginBottom: '3px' }}>
          <RowItem flex={1}>{'نوع اقدام'}</RowItem>
          <RowItem flex={2}>{'زمان'}</RowItem>
          <RowItem flex={2}>{'آدرس آی پی'}</RowItem>
        </Row>
        {lastLogins?.length > 0 &&
          lastLogins.map((x, index) => (
            <Row key={index}>
              <div>{index + 1}.</div>
              <RowItem flex={1}>{x?.Action}</RowItem>
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
