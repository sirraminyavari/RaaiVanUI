import React, { useState } from 'react';
import styled from 'styled-components';
import Modal from './Modal';

const { GlobalUtilities, RVDic, RV_RTL } = window;

const Confirm = ({ onConfirm, ...props }) => {
  const [showState, setShowState] = useState(props.show !== false);

  return (
    <Modal
      contentClass="small-8 medium-6 large-4"
      middle={true}
      titleClass="RedColor"
      show={showState}
      {...props}>
      <Message>{props.children}</Message>
      <ButtonsContainer>
        <ConfirmButton
          className="rv-action-button-base rv-action-button-red"
          onClick={() => {
            if (GlobalUtilities.get_type(onConfirm) == 'function') onConfirm();
            setShowState(false);
          }}>
          {RVDic.Confirm}
        </ConfirmButton>
        <CancelButton
          className="rv-action-button-base rv-action-button-o"
          onClick={() => setShowState(false)}>
          {RVDic.Cancel}
        </CancelButton>
      </ButtonsContainer>
    </Modal>
  );
};

export default Confirm;

const Message = styled.div`
  text-align: center;
  color: rgb(80, 80, 80);
  padding: 1.5rem 0 2rem 0;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-flow: row;
  justify-content: center;
`;

const ConfirmButton = styled.div`
  flex: 0 0 auto;
  width: 6rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  ${RV_RTL ? 'margin-left' : 'margin-right'}: 1rem;
`;

const CancelButton = styled.div`
  flex: 0 0 auto;
  width: 6rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
`;
