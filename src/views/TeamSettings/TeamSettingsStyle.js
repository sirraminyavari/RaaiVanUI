import styled from 'styled-components';

export const TeamSettingsCardWrapper = styled.div`
  padding: 0 1rem;
`;

export const TeamSettingsContainer = styled.div`
  direction: ${({ rtl }) => (rtl ? 'rtl' : 'ltr')};
  width: 100%;
  border-radius: 1rem;
  box-shadow: 1px 3px 20px #0000001f;
  padding: 4rem 2rem;
  position: relative;
`;

export const FormWrapper = styled.div`
  display: block;
  margin: 2rem auto;
  max-width: 24rem;
  width: 100%;
  box-sizing: border-box;
`;

export const TeamThumbnail = styled.img`
  height: 9rem;
  width: 9rem;
  border-radius: 100%;
`;
export const TeamTitle = styled.h1`
  display: block;
  margin: 2.5rem auto 1.5rem auto;
  border-bottom: var(--rv-color-distant) 0.05rem solid;
  text-align: center;
  height: 3rem;
  width: 14rem;
`;

export const TeamSubtitle = styled.div`
  display: block;
  margin: 1.5rem auto;
  color: var(--rv-gray-color);
  border-bottom: var(--rv-color-distant) 0.05rem solid;
  text-align: center;
  height: 2rem;
  width: 14rem;
  font-size: 1.12rem;
`;

export const SelectWrapper = styled.div``;
