/**
 * A component for showing the entered email and an option for editing it.
 */
import React from 'react';
import styled from 'styled-components';
import { AiOutlineEdit } from 'react-icons/ai';
import { useSelector } from 'react-redux';

/**
 * A function for showing the entered email and a button for editing the email
 * @param {callBack} editEmail A callback for return to entering email route
 */
const EnteredEmail = ({ editEmail }) => {
  const { email } = useSelector((state) => state.signup);

  return (
    <Container>
      <EditEmail onClick={editEmail} />
      <EmailAddress>{email}</EmailAddress>
    </Container>
  );
};

export default EnteredEmail;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 90%;
  align-self: center;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 13px;
`;
const EditEmail = styled(AiOutlineEdit)`
  color: #2b7be4;
  font-size: 23px;
`;
const EmailAddress = styled.div`
  font-size: 18px;
`;
