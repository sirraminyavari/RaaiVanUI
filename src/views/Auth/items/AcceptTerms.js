import React from 'react';
import styled from 'styled-components';

const AcceptTerms = () => {
  return (
    <Container>
      با ثبت ایمیل در کلیک مایند، شما میپذیرید که
      <LawsLink> قوانین کلیک مایند </LawsLink>
      را خوانده و به آن متعهد هستید
    </Container>
  );
};
export default AcceptTerms;

const Container = styled.div`
  max-width: 90%;
  align-self: center;
  text-align: right;
`;
const LawsLink = styled.a`
  color: #2b7be4;
`;
