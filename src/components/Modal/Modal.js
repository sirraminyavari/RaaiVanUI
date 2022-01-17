import { createPortal } from 'react-dom';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import usePrevious from 'hooks/usePrevious';
import useWindow from 'hooks/useWindowContext';
import CloseIcon from '../Icons/CloseIcon/CloseIcon';

const Modal = ({
  title,
  noBackground,
  middle,
  stick,
  show = true,
  onClose,
  contentClass,
  contentWidth,
  titleClass,
  titleContainerClass,
  ...props
}) => {
  const { GlobalUtilities } = useWindow();
  const [componentId] = useState('r' + GlobalUtilities.random_str(10));
  const [disposed, _setDisposed] = useState(false);
  const [showState, setShowState] = useState(show);
  const prevDisposed = usePrevious(disposed);
  const prevShowState = usePrevious(showState);

  useEffect(() => {
    setShowState(show);
    if (!!show) {
      _setDisposed(false);
    }
  }, [show]);

  useEffect(() => {
    let disposedRecently = disposed && !prevDisposed;
    if (disposedRecently && GlobalUtilities.get_type(onClose) === 'function')
      onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disposed]);

  if (!showState && prevShowState)
    GlobalUtilities.after_fade_out(() => {
      _setDisposed(true);
    });

  return createPortal(
    disposed || (!showState && !prevShowState) ? (
      <></>
    ) : (
      <Container
        GlobalUtilities={GlobalUtilities}
        id={componentId}
        className={`RevDirection ${showState ? 'rv-fade-in' : 'rv-fade-out'}`}
        noBackground={noBackground}
        middle={middle}
        onClick={(e) => {
          e.stopPropagation();
          setShowState(false);
        }}>
        <ContentContainer>
          <ContentSection
            className={`Direction rv-border-radius-half SurroundingShadow ${
              contentClass || ' '
            }`}
            onClick={(e) => e.stopPropagation()}
            contentWidth={contentWidth}>
            {!title && stick ? (
              <></>
            ) : (
              <>
                <TitleContainer
                  className={`rv-border-radius-half rv-ignore-bottom-radius ${titleContainerClass}`}>
                  {!stick && <EmptyTitleSide />}
                  <TitleArea
                    className={`${titleClass ? titleClass : 'WarmColor'}`}>
                    {title}
                  </TitleArea>
                  {!stick && (
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
              </>
            )}
            <MainContent {...props}>{props.children}</MainContent>
          </ContentSection>
        </ContentContainer>
      </Container>
    ),
    document.getElementById('root')
  );
};

export default Modal;

const Container = styled.div`
  display: flex;
  flex-flow: column;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 100%;
  overflow: auto;
  z-index: ${({ GlobalUtilities }) => GlobalUtilities.zindex.dialog()};
  ${({ middle }) => middle && `justify-content: center; padding-bottom:15vh;`}
  ${({ noBackground }) => !noBackground && `background: rgba(0, 0, 0, 0.75);`}
`;

const ExitButton = styled.div`
  flex: 0 0 auto;
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: bolder;
  color: red;
  width: 1.5rem;
  height: 1.5rem;
  font-size: 0.8rem;

  &:hover {
    color: white;
    background-color: red;
  }
`;

const EmptyTitleSide = styled.div`
  flex: 0 0 auto;
  width: 1.5rem;
`;

const ContentContainer = styled.div`
  flex: 0 0 auto;
  width: 100%;
`;

const ContentSection = styled.div`
  margin: 5vw auto;
  cursor: default;
  background-color: white;
  ${({ contentWidth }) => !contentWidth || `width: ${contentWidth};`}
`;

const MainContent = styled.div`
  padding: 1rem;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-flow: row;
  align-items: center;
  padding: 0.5rem 0.3rem;
  background-color: rgb(250, 250, 250);
`;

const TitleArea = styled.div`
  flex: 1 1 auto;
  padding: 0 0.5rem;
  font-weight: 600;
  font-size: 0.9rem;
  text-align: center;
`;
