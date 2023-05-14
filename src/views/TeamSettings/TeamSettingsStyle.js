import styled from 'styled-components';
import Heading from '../../components/Heading/Heading';

export const TeamSettingsCardWrapper = styled.div`
  padding: 0 1rem;
`;

export const PageTitle = styled(Heading).attrs({
  type: 'H1',
})`
  font-weight: bold;
`;

export const TeamSettingsContainer = styled.div`
  direction: ${({ rtl }) => (rtl ? 'rtl' : 'ltr')};
  width: 100%;
  border-radius: 1rem;
  // box-shadow: 1px 3px 20px #0000001f;
  padding: 0rem 2rem;
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
  justify-content: center;
  margin-top: 2rem;
  padding: 0 0.2rem;
`;
