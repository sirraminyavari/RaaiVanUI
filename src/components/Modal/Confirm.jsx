import React, { useState } from 'react';
import styled from 'styled-components';
import Modal from './Modal';
import Button from '../Buttons/Button';

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
        <Button
          type="negative"
          style={GlobalUtilities.extend(
            {
              flex: '0 0 auto',
              width: '6rem',
            },
            RV_RTL ? { marginLeft: '1rem' } : { marginRight: '1rem' }
          )}
          onClick={() => {
            if (GlobalUtilities.get_type(onConfirm) == 'function') onConfirm();
            setShowState(false);
          }}>
          {RVDic.Confirm}
        </Button>
        <Button
          type="primary-o"
          style={{
            flex: '0 0 auto',
            width: '6rem',
          }}
          onClick={() => setShowState(false)}>
          {RVDic.Cancel}
        </Button>
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
