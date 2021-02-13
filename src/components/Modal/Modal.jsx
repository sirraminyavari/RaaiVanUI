import React, { useState } from 'react';
import usePrevious from '../../hooks/usePrevious';
import CloseIcon from '../Icons/CloseIcon/CloseIcon';
import styled from 'styled-components';

const { GlobalUtilities, RV_RevFloat } = window;

const Modal = ({
  Title,
  NoBackground,
  Stick,
  Show = true,
  OnClose,
  ContentClass,
  ContentWidth,
  ...props
}) => {
  const [componentId, _setId] = useState(null);
  const [disposed, _setDisposed] = useState(false);
  const [showState, setShowState] = useState(Show);
  const prevDisposed = usePrevious(disposed);
  const prevShowState = usePrevious(showState);

  if (!componentId) {
    _setId('r' + GlobalUtilities.random_str(10));
    return <></>;
  }

  let disposedRecently = disposed && !prevDisposed;
  if (disposedRecently && GlobalUtilities.get_type(OnClose) == 'function')
    OnClose();

  if (!showState && prevShowState)
    GlobalUtilities.after_fade_out(() => {
      _setDisposed(true);
    });

  console.log('Modal ComponentID: ' + componentId);

  return disposed || (!showState && !prevShowState) ? (
    <></>
  ) : (
    <Container
      id={componentId}
      className={`RevDirection ${showState ? 'rv-fade-in' : 'rv-fade-out'}`}
      onClick={(e) => {
        e.stopPropagation();
        setShowState(false);
      }}>
      <ContentContainer>
        <ContentSection
          className={`Direction SoftBackgroundColor rv-border-radius-half  ${
            ContentClass || ' '
          }`}
          onClick={(e) => e.stopPropagation()}
          ContentWidth={ContentWidth}>
          {!Title && Stick ? (
            <></>
          ) : (
            <>
              <TitleContainer>
                <TitleArea>{Title}</TitleArea>
                {!Stick && (
                  <ExitButton
                    className="rv-circle RevTextAlign"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowState(false);
                    }}>
                    <CloseIcon />
                  </ExitButton>
                )}
              </TitleContainer>
              <Divider />
            </>
          )}
          <MainContent>{props.children}</MainContent>
        </ContentSection>
      </ContentContainer>
    </Container>
  );
};

export default Modal;

const Container = styled.div`
  display: flex;
  flex-flow: row;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 100%;
  overflow: auto;
  z-index: ${GlobalUtilities.zindex.dialog()};
  ${({ NoBackground }) => !NoBackground && `background: rgba(0, 0, 0, 0.75);`}
`;

const ExitButton = styled.div`
  flex: 0 0 auto;
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: bolder;
  color: white;
  width: 1.5rem;
  height: 1.5rem;
  background-color: red;
  font-size: 0.8rem;
`;

const ContentContainer = styled.div`
  width: 100%;
`;

const ContentSection = styled.div`
  margin: 5vw auto;
  cursor: default;
  ${({ ContentWidth }) => !ContentWidth || `width: ${ContentWidth};`}
`;

const MainContent = styled.div`
  padding: 1rem;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-flow: row;
  align-items: center;
  padding: 0.3rem;
`;

const TitleArea = styled.div`
  flex: 1 1 auto;
  padding: 0 0.5rem;
  font-weight: 500;
`;

const Divider = styled.div`
  padding-top: 1px;
  background-color: rgb(220, 220, 220);
  margin: 0 0.3rem 0.5rem 0;
`;
