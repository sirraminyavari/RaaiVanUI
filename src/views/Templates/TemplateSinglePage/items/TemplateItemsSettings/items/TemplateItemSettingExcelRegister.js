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
})``;
export default TemplateItemSettingExcelRegister;
