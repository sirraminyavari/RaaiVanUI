import Button from 'components/Buttons/Button';
import styled from 'styled-components';

const TemplateItemSettingXMlRegister = () => {
  return (
    <>
      <ToggleButton>{'Xml ثبت چندگانه با'} </ToggleButton>
    </>
  );
};

const ToggleButton = styled(Button).attrs({
  type: 'primary-o',
})`
  height: 3rem;
  max-width: 13.5rem;
  width: 100%;
  font-weight: 500;
  border-radius: 0.78rem;
`;
export default TemplateItemSettingXMlRegister;
