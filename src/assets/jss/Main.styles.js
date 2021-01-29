import styled from 'styled-components';

export const MainContainer = styled.div({
  direction: window.RV_Direction,
});

export const ContentWrapper = styled.div({
  [window.RV_RTL ? 'marginRight' : 'marginLeft']: '250px',
  height: '100vh',
});

export const Content = styled.div({ marginTop: '100px' });
