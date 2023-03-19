import styled from 'styled-components';

export const MainLayout = styled.div.attrs({})`
  position: relative;
  display: flex;
  width: 100%;
  height: 100vh;
`;
export const MainLayoutContentContainer = styled.div.attrs({})`
  width: 100%;
  height: 100vh;
  & > div {
    max-height: 100vh;
  }
`;

export const MainLayoutSidebarContainer = styled.div.attrs({})`
  position: sticky;
  top: 0;
  height: 100vh;

  & > div {
    height: 100vh;
  }
`;
