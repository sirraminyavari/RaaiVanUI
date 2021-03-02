/**
 * A modal for showing the user last logins
 */
import Modal from 'components/Modal/Modal';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

/**
 * By signing in the user, this modal will be shown
 */
const LastLoginsModal = () => {
  const { lastLoginModal, lastLogins } = useSelector((state) => ({
    lastLoginModal: state.login.lastLoginModal,
    lastLogins: state.login.lastLogins,
  }));

  return (
    <Modal contentWidth={'90%'} show={lastLoginModal}>
      <Row style={{ marginBottom: '3px' }}>
        <div>{'  '} </div>
        <RowItem flex={1}>{'نوع اقدام'}</RowItem>
        <RowItem flex={2}>{'زمان'}</RowItem>
        <RowItem flex={2}>{'آدرس آی پی'}</RowItem>
      </Row>
      {lastLogins?.length > 0 &&
        lastLogins.map((x, index) => (
          <Row>
            <div>{index + 1}.</div>
            <RowItem flex={1}>{x?.Action}</RowItem>
            <RowItem flex={2}>{x?.Date}</RowItem>
            <RowItem flex={2}>{x?.HostAddress}</RowItem>
          </Row>
        ))}
    </Modal>
  );
};
export default LastLoginsModal;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
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
