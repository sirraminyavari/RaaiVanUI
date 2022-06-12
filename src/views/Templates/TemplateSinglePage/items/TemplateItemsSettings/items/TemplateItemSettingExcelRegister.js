import Button from 'components/Buttons/Button';
import styled from 'styled-components';

const TemplateItemSettingExcelRegister = () => {
  return (
    <>
      <ToggleButton>{'ثبت چندگانه با اکسل'} </ToggleButton>
    </>
  );
};

const ToggleButton = styled(Button).attrs({
  type: 'primary-o',
})`
  height: 3rem;
  max-width: 13.5rem;
  font-weight: 500;
  border-radius: 0.78rem;
  width: 100%;
`;
export default TemplateItemSettingExcelRegister;
