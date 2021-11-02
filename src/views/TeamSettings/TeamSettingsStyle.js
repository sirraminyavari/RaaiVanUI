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

export const TeamThumbnailContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
export const TeamTitle = styled.h1`
  display: block;
  margin: 2.5rem auto 1.5rem auto;
  border-bottom: var(--rv-color-distant) 0.05rem solid;
  text-align: center;
  height: 3rem;
  width: 14rem;
  font-size: 1.75rem;
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

export const FieldWrapper = styled.div`
  margin-top: 2rem;
  padding: 0 0.2rem;
`;

export const SelectTitle = styled.div`
  direction: ${({ rtl }) => (rtl ? 'rtl' : 'ltr')};
  font-size: 1rem;
  color: var(--rv-gray-color-dark);
  font-weight: 500;
  margin: 0 0 0.5rem 0;
`;

export const SettingActionBar = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 4rem;
  padding: 0 0.2rem;
`;
